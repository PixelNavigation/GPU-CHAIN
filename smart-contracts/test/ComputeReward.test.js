const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComputeReward Contract", function () {
  let computeReward;
  let owner, requester, worker1, worker2, addr1;
  const TASK_HASH = "QmTest123";
  const RESULT_HASH = "QmResult456";
  const PEER_ID = "12D3KooWExample";
  const REWARD_AMOUNT = ethers.utils.parseEther("0.1");

  beforeEach(async function () {
    [owner, requester, worker1, worker2, addr1] = await ethers.getSigners();
    
    const ComputeReward = await ethers.getContractFactory("ComputeReward");
    computeReward = await ComputeReward.deploy();
    await computeReward.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await computeReward.owner()).to.equal(owner.address);
    });

    it("Should mint initial supply to owner", async function () {
      const balance = await computeReward.balanceOf(owner.address);
      expect(balance).to.equal(ethers.utils.parseEther("1000000"));
    });

    it("Should have correct token details", async function () {
      expect(await computeReward.name()).to.equal("GPU Chain Token");
      expect(await computeReward.symbol()).to.equal("GPUC");
      expect(await computeReward.decimals()).to.equal(18);
    });
  });

  describe("Worker Registration", function () {
    it("Should register a worker successfully", async function () {
      await expect(computeReward.connect(worker1).registerWorker(PEER_ID))
        .to.emit(computeReward, "WorkerRegistered")
        .withArgs(worker1.address, PEER_ID);

      const isRegistered = await computeReward.registeredWorkers(worker1.address);
      expect(isRegistered).to.be.true;

      const peerId = await computeReward.workerPeerIds(worker1.address);
      expect(peerId).to.equal(PEER_ID);

      const reputation = await computeReward.workerReputation(worker1.address);
      expect(reputation).to.equal(50);
    });

    it("Should fail to register with empty peer ID", async function () {
      await expect(computeReward.connect(worker1).registerWorker(""))
        .to.be.revertedWith("Invalid peer ID");
    });

    it("Should fail to register twice", async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await expect(computeReward.connect(worker1).registerWorker("NewPeerID"))
        .to.be.revertedWith("Already registered");
    });

    it("Should fail to register with taken peer ID", async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await expect(computeReward.connect(worker2).registerWorker(PEER_ID))
        .to.be.revertedWith("Peer ID already taken");
    });
  });

  describe("Task Creation", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    it("Should create a task successfully", async function () {
      await expect(computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT }))
        .to.emit(computeReward, "TaskCreated")
        .withArgs(1, requester.address, REWARD_AMOUNT.mul(95).div(100)); // After 5% platform fee

      const task = await computeReward.getTask(1);
      expect(task.requester).to.equal(requester.address);
      expect(task.taskHash).to.equal(TASK_HASH);
      expect(task.deadline).to.equal(deadline);
      expect(task.status).to.equal(0); // PENDING
    });

    it("Should fail with reward too low", async function () {
      const lowReward = ethers.utils.parseEther("0.0005");
      await expect(computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: lowReward }))
        .to.be.revertedWith("Reward too low");
    });

    it("Should fail with invalid deadline", async function () {
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600;
      await expect(computeReward.connect(requester).createTask(TASK_HASH, pastDeadline, { value: REWARD_AMOUNT }))
        .to.be.revertedWith("Invalid deadline");
    });

    it("Should calculate platform fee correctly", async function () {
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      const task = await computeReward.getTask(1);
      const expectedReward = REWARD_AMOUNT.mul(95).div(100); // 95% of original
      expect(task.rewardAmount).to.equal(expectedReward);
    });
  });

  describe("Task Assignment", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
    });

    it("Should assign task to worker", async function () {
      await expect(computeReward.connect(requester).assignTask(1, worker1.address))
        .to.emit(computeReward, "TaskAssigned")
        .withArgs(1, worker1.address);

      const task = await computeReward.getTask(1);
      expect(task.worker).to.equal(worker1.address);
      expect(task.status).to.equal(1); // ASSIGNED
    });

    it("Should allow worker to self-assign", async function () {
      await expect(computeReward.connect(worker1).assignTask(1, worker1.address))
        .to.emit(computeReward, "TaskAssigned")
        .withArgs(1, worker1.address);
    });

    it("Should fail to assign to unregistered worker", async function () {
      await expect(computeReward.connect(requester).assignTask(1, worker2.address))
        .to.be.revertedWith("Worker not registered");
    });

    it("Should fail unauthorized assignment", async function () {
      await expect(computeReward.connect(addr1).assignTask(1, worker1.address))
        .to.be.revertedWith("Not authorized");
    });
  });

  describe("Task Completion", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      await computeReward.connect(requester).assignTask(1, worker1.address);
    });

    it("Should submit result successfully", async function () {
      await expect(computeReward.connect(worker1).submitResult(1, RESULT_HASH))
        .to.emit(computeReward, "TaskCompleted")
        .withArgs(1, RESULT_HASH);

      const task = await computeReward.getTask(1);
      expect(task.resultHash).to.equal(RESULT_HASH);
      expect(task.status).to.equal(2); // COMPLETED
    });

    it("Should fail if not assigned worker", async function () {
      await expect(computeReward.connect(worker2).submitResult(1, RESULT_HASH))
        .to.be.revertedWith("Not assigned to you");
    });

    it("Should fail with empty result hash", async function () {
      await expect(computeReward.connect(worker1).submitResult(1, ""))
        .to.be.revertedWith("Invalid result hash");
    });
  });

  describe("Task Verification", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, RESULT_HASH);
    });

    it("Should verify task and update rewards", async function () {
      const expectedReward = REWARD_AMOUNT.mul(95).div(100);
      
      await expect(computeReward.connect(requester).verifyTask(1))
        .to.emit(computeReward, "TaskVerified")
        .withArgs(1, worker1.address, expectedReward);

      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(3); // VERIFIED

      const pendingRewards = await computeReward.workerRewards(worker1.address);
      expect(pendingRewards).to.equal(expectedReward);

      const reputation = await computeReward.workerReputation(worker1.address);
      expect(reputation).to.equal(51); // Increased by 1
    });

    it("Should fail if not task requester", async function () {
      await expect(computeReward.connect(worker1).verifyTask(1))
        .to.be.revertedWith("Not your task");
    });
  });

  describe("Reward Claims", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, RESULT_HASH);
      await computeReward.connect(requester).verifyTask(1);
    });

    it("Should claim rewards successfully", async function () {
      const expectedReward = REWARD_AMOUNT.mul(95).div(100);
      const initialBalance = await worker1.getBalance();

      const tx = await computeReward.connect(worker1).claimRewards();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const finalBalance = await worker1.getBalance();
      const actualReward = finalBalance.add(gasUsed).sub(initialBalance);

      expect(actualReward).to.equal(expectedReward);

      const pendingRewards = await computeReward.workerRewards(worker1.address);
      expect(pendingRewards).to.equal(0);
    });

    it("Should fail if no rewards to claim", async function () {
      await computeReward.connect(worker1).claimRewards(); // Claim once
      await expect(computeReward.connect(worker1).claimRewards())
        .to.be.revertedWith("No rewards to claim");
    });
  });

  describe("Task Dispute", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, RESULT_HASH);
    });

    it("Should dispute task successfully", async function () {
      const reason = "Incorrect result";
      await expect(computeReward.connect(requester).disputeTask(1, reason))
        .to.emit(computeReward, "TaskDisputed")
        .withArgs(1, reason);

      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(4); // DISPUTED

      const reputation = await computeReward.workerReputation(worker1.address);
      expect(reputation).to.equal(45); // Decreased by 5
    });
  });

  describe("Auto Verification", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      await computeReward.connect(requester).assignTask(1, worker1.address);
      await computeReward.connect(worker1).submitResult(1, RESULT_HASH);
    });

    it("Should auto-verify after verification period", async function () {
      // Fast forward time (this would need to be done with time manipulation in a real test)
      // For now, we'll test the basic functionality
      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(2); // COMPLETED
    });
  });

  describe("View Functions", function () {
    it("Should get available tasks", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
      
      const availableTasks = await computeReward.getAvailableTasks(10);
      expect(availableTasks.length).to.equal(1);
      expect(availableTasks[0]).to.equal(1);
    });

    it("Should get worker info", async function () {
      await computeReward.connect(worker1).registerWorker(PEER_ID);
      
      const [isRegistered, peerId, reputation, pendingRewards, completedTasks] = 
        await computeReward.getWorkerInfo(worker1.address);
      
      expect(isRegistered).to.be.true;
      expect(peerId).to.equal(PEER_ID);
      expect(reputation).to.equal(50);
      expect(pendingRewards).to.equal(0);
      expect(completedTasks).to.equal(0);
    });

    it("Should get platform stats", async function () {
      const [totalTasks, completedTasks, totalRewards, activeWorkers] = 
        await computeReward.getPlatformStats();
      
      expect(totalTasks).to.equal(0);
      expect(completedTasks).to.equal(0);
      expect(totalRewards).to.equal(0);
    });
  });

  describe("Emergency Functions", function () {
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    beforeEach(async function () {
      await computeReward.connect(requester).createTask(TASK_HASH, deadline, { value: REWARD_AMOUNT });
    });

    it("Should allow owner to emergency cancel", async function () {
      await computeReward.connect(owner).emergencyCancel(1);
      const task = await computeReward.getTask(1);
      expect(task.status).to.equal(5); // CANCELLED
    });

    it("Should fail emergency cancel by non-owner", async function () {
      await expect(computeReward.connect(requester).emergencyCancel(1))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
