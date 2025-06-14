import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Link,
} from '@chakra-ui/react';
import { FaServer, FaRocket, FaShieldAlt } from 'react-icons/fa';

function Header({ onAuth }) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} py={4}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="green.400">
            GPU Share
          </Heading>
          <HStack spacing={4}>
            <Button colorScheme="green" variant="ghost" onClick={() => onAuth('login')}>
              Log in
            </Button>
            <Button colorScheme="green" onClick={() => onAuth('signup')}>
              Sign up
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function Hero() {
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bg} py={20}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
          <VStack align="start" spacing={6} maxW="600px" mb={{ base: 10, md: 0 }}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, green.400, green.600)"
              bgClip="text"
            >
              Unlock the Power of Shared GPUs
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
              Access high-performance GPUs at a fraction of the cost. Join our community of renters and providers.
            </Text>
            <HStack spacing={4}>
              <Button size="lg" colorScheme="green">
                Rent a GPU
              </Button>
              <Button size="lg" variant="outline" colorScheme="green">
                Rent Out a GPU
              </Button>
            </HStack>
          </VStack>
          <Box
            boxSize={{ base: '300px', md: '400px' }}
            bg="gray.800"
            borderRadius="xl"
            p={8}
            boxShadow="xl"
          >
            {/* GPU Illustration or Image here */}
            <svg
              viewBox="0 0 280 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <rect x="30" y="40" width="200" height="100" rx="16" fill="#222" stroke="#48BB78" strokeWidth="4"/>
              <rect x="50" y="60" width="160" height="60" rx="8" fill="#2D2D2D" stroke="#A0AEC0" strokeWidth="2"/>
              <circle cx="70" cy="90" r="10" fill="#48BB78" />
              <circle cx="210" cy="90" r="10" fill="#48BB78" />
              <rect x="110" y="75" width="60" height="30" rx="6" fill="#1A202C" stroke="#48BB78" strokeWidth="2"/>
              <rect x="240" y="70" width="12" height="40" rx="3" fill="#48BB78" />
              <rect x="20" y="70" width="12" height="40" rx="3" fill="#48BB78" />
            </svg>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

function Features() {
  const features = [
    {
      icon: FaServer,
      title: 'High-Performance GPUs',
      description: 'Access the latest GPU technology for your computing needs.',
    },
    {
      icon: FaRocket,
      title: 'Instant Access',
      description: 'Get started quickly with our streamlined platform.',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with enterprise-grade security.',
    },
  ];

  return (
    <Container maxW="container.xl" py={20}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {features.map((feature, index) => (
          <VStack
            key={index}
            align="start"
            p={6}
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="lg"
            boxShadow="xl"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)' }}
          >
            <Icon as={feature.icon} w={10} h={10} color="green.400" />
            <Heading size="md">{feature.title}</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              {feature.description}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Container>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'What types of GPUs are available?',
      answer: 'We offer a wide range of GPUs from consumer to enterprise-grade, including NVIDIA and AMD models.',
    },
    {
      question: 'How does billing work?',
      answer: 'Billing is based on the duration and type of GPU rented. You pay only for the time and resources you use.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security protocols to ensure your data remains protected.',
    },
  ];

  return (
    <Container maxW="container.xl" py={20}>
      <Heading mb={10} textAlign="center">Frequently Asked Questions</Heading>
      <Accordion allowToggle>
        {faqs.map((faq, index) => (
          <AccordionItem key={index}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="lg" fontWeight="medium">{faq.question}</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text color={useColorModeValue('gray.600', 'gray.300')}>
                {faq.answer}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}

function Footer() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={10}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} textAlign="center">
          <Link>Terms of Service</Link>
          <Link>Privacy Policy</Link>
          <Link>Support</Link>
          <Text>© 2024 GPU Share. All rights reserved.</Text>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// Unified Auth Page with Login & Signup Tabs
function AuthPage({ onBack, defaultTab = "login" }) {
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


function App() {
  const [page, setPage] = useState('home');
  const [authTab, setAuthTab] = useState('login');

  const handleAuth = (tab) => {
    setAuthTab(tab);
    setPage('auth');
  };

  return (
    <Box>
      {page === 'home' ? (
        <>
          <Header onAuth={handleAuth} />
          <Hero />
          <Features />
          <FAQ />
          <Footer />
        </>
      ) : (
        <AuthPage
          onBack={() => setPage('home')}
          defaultTab={authTab}
        />
      )}
    </Box>
  );
}

export default App;
