import React, { useState } from "react";
import './HomePage.css';

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

function HomePage({ onAuth, onGoToBlockchain }) {
  return (
    <>
      <Header onAuth={onAuth} />
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
        {/* Blockchain Test Section */}
        <div className="blockchain-test-section">
          <div className="sectionTitle">🔗 Blockchain Integration</div>
          <div className="blockchain-desc">
            Test our smart contract integration for decentralized GPU compute rewards.
          </div>
          <button className="btn" onClick={onGoToBlockchain}>
            Test Blockchain Features
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
