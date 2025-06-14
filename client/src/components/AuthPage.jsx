import React, { useState } from "react";
import './AuthPage.css';

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
    <div className="authContainer">
      <div className="authCard">
        <div className="tabContainer">
          <button
            className={`tab ${tab === "login" ? "tabActive" : ""}`}
            onClick={() => setTab("login")}
          >
            Log In
          </button>
          <button
            className={`tab ${tab === "signup" ? "tabActive" : ""}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        
        {tab === "login" ? (
          <>
            <div className="authTitle">Log in to your account</div>
            <form className="authForm" onSubmit={handleLogin}>
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
            <form className="authForm" onSubmit={handleSignup}>
              <input
                className="input"
                type="text"
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
          <div className={`message ${message.includes("success") ? "messageSuccess" : "messageError"}`}>
            {message}
          </div>
        )}
        
        <button className="backBtn" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
