import React, { useState, useEffect } from 'react'
import PeerManager from '../PeerManager'
import './PeerToPeerInterface.css'

// Peer-to-Peer Interface Component
function PeerToPeerInterface({ userEmail, onLogout }) {
  const [peerId, setPeerId] = useState('')
  const [connId, setConnId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [peerManager, setPeerManager] = useState(null)

  useEffect(() => {
    const pm = new PeerManager((data) => {
      setMessages(msgs => [...msgs, `Received result: ${data.result} (jobId: ${data.jobId})`])
    })
    pm.onPeerId = setPeerId
    setPeerManager(pm)
    // Listen for connection events
    pm.peer.on('connection', conn => {
      setIsConnected(true)
      conn.on('close', () => setIsConnected(false))
      conn.on('error', () => setIsConnected(false))
      conn.on('data', data => {
        // Show plain messages as well as job results
        if (typeof data === 'string') {
          setMessages(msgs => [...msgs, `Peer: ${data}`])
        } else if (data.result !== undefined) {
          setMessages(msgs => [...msgs, `Received result: ${data.result} (jobId: ${data.jobId})`])
        }
      })
    })
    return () => pm.peer.destroy()
  }, [])

  const connectToPeer = () => {
    if (!connId || !peerManager) return
    peerManager.connectToPeer(connId)
    if (peerManager.conn) {
      peerManager.conn.on('open', () => setIsConnected(true))
      peerManager.conn.on('close', () => setIsConnected(false))
      peerManager.conn.on('error', () => setIsConnected(false))
      peerManager.conn.on('data', data => {
        if (typeof data === 'string') {
          setMessages(msgs => [...msgs, `Peer: ${data}`])
        } else if (data.result !== undefined) {
          setMessages(msgs => [...msgs, `Received result: ${data.result} (jobId: ${data.jobId})`])
        }
      })
    }
  }

  const sendMessage = () => {
    if (peerManager && input) {
      peerManager.conn && peerManager.conn.send(input)
      setMessages((msgs) => [...msgs, `You: ${input}`])
      setInput('')
    }
  }

  const sendJob = () => {
    if (peerManager) {
      const job = {
        type: 'compute',
        payload: {
          numbers: [1, 2, 3, 4, 5],
          operation: 'sum',
        },
        from: peerId,
        timestamp: Date.now(),
      }
      peerManager.sendJob(job)
      setMessages((msgs) => [...msgs, `You sent job: ${JSON.stringify(job)}`])
    }
  }
  return (
    <div className="p2pContainer">
      <div className="p2pHeader">
        <h2>GPU Chain - Peer-to-Peer Computing</h2>
        <div className="userInfo">
          <span>Welcome, {userEmail}</span>
          <button className="logoutBtn" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <div className="p2pContent">
        <div className="p2pSection">
          <div className="sectionTitle">📱 Your Peer ID</div>
          <div className="peerInfo">
            <div>Your Peer ID:</div>
            <b>{peerId || 'Generating...'}</b>
          </div>
        </div>
        
        <div className="p2pSection">
          <div className="sectionTitle">🔗 Connect to Peer</div>
          <div className="inputGroup">
            <input
              type="text"
              placeholder="Enter peer ID to connect"
              value={connId}
              onChange={e => setConnId(e.target.value)}
              className="input"
            />
            <button onClick={connectToPeer} className="btn">Connect</button>
          </div>
        </div>
        
        <div className="p2pSection">
          <div className="sectionTitle">💬 Send Message</div>
          <div className="inputGroup">
            <input
              type="text"
              placeholder="Type a message"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="input"
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="btn" disabled={!isConnected}>
              Send
            </button>
          </div>
        </div>
        
        <div className="p2pSection">
          <div className="sectionTitle">🚀 GPU Computing</div>
          <button 
            onClick={sendJob} 
            disabled={!isConnected} 
            className="btn"
            style={{ width: '100%' }}
          >
            {isConnected ? 'Send GPU Job' : 'Connect to Send Jobs'}
          </button>
        </div>
        
        <div className="p2pSection">
          <div className="sectionTitle">📊 Connection Status</div>
          <div className={`statusIndicator ${isConnected ? 'statusConnected' : 'statusDisconnected'}`}>
            <span className="statusDot"></span>
            {isConnected ? 'Connected' : 'Not Connected'}
          </div>
        </div>
        
        <div className="p2pSection messagesSection">
          <div className="sectionTitle">📨 Messages & Results</div>
          <div className="messagesList">
            {messages.length === 0 ? (
              <div className="emptyMessages">No messages yet. Connect to a peer to start chatting!</div>
            ) : (
              messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`message ${
                    msg.startsWith('You:') ? 'messageYou' : 
                    msg.startsWith('Peer:') ? 'messagePeer' : 
                    'messageSystem'
                  }`}
                >
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeerToPeerInterface;
