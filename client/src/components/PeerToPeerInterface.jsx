import React, { useState, useEffect, useRef } from 'react';
import { FaCircle, FaSignOutAlt, FaUser, FaServer, FaExchangeAlt } from 'react-icons/fa';
import PeerManager from '../PeerManager';
import './PeerToPeerInterface.css';

// Peer-to-Peer Interface Component
function PeerToPeerInterface({ userEmail, onLogout }) {
  const [peerId, setPeerId] = useState('')
  const [connId, setConnId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [peerManager, setPeerManager] = useState(null)
  const [notif, setNotif] = useState("");
  const [notifType, setNotifType] = useState("info");
  const [tab, setTab] = useState(0);
  const cardRef = useRef(null);

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

  // Card tilt effect
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * -8;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

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
        payload: {
          numbers: [1,2,3,4,5,6,7,8,9,10], // Example numbers array
          operation: 'sum' // Example operation
        },
        numPeers: 3,
        jobId: Math.random().toString(36).substr(2, 9)
      };
      peerManager.conn && peerManager.conn.send({ job });
      setMessages((msgs) => [...msgs, `You sent a job: Sample GPU job`]);
    }
  }

  useEffect(() => {
    const glow = document.createElement('div');
    glow.className = 'glow-cursor';
    document.body.appendChild(glow);
    const move = e => {
      glow.style.left = `${e.clientX - 30}px`;
      glow.style.top = `${e.clientY - 30}px`;
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.removeChild(glow);
    };
  }, []);

  return (
    <div className="p2pContainer fadeIn">
      <div
        className="p2pCard animatedCard"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p2pHeader">
          <div className="userInfo">
            <FaUser color="#22E06B" />
            <span>{userEmail}</span>
            <FaCircle color={isConnected ? 'green' : 'gray'} size={12} title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
          <div className="peerIdBox" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="peerIdLabel">Your Peer ID:</span>
            <span className="peerIdValue" style={{ userSelect: 'all', background: '#232d23', borderRadius: 4, padding: '2px 8px', fontFamily: 'monospace' }}>{peerId || '...'}</span>
            {peerId && (
              <button
                className="copyBtn"
                style={{ marginLeft: 4, background: 'none', border: 'none', color: '#22E06B', cursor: 'pointer', fontSize: 16, padding: 2 }}
                title="Copy Peer ID"
                onClick={() => { navigator.clipboard.writeText(peerId); }}
              >
                📋
              </button>
            )}
          </div>
          <button className="logoutBtn ripple" onClick={onLogout}>
            <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
          </button>
        </div>
        <div className="tabContainer">
          <button className={`tab ${tab === 0 ? "tabActive" : ""}`} onClick={() => setTab(0)} type="button">Peer Chat</button>
          <button className={`tab ${tab === 1 ? "tabActive" : ""}`} onClick={() => setTab(1)} type="button">Send Job</button>
        </div>
        <div className="tabPanels">
          {tab === 0 && (
            <div className="tabPanel slideInLeft">
              <div style={{ marginBottom: 16 }}>
                <input
                  className="input"
                  placeholder="Peer ID to connect"
                  value={connId}
                  onChange={e => setConnId(e.target.value)}
                  style={{ marginRight: 8, width: 200 }}
                />
                <button className="authBtn ripple" onClick={connectToPeer}>Connect</button>
              </div>
              <div className="chatBox">
                {messages.map((msg, idx) => (
                  <div key={idx} className="chatMsg">{msg}</div>
                ))}
              </div>
              <div className="p2pMessageRow" style={{ display: 'flex', gap: 0, alignItems: 'stretch', marginTop: 8 }}>
                <input
                  className="input"
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, minWidth: 0 }}
                />
                <button
                  className="authBtn ripple"
                  onClick={sendMessage}
                  disabled={!isConnected || !input.trim()}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1, minWidth: 90, fontSize: 16, fontWeight: 700, boxShadow: 'none' }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
          {tab === 1 && (
            <div className="tabPanel slideInRight">
              <button className="authBtn ripple" onClick={sendJob}>
                <FaServer style={{ marginRight: 6 }} /> Send GPU Job
              </button>
            </div>
          )}
        </div>
        {notif && (
          <div className={`message ${notifType === 'success' ? 'messageSuccess bounceIn' : notifType === 'error' ? 'messageError shake' : ''}`}
            style={{ marginTop: 18 }}>
            {notif}
          </div>
        )}
      </div>
    </div>
  )
}

export default PeerToPeerInterface;
