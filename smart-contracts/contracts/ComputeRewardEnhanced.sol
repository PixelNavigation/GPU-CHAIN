// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ComputeReward.sol";

/**
 * @title ComputeRewardEnhanced
 * @dev Enhanced version with additional hackathon features
 */
contract ComputeRewardEnhanced is ComputeReward {
    
    // Additional events for enhanced functionality
    event TaskBatch(uint256[] taskIds, address indexed requester);
    event WorkerStaked(address indexed worker, uint256 amount);
    event WorkerUnstaked(address indexed worker, uint256 amount);
    event TaskPrioritySet(uint256 indexed taskId, uint8 priority);
    
    // Enhanced structs
    struct TaskMetadata {
        uint8 priority; // 1-5, where 5 is highest priority
        string[] tags; // Tags for task categorization
        uint256 estimatedDuration; // Estimated duration in seconds
        uint256 requiredGpu; // Required GPU memory in MB
    }
    
    // Additional mappings
    mapping(uint256 => TaskMetadata) public taskMetadata;
    mapping(address => uint256) public workerStakes; // Worker stake amounts
    mapping(string => uint256[]) public tasksByTag; // Tasks by tag
    mapping(uint8 => uint256[]) public tasksByPriority; // Tasks by priority
    
    // Configuration
    uint256 public constant MIN_WORKER_STAKE = 0.01 ether;
    uint256 public constant HIGH_PRIORITY_MULTIPLIER = 150; // 1.5x reward for high priority
    
    /**
     * @dev Create a task with metadata
     */
    function createTaskWithMetadata(
        string memory taskHash,
        uint256 deadline,
        uint8 priority,
        string[] memory tags,
        uint256 estimatedDuration,
        uint256 requiredGpu
    ) external payable nonReentrant {
        require(priority >= 1 && priority <= 5, "Invalid priority");
        require(estimatedDuration > 0, "Invalid duration");
        
        // Create the basic task first
        uint256 taskId = nextTaskId++;
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 baseReward = msg.value - platformFee;
        
        // Apply priority multiplier
        uint256 finalReward = priority >= 4 ? 
            (baseReward * HIGH_PRIORITY_MULTIPLIER) / 100 : baseReward;
        
        tasks[taskId] = ComputeTask({
            taskId: taskId,
            requester: msg.sender,
            worker: address(0),
            taskHash: taskHash,
            rewardAmount: finalReward,
            deadline: deadline,
            status: TaskStatus.PENDING,
            resultHash: "",
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        // Set metadata
        taskMetadata[taskId] = TaskMetadata({
            priority: priority,
            tags: tags,
            estimatedDuration: estimatedDuration,
            requiredGpu: requiredGpu
        });
        
        // Update indices
        userTasks[msg.sender].push(taskId);
        tasksByPriority[priority].push(taskId);
        
        for (uint i = 0; i < tags.length; i++) {
            tasksByTag[tags[i]].push(taskId);
        }
        
        totalTasksCreated++;
        
        emit TaskCreated(taskId, msg.sender, finalReward);
        emit TaskPrioritySet(taskId, priority);
    }
    
    /**
     * @dev Stake tokens as a worker
     */
    function stakeAsWorker() external payable {
        require(msg.value >= MIN_WORKER_STAKE, "Insufficient stake");
        require(registeredWorkers[msg.sender], "Not registered as worker");
        
        workerStakes[msg.sender] += msg.value;
        
        emit WorkerStaked(msg.sender, msg.value);
    }
    
    /**
     * @dev Unstake worker tokens
     */
    function unstakeWorker(uint256 amount) external nonReentrant {
        require(workerStakes[msg.sender] >= amount, "Insufficient stake");
        require(amount > 0, "Invalid amount");
        
        workerStakes[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit WorkerUnstaked(msg.sender, amount);
    }
    
    /**
     * @dev Get tasks by tag
     */
    function getTasksByTag(string memory tag, uint256 limit) 
        external view returns (uint256[] memory) {
        uint256[] memory tagTasks = tasksByTag[tag];
        uint256 count = tagTasks.length > limit ? limit : tagTasks.length;
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tagTasks[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get tasks by priority
     */
    function getTasksByPriority(uint8 priority, uint256 limit) 
        external view returns (uint256[] memory) {
        uint256[] memory priorityTasks = tasksByPriority[priority];
        uint256 count = priorityTasks.length > limit ? limit : priorityTasks.length;
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = priorityTasks[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get worker stake information
     */
    function getWorkerStake(address worker) external view returns (uint256) {
        return workerStakes[worker];
    }
    
    /**
     * @dev Get task metadata
     */
    function getTaskMetadata(uint256 taskId) external view returns (TaskMetadata memory) {
        return taskMetadata[taskId];
    }
    
    /**
     * @dev Create multiple tasks in batch
     */
    function createTaskBatch(
        string[] memory taskHashes,
        uint256[] memory deadlines,
        uint8[] memory priorities
    ) external payable nonReentrant {
        require(taskHashes.length == deadlines.length, "Array length mismatch");
        require(taskHashes.length == priorities.length, "Array length mismatch");
        require(taskHashes.length > 0, "Empty batch");
        
        uint256[] memory taskIds = new uint256[](taskHashes.length);
        uint256 totalRequired = 0;
        
        // Calculate total required payment
        for (uint256 i = 0; i < taskHashes.length; i++) {
            totalRequired += MIN_REWARD;
        }
        
        require(msg.value >= totalRequired, "Insufficient payment");
        
        uint256 rewardPerTask = msg.value / taskHashes.length;
        
        for (uint256 i = 0; i < taskHashes.length; i++) {
            uint256 taskId = nextTaskId++;
            uint256 platformFee = (rewardPerTask * PLATFORM_FEE_PERCENT) / 100;
            uint256 finalReward = rewardPerTask - platformFee;
            
            tasks[taskId] = ComputeTask({
                taskId: taskId,
                requester: msg.sender,
                worker: address(0),
                taskHash: taskHashes[i],
                rewardAmount: finalReward,
                deadline: deadlines[i],
                status: TaskStatus.PENDING,
                resultHash: "",
                createdAt: block.timestamp,
                completedAt: 0
            });
            
            taskMetadata[taskId] = TaskMetadata({
                priority: priorities[i],
                tags: new string[](0),
                estimatedDuration: 0,
                requiredGpu: 0
            });
            
            userTasks[msg.sender].push(taskId);
            tasksByPriority[priorities[i]].push(taskId);
            taskIds[i] = taskId;
            
            emit TaskCreated(taskId, msg.sender, finalReward);
        }
        
        totalTasksCreated += taskHashes.length;
        
        emit TaskBatch(taskIds, msg.sender);
    }
}
