// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ComputeReward
 * @dev Smart contract for GPU Chain P2P computing rewards
 * @notice Manages compute tasks, validates results, and distributes rewards
 */
contract ComputeReward is ERC20, Ownable, ReentrancyGuard {
    
    // Struct to represent a compute task
    struct ComputeTask {
        uint256 taskId;
        address requester;
        address worker;
        string taskHash; // IPFS hash or task identifier
        uint256 rewardAmount;
        uint256 deadline;
        TaskStatus status;
        string resultHash; // Hash of the computed result
        uint256 createdAt;
        uint256 completedAt;
    }
    
    // Enum for task status
    enum TaskStatus {
        PENDING,
        ASSIGNED,
        COMPLETED,
        VERIFIED,
        DISPUTED,
        CANCELLED
    }
    
    // Events
    event TaskCreated(uint256 indexed taskId, address indexed requester, uint256 rewardAmount);
    event TaskAssigned(uint256 indexed taskId, address indexed worker);
    event TaskCompleted(uint256 indexed taskId, string resultHash);
    event TaskVerified(uint256 indexed taskId, address indexed worker, uint256 rewardAmount);
    event RewardClaimed(address indexed worker, uint256 amount);
    event WorkerRegistered(address indexed worker, string peerId);
    event TaskDisputed(uint256 indexed taskId, string reason);
    
    // State variables
    mapping(uint256 => ComputeTask) public tasks;
    mapping(address => uint256[]) public userTasks; // Tasks created by user
    mapping(address => uint256[]) public workerTasks; // Tasks assigned to worker
    mapping(address => uint256) public workerRewards; // Pending rewards for workers
    mapping(address => string) public workerPeerIds; // Worker address to Peer ID mapping
    mapping(string => address) public peerIdToWorker; // Peer ID to worker address mapping
    mapping(address => bool) public registeredWorkers;
    mapping(address => uint256) public workerReputation; // Reputation score (0-100)
    
    uint256 public nextTaskId = 1;
    uint256 public totalTasksCreated;
    uint256 public totalTasksCompleted;
    uint256 public totalRewardsDistributed;
    
    // Configuration
    uint256 public constant TASK_TIMEOUT = 1 hours;
    uint256 public constant VERIFICATION_PERIOD = 10 minutes;
    uint256 public constant MIN_REWARD = 0.001 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 5; // 5% platform fee
    
    constructor() ERC20("GPU Chain Token", "GPUC") {
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint initial supply
    }
    
    /**
     * @dev Register as a compute worker
     * @param peerId The Peer.js ID for P2P communication
     */
    function registerWorker(string memory peerId) external {
        require(bytes(peerId).length > 0, "Invalid peer ID");
        require(!registeredWorkers[msg.sender], "Already registered");
        require(peerIdToWorker[peerId] == address(0), "Peer ID already taken");
        
        registeredWorkers[msg.sender] = true;
        workerPeerIds[msg.sender] = peerId;
        peerIdToWorker[peerId] = msg.sender;
        workerReputation[msg.sender] = 50; // Start with neutral reputation
        
        emit WorkerRegistered(msg.sender, peerId);
    }
    
    /**
     * @dev Create a new compute task
     * @param taskHash IPFS hash or identifier of the task
     * @param deadline Timestamp when task should be completed
     */
    function createTask(
        string memory taskHash,
        uint256 deadline
    ) external payable nonReentrant {
        require(msg.value >= MIN_REWARD, "Reward too low");
        require(deadline > block.timestamp, "Invalid deadline");
        require(bytes(taskHash).length > 0, "Invalid task hash");
        
        uint256 taskId = nextTaskId++;
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 rewardAmount = msg.value - platformFee;
        
        tasks[taskId] = ComputeTask({
            taskId: taskId,
            requester: msg.sender,
            worker: address(0),
            taskHash: taskHash,
            rewardAmount: rewardAmount,
            deadline: deadline,
            status: TaskStatus.PENDING,
            resultHash: "",
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        userTasks[msg.sender].push(taskId);
        totalTasksCreated++;
        
        emit TaskCreated(taskId, msg.sender, rewardAmount);
    }
    
    /**
     * @dev Assign task to a worker (can be called by worker or task creator)
     * @param taskId The ID of the task to assign
     * @param worker The address of the worker
     */
    function assignTask(uint256 taskId, address worker) external {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.status == TaskStatus.PENDING, "Task not available");
        require(registeredWorkers[worker], "Worker not registered");
        require(
            msg.sender == task.requester || msg.sender == worker,
            "Not authorized"
        );
        
        task.worker = worker;
        task.status = TaskStatus.ASSIGNED;
        workerTasks[worker].push(taskId);
        
        emit TaskAssigned(taskId, worker);
    }
    
    /**
     * @dev Submit task completion with result
     * @param taskId The ID of the completed task
     * @param resultHash Hash of the computed result
     */
    function submitResult(uint256 taskId, string memory resultHash) external {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.worker == msg.sender, "Not assigned to you");
        require(task.status == TaskStatus.ASSIGNED, "Task not in progress");
        require(block.timestamp <= task.deadline, "Task deadline passed");
        require(bytes(resultHash).length > 0, "Invalid result hash");
        
        task.resultHash = resultHash;
        task.status = TaskStatus.COMPLETED;
        task.completedAt = block.timestamp;
        
        emit TaskCompleted(taskId, resultHash);
    }
    
    /**
     * @dev Verify and approve task completion (called by requester)
     * @param taskId The ID of the task to verify
     */
    function verifyTask(uint256 taskId) external nonReentrant {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.requester == msg.sender, "Not your task");
        require(task.status == TaskStatus.COMPLETED, "Task not completed");
        
        task.status = TaskStatus.VERIFIED;
        workerRewards[task.worker] += task.rewardAmount;
        totalTasksCompleted++;
        
        // Update worker reputation
        if (workerReputation[task.worker] < 100) {
            workerReputation[task.worker] += 1;
        }
        
        emit TaskVerified(taskId, task.worker, task.rewardAmount);
    }
    
    /**
     * @dev Dispute a task result
     * @param taskId The ID of the task to dispute
     * @param reason Reason for the dispute
     */
    function disputeTask(uint256 taskId, string memory reason) external {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.requester == msg.sender, "Not your task");
        require(task.status == TaskStatus.COMPLETED, "Task not completed");
        require(
            block.timestamp <= task.completedAt + VERIFICATION_PERIOD,
            "Verification period expired"
        );
        
        task.status = TaskStatus.DISPUTED;
        
        // Decrease worker reputation
        if (workerReputation[task.worker] > 0) {
            workerReputation[task.worker] -= 5;
        }
        
        emit TaskDisputed(taskId, reason);
    }
    
    /**
     * @dev Auto-verify task if verification period expires
     * @param taskId The ID of the task to auto-verify
     */
    function autoVerifyTask(uint256 taskId) external nonReentrant {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.status == TaskStatus.COMPLETED, "Task not completed");
        require(
            block.timestamp > task.completedAt + VERIFICATION_PERIOD,
            "Verification period not expired"
        );
        
        task.status = TaskStatus.VERIFIED;
        workerRewards[task.worker] += task.rewardAmount;
        totalTasksCompleted++;
        
        // Update worker reputation
        if (workerReputation[task.worker] < 100) {
            workerReputation[task.worker] += 1;
        }
        
        emit TaskVerified(taskId, task.worker, task.rewardAmount);
    }
    
    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        uint256 amount = workerRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        
        workerRewards[msg.sender] = 0;
        totalRewardsDistributed += amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Get task details
     * @param taskId The ID of the task
     */
    function getTask(uint256 taskId) external view returns (ComputeTask memory) {
        require(tasks[taskId].taskId != 0, "Task does not exist");
        return tasks[taskId];
    }
    
    /**
     * @dev Get tasks created by a user
     * @param user The address of the user
     */
    function getUserTasks(address user) external view returns (uint256[] memory) {
        return userTasks[user];
    }
    
    /**
     * @dev Get tasks assigned to a worker
     * @param worker The address of the worker
     */
    function getWorkerTasks(address worker) external view returns (uint256[] memory) {
        return workerTasks[worker];
    }
    
    /**
     * @dev Get available tasks for workers
     * @param limit Maximum number of tasks to return
     */
    function getAvailableTasks(uint256 limit) external view returns (uint256[] memory) {
        uint256[] memory availableTaskIds = new uint256[](limit);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextTaskId && count < limit; i++) {
            if (tasks[i].status == TaskStatus.PENDING && tasks[i].deadline > block.timestamp) {
                availableTaskIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = availableTaskIds[j];
        }
        
        return result;
    }
    
    /**
     * @dev Get worker information
     * @param worker The address of the worker
     */
    function getWorkerInfo(address worker) external view returns (
        bool isRegistered,
        string memory peerId,
        uint256 reputation,
        uint256 pendingRewards,
        uint256 completedTasks
    ) {
        return (
            registeredWorkers[worker],
            workerPeerIds[worker],
            workerReputation[worker],
            workerRewards[worker],
            workerTasks[worker].length
        );
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalTasks,
        uint256 completedTasks,
        uint256 totalRewards,
        uint256 activeWorkers
    ) {
        // Count active workers (simplified)
        uint256 activeWorkerCount = 0;
        // Note: In production, you'd want a more efficient way to track this
        
        return (
            totalTasksCreated,
            totalTasksCompleted,
            totalRewardsDistributed,
            activeWorkerCount
        );
    }
    
    /**
     * @dev Emergency function to cancel task (only owner)
     * @param taskId The ID of the task to cancel
     */
    function emergencyCancel(uint256 taskId) external onlyOwner nonReentrant {
        ComputeTask storage task = tasks[taskId];
        require(task.taskId != 0, "Task does not exist");
        require(task.status != TaskStatus.VERIFIED, "Task already verified");
        
        task.status = TaskStatus.CANCELLED;
        
        // Refund the requester
        (bool success, ) = task.requester.call{value: task.rewardAmount}("");
        require(success, "Refund failed");
    }
    
    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
