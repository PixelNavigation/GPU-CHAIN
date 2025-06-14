import React, { useEffect } from "react";
import { FaServer, FaClock, FaDollarSign } from "react-icons/fa";
import './HomePage.css';

function Header({ onAuth }) {
  return (
    <header className="headerBar fadeIn">
      <div className="headerContent">
        <h1 className="logoText">GPU Share</h1>
        <div>
          <button className="headerBtn" onClick={() => onAuth("login")}>Log in</button>
          <button className="headerBtn headerBtnPrimary" onClick={() => onAuth("signup")}>Sign up</button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="heroSection fadeIn">
      <div className="heroContent">
        <div className="heroText">
          <h1 className="heroTitle">Unlock the Power of Shared GPUs</h1>
          <p className="heroSubtitle">
            Access high-performance GPUs at a fraction of the cost. Join our community of renters and providers.
          </p>
          <div className="heroActions">
            <button className="heroBtn heroBtnPrimary ripple">Rent a GPU</button>
            <button className="heroBtn ripple">Provide a GPU</button>
          </div>
        </div>
        <div className="heroImage animatedCard">
          <FaServer size={120} color="#22E06B" />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="featuresSection fadeIn">
      <h2 className="featuresTitle">Why GPU Share?</h2>
      <div className="featuresGrid">
        <div className="featureCard animatedCard">
          <FaClock size={32} color="#22E06B" />
          <h3 className="featureTitle">On-Demand Access</h3>
          <p>Get instant access to GPU resources when you need them.</p>
        </div>
        <div className="featureCard animatedCard">
          <FaDollarSign size={32} color="#22E06B" />
          <h3 className="featureTitle">Affordable Pricing</h3>
          <p>Pay only for what you use. No hidden fees.</p>
        </div>
        <div className="featureCard animatedCard">
          <FaServer size={32} color="#22E06B" />
          <h3 className="featureTitle">Community Driven</h3>
          <p>Join a growing network of GPU providers and renters.</p>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onAuth }) {
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
    <>
      <Header onAuth={onAuth} />
      <Hero />
      <Features />
    </>
  );
}

export default HomePage;
