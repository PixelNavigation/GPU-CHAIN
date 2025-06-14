import React, { useState, useEffect } from "react";
import PeerManager from './PeerManager'
import "./style.css";

function Header({ onAuth }) {
  return (
    <header className="header">
      <div className="logo">
        <span className="logoIcon">▲</span> GPU Share
      </div>
      <nav className="nav">
        <button className="btn" onClick={() => onAuth("login")}>Log in</button>
        <button className="btn btnSecondary" onClick={() => onAuth("signup")}>Sign up</button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="heroText">
        <div className="heroTitle">Unlock the Power of Shared GPUs</div>
        <div className="heroDesc">
          Access high-performance GPUs at a fraction of the cost. Join our community of renters and providers.
        </div>
        <div className="heroBtns">
          <button className="btn">Rent a GPU</button>
          <button className="btn btnSecondary">Rent Out a GPU</button>
        </div>
      </div>
      <GpuSVG />
    </div>
  );
}

// Simple GPU SVG illustration
function GpuSVG() {
  return (
    <svg
      className="gpuImage"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="30" y="40" width="200" height="100" rx="16" fill="#222" stroke="#22E06B" strokeWidth="4"/>
      <rect x="50" y="60" width="160" height="60" rx="8" fill="#2D2D2D" stroke="#B9CBB9" strokeWidth="2"/>
      <circle cx="70" cy="90" r="10" fill="#22E06B" />
      <circle cx="210" cy="90" r="10" fill="#22E06B" />
      <rect x="110" y="75" width="60" height="30" rx="6" fill="#18251C" stroke="#22E06B" strokeWidth="2"/>
      <rect x="240" y="70" width="12" height="40" rx="3" fill="#22E06B" />
      <rect x="20" y="70" width="12" height="40" rx="3" fill="#22E06B" />
      <text x="140" y="98" textAnchor="middle" fill="#22E06B" fontSize="18" fontWeight="bold" fontFamily="monospace">GPU</text>
    </svg>
  );
}

function Features() {
  return (
    <div className="features">
      <div className="featureCard">
        <div className="featureTitle">Rent GPUs</div>
        <div>Browse a wide selection of GPUs and find the perfect match for your needs.</div>
      </div>
      <div className="featureCard">
        <div className="featureTitle">Flexible Access</div>
        <div>Access GPUs on demand, with flexible rental durations to suit your project timeline.</div>
      </div>
      <div className="featureCard">
        <div className="featureTitle">Cost-Effective</div>
        <div>Pay only for the resources you use, eliminating the need for expensive hardware purchases.</div>
      </div>
    </div>
  );
}

function JoinUs() {
  return (
    <div className="joinUs">
      <h2 className="joinUsTitle">Join Our Community</h2>
      <p className="joinUsDesc">
        Want to be part of a vibrant GPU sharing community?  
        <br />
        Connect, collaborate, and grow with like-minded tech enthusiasts!
      </p>
      <button className="joinBtn" onClick={() => alert("Thank you for your interest! Community joining coming soon.")}>
        Join Us
      </button>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "What types of GPUs are available?",
      a: "We offer a wide range of GPUs from consumer to enterprise-grade, including NVIDIA and AMD models.",
    },
    {
      q: "How does billing work?",
      a: "Billing is based on the duration and type of GPU rented. You pay only for the time and resources you use.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use industry-standard encryption and security protocols to ensure your data remains protected.",
    },
  ];
  return (
    <div className="faq">
      <div className="sectionTitle">Frequently Asked Questions</div>
      {faqs.map((item, i) => (
        <div className="faqItem" key={i}>
          <button
            className="faqQuestion"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            {item.q}
          </button>
          {open === i && <div className="faqAnswer">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

function GetStarted() {
  return (
    <div className="getStarted">
      <div className="getStartedTitle">Ready to Get Started?</div>
      <div className="getStartedDesc">
        Join our community and unlock the power of shared GPUs.
      </div>
      <button className="btn">Get Started</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        Terms of Service
      </div>
      <div>
        Privacy Policy
      </div>
      <div>
        Support
      </div>
      <div>
        © 2024 GPU Share. All rights reserved.
      </div>
    </footer>
  );
}

// Unified Auth Page with Login & Signup Tabs
function AuthPage({ onBack, defaultTab = "login", onLoginSuccess }) {
  const [tab, setTab] = useState(defaultTab);
  const[name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  // Handles login POST
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Login successful!");
        // Call the success callback to redirect to P2P interface
        setTimeout(() => {
          onLoginSuccess(email);
        }, 1000);
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  // Handles signup POST
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Signup successful!");
        // Auto-switch to login tab after successful signup
        setTimeout(() => {
          setTab("login");
          setMessage("Account created! Please log in.");
        }, 1500);
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="tabContainer">
        <button
          className={
            "tab" + (tab === "login" ? " tabActive" : "")
          }
          onClick={() => setTab("login")}
        >
          Log In
        </button>
        <button
          className={
            "tab" + (tab === "signup" ? " tabActive" : "")
          }
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>
      {tab === "login" ? (
        <>
          <div className="authTitle">Log in to your account</div>
          <form onSubmit={handleLogin}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className="btn authBtn" type="submit">Log in</button>
          </form>
          <div className="authSwitch">
            Don't have an account?{" "}
            <span className="switchTab" onClick={() => setTab("signup")}>
              Sign up
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="authTitle">Create a new account</div>
          <form onSubmit={handleSignup}>
            <input
              className="input"
              type="name"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className="btn authBtn" type="submit">Sign up</button>
          </form>
          <div className="authSwitch">
            Already have an account?{" "}
            <span className="switchTab" onClick={() => setTab("login")}>
              Log in
            </span>
          </div>
        </>
      )}
      {message && (
        <div className="message" style={{ color: message.includes("success") ? "#22E06B" : "#ff5252" }}>
          {message}
        </div>
      )}
      <button
        className="btnSecondary backBtn"
        onClick={onBack}
      >
        Back to Home
      </button>
    </div>
  );
}

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
          <button className="btn btnSecondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <div className="p2pContent">
        <div className="peerInfo">
          <div>Your Peer ID: <b>{peerId}</b></div>
        </div>
        
        <div className="connectionSection">
          <input
            type="text"
            placeholder="Connect to peer ID"
            value={connId}
            onChange={e => setConnId(e.target.value)}
            className="input"
          />
          <button onClick={connectToPeer} className="btn">Connect</button>
        </div>
        
        <div className="messageSection">
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input"
          />
          <button onClick={sendMessage} className="btn">Send Message</button>
        </div>
        
        <div className="jobSection">
          <button onClick={sendJob} disabled={!isConnected} className="btn">
            Send GPU Job
          </button>
        </div>
        
        <div className="statusSection">
          <b>Status: </b>
          <span style={{color: isConnected ? '#22E06B' : '#ff5252'}}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        
        <div className="messagesSection">
          <b>Messages:</b>
          <div className="messagesList">
            {messages.map((msg, i) => <div key={i} className="message">{msg}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}


function App() {
  const [page, setPage] = useState("home");
  // "login" or "signup" as initial tab for AuthPage
  const [authTab, setAuthTab] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleAuth = (tab) => {
    setAuthTab(tab);
    setPage("auth");
  };

  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setPage("p2p");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setPage("home");
  };

  return (
    <div className="body">
      {page !== "auth" && page !== "p2p" && (
        <Header onAuth={handleAuth} />
      )}
      {page === "home" && (
        <main className="main">
          <Hero />
          <div className="sectionTitle">How It Works</div>
          <div className="howItWorksTitle">Seamless GPU Sharing</div>
          <div className="howItWorksDesc">
            Our platform connects renters with providers, offering a flexible and cost-effective solution for accessing powerful GPUs.
          </div>
          <Features />
          <JoinUs />
          <FAQ />
          <GetStarted />
        </main>
      )}
      {page === "auth" && (
        <AuthPage
          onBack={() => setPage("home")}
          defaultTab={authTab}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === "p2p" && (
        <PeerToPeerInterface
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}
      {page !== "p2p" && <Footer />}
    </div>
  );
}

export default App;
