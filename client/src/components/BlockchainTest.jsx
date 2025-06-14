import React, { useState, useEffect } from 'react';
import { connectWallet, getContractInstance, registerAsWorker, createComputeTask, getWorkerInfo, getPlatformStats } from '../utils/blockchain';
import './BlockchainTest.css';

const BlockchainTest = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [workerInfo, setWorkerInfo] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [taskHash, setTaskHash] = useState('');
  const [reward, setReward] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      setStatus('Initializing blockchain connection...');
      const walletData = await connectWallet();
      if (walletData) {
        setAccount(walletData.account);
        setContract(walletData.contract);
        setStatus('Connected to wallet successfully!');
        
        // Load initial data
        await loadWorkerInfo(walletData.account);
        await loadPlatformStats();
      }
    } catch (error) {
      console.error('Blockchain initialization error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const loadWorkerInfo = async (accountAddress) => {
    try {
      if (!contract) return;
      const info = await getWorkerInfo(accountAddress);
      setWorkerInfo(info);
    } catch (error) {
      console.error('Error loading worker info:', error);
    }
  };

  const loadPlatformStats = async () => {
    try {
      const stats = await getPlatformStats();
      setPlatformStats(stats);
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const handleRegisterWorker = async () => {
    if (!peerId.trim()) {
      setStatus('Please enter a peer ID');
      return;
    }

    setLoading(true);
    try {
      setStatus('Registering as worker...');
      await registerAsWorker(peerId);
      setStatus('Successfully registered as worker!');
      await loadWorkerInfo(account);
      setPeerId('');
    } catch (error) {
      console.error('Worker registration error:', error);
      setStatus(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskHash.trim() || !reward) {
      setStatus('Please enter task hash and reward amount');
      return;
    }    setLoading(true);
    try {
      setStatus('Creating compute task...');
      const deadlineHours = 1; // 1 hour from now
      await createComputeTask(taskHash, deadlineHours, reward);
      setStatus('Task created successfully!');
      await loadPlatformStats();
      setTaskHash('');
      setReward('');
    } catch (error) {
      console.error('Task creation error:', error);
      setStatus(`Task creation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blockchain-test">
      <h2>🔗 Blockchain Integration Test</h2>
      
      <div className="status-section">
        <h3>Connection Status</h3>
        <div className={`status ${account ? 'connected' : 'disconnected'}`}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
        </div>
        <div className="status-message">{status}</div>
      </div>

      {account && (
        <>
          <div className="worker-section">
            <h3>👷 Worker Registration</h3>
            <div className="worker-info">
              {workerInfo ? (
                <div>
                  <p><strong>Registered:</strong> {workerInfo.isRegistered ? 'Yes' : 'No'}</p>
                  {workerInfo.isRegistered && (
                    <>
                      <p><strong>Peer ID:</strong> {workerInfo.peerId}</p>
                      <p><strong>Reputation:</strong> {workerInfo.reputation?.toString() || '0'}</p>
                      <p><strong>Completed Tasks:</strong> {workerInfo.completedTasks?.toString() || '0'}</p>
                      <p><strong>Pending Rewards:</strong> {workerInfo.pendingRewards?.toString() || '0'} ETH</p>
                    </>
                  )}
                </div>
              ) : (
                <p>Loading worker info...</p>
              )}
            </div>
            
            {!workerInfo?.isRegistered && (
              <div className="register-form">
                <input
                  type="text"
                  placeholder="Enter Peer ID"
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  disabled={loading}
                />
                <button onClick={handleRegisterWorker} disabled={loading}>
                  {loading ? 'Registering...' : 'Register as Worker'}
                </button>
              </div>
            )}
          </div>

          <div className="task-section">
            <h3>📋 Create Compute Task</h3>
            <div className="task-form">
              <input
                type="text"
                placeholder="Task Hash (e.g., QmX...)"
                value={taskHash}
                onChange={(e) => setTaskHash(e.target.value)}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Reward Amount (ETH)"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                step="0.001"
                min="0.001"
                disabled={loading}
              />
              <button onClick={handleCreateTask} disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>

          <div className="stats-section">
            <h3>📊 Platform Statistics</h3>
            {platformStats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Tasks:</span>
                  <span className="stat-value">{platformStats.totalTasks?.toString() || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed Tasks:</span>
                  <span className="stat-value">{platformStats.completedTasks?.toString() || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Rewards:</span>
                  <span className="stat-value">{platformStats.totalRewards?.toString() || '0'} ETH</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Workers:</span>
                  <span className="stat-value">{platformStats.activeWorkers?.toString() || '0'}</span>
                </div>
              </div>
            ) : (
              <p>Loading platform stats...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlockchainTest;
