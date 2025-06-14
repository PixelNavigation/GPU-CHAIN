import React, { useState } from "react";
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import PeerToPeerInterface from './components/PeerToPeerInterface';
import "./style.css";

function App() {
  const [page, setPage] = useState("home");
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

  const handleBackToHome = () => {
    setPage("home");
  };

  return (
    <div className="body">
      {page === "home" && (
        <HomePage onAuth={handleAuth} />
      )}
      {page === "auth" && (
        <AuthPage
          onBack={handleBackToHome}
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
    </div>
  );
}

export default App;
