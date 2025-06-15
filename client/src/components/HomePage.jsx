import React, { useEffect } from "react";
import { FaServer, FaClock, FaDollarSign } from "react-icons/fa";
import './HomePage.css';

const HomeSection = () => {
  return (
    <>      <div className="home-section">
        <div className="bg-blur-green"></div>
        <div className="bg-ring-green"></div>
        <h1 className="home-title">
          World's first decentralized P2P GPU Market
        </h1>
        <p className="home-description">
          Hyperspace is the world's first truly peer-to-peer GPU rental service.
          Use one simple client app to pay, provision and rent GPU globally.
        </p>
        <div className="home-buttons">
          <button className="home-btn">
            On-demand Pricing
          </button>
          <button className="home-btn">
            Interruptible Pricing
          </button>        </div>
        <img
          className="gpu-image-external"
          src="https://static.vecteezy.com/system/resources/previews/036/499/158/original/ai-generated-graphics-card-on-transparent-background-ai-png.png"
          alt="gpu--img"
        />
      </div>
    </>
  );
}

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
          <FaDollarSign size={32} color="#22E06L" />
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

function JoinUs() {
  return (
    <section className="joinUs fadeIn">
      <h2 className="joinUsTitle">Ready to Get Started?</h2>
      <p className="joinUsDesc">
        Join thousands of users who are already benefiting from our GPU sharing platform. 
        Whether you need powerful computing resources or want to monetize your idle GPUs, we've got you covered.
      </p>
      <button className="joinBtn ripple">Join Our Community</button>
    </section>
  );
}

function FAQ() {
  return (
    <section className="faqSection fadeIn">
      <h2 className="faqTitle">Frequently Asked Questions</h2>
      <div className="faqList">
        <div className="faqItem animatedCard">
          <div className="faqQuestion">
            What is GPU Share?
          </div>
          <div className="faqAnswer">
            GPU Share is a platform that connects individuals who need access to high-performance GPUs with those who have idle GPUs to rent out.
          </div>
        </div>
        <div className="faqItem animatedCard">
          <div className="faqQuestion">
            How does the rental process work?
          </div>
          <div className="faqAnswer">
            Simply sign up as a renter, browse available GPUs, and choose the one that fits your needs. You'll be able to contact the provider directly to arrange the details.
          </div>
        </div>
        <div className="faqItem animatedCard">
          <div className="faqQuestion">
            Is there a subscription fee?
          </div>
          <div className="faqAnswer">
            No, we don't charge any subscription fees. You only pay for the GPU resources you use.
          </div>
        </div>
        <div className="faqItem animatedCard">
          <div className="faqQuestion">
            How can I trust the GPU providers?
          </div>
          <div className="faqAnswer">
            We have a rating and review system in place for renters to provide feedback on their experience with GPU providers. It's always good to check the ratings and reviews before renting.
          </div>
        </div>
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section className="getStarted fadeIn">
      <h2 className="getStartedTitle">Get Started with GPU Share</h2>
      <p className="getStartedDesc">
        Experience the future of computing with GPU Share. Whether you're a developer, researcher, or just curious, our platform offers the resources you need to supercharge your projects.
      </p>
      <button className="getStartedBtn ripple">
        Sign Up Now
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerSection">
          <h3>GPU Chain</h3>
          <p>Democratizing access to GPU computing power through blockchain technology.</p>
        </div>
        <div className="footerSection">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footerSection">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#docs">Documentation</a></li>
            <li><a href="#community">Community</a></li>
            <li><a href="#status">Status</a></li>
          </ul>
        </div>
        <div className="footerSection">
          <h4>Connect</h4>
          <div className="socialLinks">
            <a href="#twitter" className="socialLink">Twitter</a>
            <a href="#discord" className="socialLink">Discord</a>
            <a href="#github" className="socialLink">GitHub</a>
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <p>&copy; 2025 GPU Chain. All rights reserved.</p>
      </div>
    </footer>
  );
}

function HomePage({ onAuth, onGoToBlockchain, onGoToGameGPU }) {
  return (
    <>
      <Header onAuth={onAuth} />
      <HomeSection />
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
        
        {/* Game GPU Section */}
        <div className="game-gpu-section">
          <div className="sectionTitle">🎮 Distributed GPU Gaming</div>
          <div className="game-gpu-desc">
            Experience next-level gaming by leveraging multiple peer GPUs for enhanced graphics rendering and performance.
          </div>
          <div className="game-gpu-features">
            <div className="feature-item">
              <h4>🚀 Real-time Load Balancing</h4>
              <p>Automatically distribute rendering tasks across connected peer GPUs</p>
            </div>
            <div className="feature-item">
              <h4>⚡ Enhanced Performance</h4>
              <p>Achieve higher FPS and better graphics quality using distributed processing</p>
            </div>
            <div className="feature-item">
              <h4>🌐 P2P GPU Sharing</h4>
              <p>Connect with other gamers to share GPU resources seamlessly</p>
            </div>
          </div>
          <button className="btn game-gpu-btn" onClick={onGoToGameGPU}>
            🎮 Try Distributed Gaming
          </button>
        </div>
        
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
