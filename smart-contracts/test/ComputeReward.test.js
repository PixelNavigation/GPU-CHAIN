const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComputeReward Contract", function () {
  let computeReward;
  let owner;
  let worker1;
  let worker2;
  let requester;
  let addr1;

  beforeEach(async function () {
    [owner, worker1, worker2, requester, addr1] = await ethers.getSigners();
    
    const ComputeReward = await ethers.getContractFactory("ComputeReward");
    computeReward = await ComputeReward.deploy();
    await computeReward.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await computeReward.owner()).to.equal(owner.address);
    });

    it("Should mint initial token supply", async function () {
      const totalSupply = await computeReward.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("1000000"));
    });

    it("Should have correct token details", async function () {
      expect(await computeReward.name()).to.equal("GPU Chain Token");
      expect(await computeReward.symbol()).to.equal("GPUC");
    });
  });

  describe("Worker Registration", function () {
    it("Should allow worker registration", async function () {
      const peerId = "test-peer-id-123";
      
      await expect(computeReward.connect(worker1).registerWorker(peerId))
        .to.emit(computeReward, "WorkerRegistered")
        .withArgs(worker1.address, peerId);

      const [isRegistered, workerPeerId, reputation] = await computeReward.getWorkerInfo(worker1.address);
      expect(isRegistered).to.be.true;
      expect(workerPeerId).to.equal(peerId);
      expect(reputation).to.equal(50); // Initial reputation
    });

    it("Should not allow duplicate peer IDs", async function () {
      const peerId = "duplicate-peer-id";
      
      await computeReward.connect(worker1).registerWorker(peerId);
      
      await expect(computeReward.connect(worker2).registerWorker(peerId))
        .to.be.revertedWith("Peer ID already taken");
    });

    it("Should not allow empty peer ID", async function () {
      await expect(computeReward.connect(worker1).registerWorker(""))
        .to.be.revertedWith("Invalid peer ID");
    });
  });

  describe("Task Creation", function () {
    it("Should create a task with proper reward", async function () {
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const rewardAmount = ethers.parseEther("0.1");

      await expect(computeReward.connect(requester).createTask(taskHash, deadline, { value: rewardAmount }))
        .to.emit(computeReward, "TaskCreated");

      const task = await computeReward.getTask(1);
      expect(task.requester).to.equal(requester.address);
      expect(task.taskHash).to.equal(taskHash);
      expect(task.status).to.equal(0); // PENDING
    });

    it("Should reject tasks with insufficient reward", async function () {
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const lowReward = ethers.parseEther("0.0001");

      await expect(computeReward.connect(requester).createTask(taskHash, deadline, { value: lowReward }))
        .to.be.revertedWith("Reward too low");
    });

    it("Should reject tasks with past deadline", async function () {
      const taskHash = "QmTest123";
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const rewardAmount = ethers.parseEther("0.1");

      await expect(computeReward.connect(requester).createTask(taskHash, pastDeadline, { value: rewardAmount }))
        .to.be.revertedWith("Invalid deadline");
    });
  });

  describe("Task Assignment", function () {
    beforeEach(async function () {
      // Register worker
      await computeReward.connect(worker1).registerWorker("worker1-peer-id");
      
      // Create task
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      await computeReward.connect(requester).createTask(taskHash, deadline, { value: rewardAmount });
    });

    it("Should allow task assignment by requester", async function () {
      await expect(computeReward.connect(requester).assignTask(1, worker1.address))
        .to.emit(computeReward, "TaskAssigned")
        .withArgs(1, worker1.address);

      const task = await computeReward.getTask(1);
      expect(task.worker).to.equal(worker1.address);
      expect(task.status).to.equal(1); // ASSIGNED
    });

    it("Should allow self-assignment by worker", async function () {
      await expect(computeReward.connect(worker1).assignTask(1, worker1.address))
        .to.emit(computeReward, "TaskAssigned")
        .withArgs(1, worker1.address);
    });

    it("Should not allow assignment to unregistered worker", async function () {
      await expect(computeReward.connect(requester).assignTask(1, worker2.address))
        .to.be.revertedWith("Worker not registered");
    });
  });

  describe("Task Completion", function () {
    beforeEach(async function () {
      // Register worker and create/assign task
      await computeReward.connect(worker1).registerWorker("worker1-peer-id");
      
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      await computeReward.connect(requester).createTask(taskHash, deadline, { value: rewardAmount });
      await computeReward.connect(requester).assignTask(1, worker1.address);
    });

    it("Should allow result submission by assigned worker", async function () {
      const resultHash = "QmResult456";
      
      await expect(computeReward.connect(worker1).submitResult(1, resultHash))
        .to.emit(computeReward, "TaskCompleted")
        .withArgs(1, resultHash);

      const task = await computeReward.getTask(1);
      expect(task.resultHash).to.equal(resultHash);
      expect(task.status).to.equal(2); // COMPLETED
    });

    it("Should not allow result submission by non-assigned worker", async function () {
      await computeReward.connect(worker2).registerWorker("worker2-peer-id");
      const resultHash = "QmResult456";
      
      await expect(computeReward.connect(worker2).submitResult(1, resultHash))
        .to.be.revertedWith("Not assigned to you");
    });
  });

  describe("Task Verification and Rewards", function () {
    beforeEach(async function () {
      // Setup complete task flow
      await computeReward.connect(worker1).registerWorker("worker1-peer-id");
      
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      await computeReward.connect(requester).createTask(taskHash, deadline, { value: rewardAmount });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, "QmResult456");
    });

    it("Should allow verification by requester", async function () {
      await expect(computeReward.connect(requester).verifyTask(1))
        .to.emit(computeReward, "TaskVerified");

      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(3); // VERIFIED

      const [, , , pendingRewards] = await computeReward.getWorkerInfo(worker1.address);
      expect(pendingRewards).to.be.gt(0);
    });

    it("Should allow workers to claim rewards", async function () {
      await computeReward.connect(requester).verifyTask(1);
      
      const initialBalance = await ethers.provider.getBalance(worker1.address);
      const [, , , pendingRewards] = await computeReward.getWorkerInfo(worker1.address);
      
      await expect(computeReward.connect(worker1).claimRewards())
        .to.emit(computeReward, "RewardClaimed");

      const finalBalance = await ethers.provider.getBalance(worker1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should update worker reputation on verification", async function () {
      const [, , initialReputation] = await computeReward.getWorkerInfo(worker1.address);
      
      await computeReward.connect(requester).verifyTask(1);
      
      const [, , finalReputation] = await computeReward.getWorkerInfo(worker1.address);
      expect(finalReputation).to.equal(initialReputation + 1n);
    });
  });

  describe("Task Disputes", function () {
    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker("worker1-peer-id");
      
      const taskHash = "QmTest123";
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      await computeReward.connect(requester).createTask(taskHash, deadline, { value: rewardAmount });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, "QmResult456");
    });

    it("Should allow dispute by requester", async function () {
      const reason = "Incorrect computation";
      
      await expect(computeReward.connect(requester).disputeTask(1, reason))
        .to.emit(computeReward, "TaskDisputed")
        .withArgs(1, reason);

      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(4); // DISPUTED
    });

    it("Should decrease worker reputation on dispute", async function () {
      const [, , initialReputation] = await computeReward.getWorkerInfo(worker1.address);
      
      await computeReward.connect(requester).disputeTask(1, "Bad result");
      
      const [, , finalReputation] = await computeReward.getWorkerInfo(worker1.address);
      expect(finalReputation).to.equal(initialReputation - 5n);
    });
  });

  describe("Platform Statistics", function () {
    it("Should track platform statistics", async function () {
      // Create a few tasks
      await computeReward.connect(worker1).registerWorker("worker1-peer-id");
      
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      
      // Create and complete one task
      await computeReward.connect(requester).createTask("QmTest1", deadline, { value: rewardAmount });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, "QmResult1");
      await computeReward.connect(requester).verifyTask(1);
      
      // Create another task
      await computeReward.connect(requester).createTask("QmTest2", deadline, { value: rewardAmount });

      const [totalTasks, completedTasks, totalRewards] = await computeReward.getPlatformStats();
      
      expect(totalTasks).to.equal(2);
      expect(completedTasks).to.equal(1);
      expect(totalRewards).to.be.gt(0);
    });
  });

  describe("Available Tasks", function () {
    it("Should return available tasks", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const rewardAmount = ethers.parseEther("0.1");
      
      // Create multiple tasks
      await computeReward.connect(requester).createTask("QmTest1", deadline, { value: rewardAmount });
      await computeReward.connect(requester).createTask("QmTest2", deadline, { value: rewardAmount });
      await computeReward.connect(requester).createTask("QmTest3", deadline, { value: rewardAmount });

      const availableTasks = await computeReward.getAvailableTasks(10);
      expect(availableTasks.length).to.equal(3);
      expect(availableTasks[0]).to.equal(1);
      expect(availableTasks[1]).to.equal(2);
      expect(availableTasks[2]).to.equal(3);
    });
  });
});
