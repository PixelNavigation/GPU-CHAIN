import React, { useState } from "react";

// Simple CSS-in-JS for demonstration
const styles = {
  body: {
    background: "#18251C",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 32px",
    borderBottom: "1px solid #26332A",
    background: "#18251C",
  },
  logo: { fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center" },
  nav: { display: "flex", alignItems: "center", gap: 20 },
  main: { 
    width: "100vw",
    maxWidth: "100vw",
    margin: 0,
    padding: 0,
    boxSizing: "border-box"
  },
  hero: {
    background: "linear-gradient(120deg, #252A2F 60%, #1D2D1D 100%)",
    borderRadius: 16,
    padding: "48px 0",
    textAlign: "center",
    marginBottom: 40,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
    width: "100%",
    minHeight: 320,
    boxSizing: "border-box"
  },
  heroText: {
    flex: 1,
    minWidth: 300,
    textAlign: "left",
    paddingLeft: 48,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12 },
  heroDesc: { fontSize: 18, marginBottom: 28 },
  heroBtns: { display: "flex", gap: 16 },
  gpuImage: {
    width: 280,
    height: 180,
    display: "block",
    marginRight: 48,
    background: "none"
  },
  btn: {
    background: "#22E06B",
    color: "#18251C",
    border: "none",
    borderRadius: 24,
    padding: "12px 32px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnSecondary: {
    background: "#1F3927",
    color: "#fff",
    border: "1px solid #22E06B",
  },
  sectionTitle: { fontSize: 24, fontWeight: 700, margin: "40px 0 16px 48px" },
  features: { display: "flex", gap: 28, margin: "32px 48px" },
  featureCard: {
    background: "#22322A",
    borderRadius: 12,
    padding: 24,
    flex: 1,
    minWidth: 180,
  },
  faq: { margin: "40px 48px" },
  faqItem: {
    background: "#22322A",
    borderRadius: 8,
    marginBottom: 12,
    padding: "0 16px",
  },
  faqQuestion: {
    fontWeight: 600,
    padding: "18px 0",
    cursor: "pointer",
    border: "none",
    background: "none",
    color: "#fff",
    width: "100%",
    textAlign: "left",
    fontSize: 16,
  },
  faqAnswer: { padding: "0 0 18px 0", color: "#B9CBB9" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #26332A",
    padding: "24px 32px",
    color: "#B9CBB9",
    fontSize: 14,
    background: "#18251C",
    marginTop: 48
  },
  center: { textAlign: "center" },
  joinUs: {
    background: "#1F3927",
    borderRadius: 16,
    padding: "36px 24px",
    margin: "40px 48px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 2px 16px rgba(34,224,107,0.05)",
  },
  joinBtn: {
    background: "#22E06B",
    color: "#18251C",
    border: "none",
    borderRadius: 24,
    padding: "12px 32px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 18,
    transition: "background 0.2s",
  },
  loginContainer: {
    maxWidth: 420,
    margin: "80px auto",
    background: "#22322A",
    borderRadius: 16,
    padding: 36,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "14px 12px",
    margin: "12px 0",
    borderRadius: 8,
    border: "1px solid #26332A",
    background: "#18251C",
    color: "#fff",
    fontSize: 16,
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: "12px 0",
    cursor: "pointer",
    fontWeight: 700,
    background: "#22322A",
    color: "#B9CBB9",
    border: "none",
    borderRadius: "8px 8px 0 0",
    fontSize: 18,
    transition: "background 0.2s, color 0.2s",
  },
  tabActive: {
    background: "#22E06B",
    color: "#18251C",
  },
};

function Header({ onAuth }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={{ marginRight: 8, fontSize: 22 }}>▲</span> GPU Share
      </div>
      <nav style={styles.nav}>
        <button style={styles.btn} onClick={() => onAuth("login")}>Log in</button>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => onAuth("signup")}>Sign up</button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <div style={styles.hero}>
      <div style={styles.heroText}>
        <div style={styles.heroTitle}>Unlock the Power of Shared GPUs</div>
        <div style={styles.heroDesc}>
          Access high-performance GPUs at a fraction of the cost. Join our community of renters and providers.
        </div>
        <div style={styles.heroBtns}>
          <button style={styles.btn}>Rent a GPU</button>
          <button style={{ ...styles.btn, ...styles.btnSecondary }}>Rent Out a GPU</button>
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
      style={styles.gpuImage}
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
    <div style={styles.features}>
      <div style={styles.featureCard}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Rent GPUs</div>
        <div>Browse a wide selection of GPUs and find the perfect match for your needs.</div>
      </div>
      <div style={styles.featureCard}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Flexible Access</div>
        <div>Access GPUs on demand, with flexible rental durations to suit your project timeline.</div>
      </div>
      <div style={styles.featureCard}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Cost-Effective</div>
        <div>Pay only for the resources you use, eliminating the need for expensive hardware purchases.</div>
      </div>
    </div>
  );
}

function JoinUs() {
  return (
    <div style={styles.joinUs}>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Join Our Community</h2>
      <p style={{ fontSize: 17, marginBottom: 16 }}>
        Want to be part of a vibrant GPU sharing community?  
        <br />
        Connect, collaborate, and grow with like-minded tech enthusiasts!
      </p>
      <button style={styles.joinBtn} onClick={() => alert("Thank you for your interest! Community joining coming soon.")}>
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
    <div style={styles.faq}>
      <div style={styles.sectionTitle}>Frequently Asked Questions</div>
      {faqs.map((item, i) => (
        <div style={styles.faqItem} key={i}>
          <button
            style={styles.faqQuestion}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            {item.q}
          </button>
          {open === i && <div style={styles.faqAnswer}>{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

function GetStarted() {
  return (
    <div style={{ ...styles.center, margin: "60px 0" }}>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Ready to Get Started?</div>
      <div style={{ marginBottom: 28 }}>
        Join our community and unlock the power of shared GPUs.
      </div>
      <button style={styles.btn}>Get Started</button>
    </div>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
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
function AuthPage({ onBack, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);

  return (
    <div style={styles.loginContainer}>
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(tab === "login" ? styles.tabActive : {}),
          }}
          onClick={() => setTab("login")}
        >
          Log In
        </button>
        <button
          style={{
            ...styles.tab,
            ...(tab === "signup" ? styles.tabActive : {}),
          }}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>
      {tab === "login" ? (
        <>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Log in to your account</div>
          <form>
            <input style={styles.input} type="email" placeholder="Email" />
            <input style={styles.input} type="password" placeholder="Password" />
            <button style={{ ...styles.btn, width: "100%", margin: "18px 0" }} type="submit">Log in</button>
          </form>
          <div style={{ color: "#B9CBB9", marginTop: 10 }}>
            Don't have an account?{" "}
            <span style={{ color: "#22E06B", cursor: "pointer" }} onClick={() => setTab("signup")}>
              Sign up
            </span>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Create a new account</div>
          <form>
            <input style={styles.input} type="text" placeholder="Full Name" />
            <input style={styles.input} type="email" placeholder="Email" />
            <input style={styles.input} type="password" placeholder="Password" />
            <button style={{ ...styles.btn, width: "100%", margin: "18px 0" }} type="submit">Sign up</button>
          </form>
          <div style={{ color: "#B9CBB9", marginTop: 10 }}>
            Already have an account?{" "}
            <span style={{ color: "#22E06B", cursor: "pointer" }} onClick={() => setTab("login")}>
              Log in
            </span>
          </div>
        </>
      )}
      <button
        style={{
          ...styles.btnSecondary,
          width: "100%",
          marginTop: 24,
          padding: "10px 0",
        }}
        onClick={onBack}
      >
        Back to Home
      </button>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("home");
  // "login" or "signup" as initial tab for AuthPage
  const [authTab, setAuthTab] = useState("login");

  const handleAuth = (tab) => {
    setAuthTab(tab);
    setPage("auth");
  };

  return (
    <div style={styles.body}>
      {page !== "auth" && (
        <Header onAuth={handleAuth} />
      )}
      {page === "home" && (
        <main style={styles.main}>
          <Hero />
          <div style={styles.sectionTitle}>How It Works</div>
          <div style={{ fontSize: 22, fontWeight: 700, margin: "16px 48px" }}>Seamless GPU Sharing</div>
          <div style={{ color: "#B9CBB9", marginBottom: 18, marginLeft: 48 }}>
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
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
