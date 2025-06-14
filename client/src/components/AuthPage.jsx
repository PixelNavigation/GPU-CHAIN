import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  VStack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Alert,
  AlertIcon,
  useColorModeValue,
  Center
} from "@chakra-ui/react";
import './AuthPage.css';

// Unified Auth Page with Login & Signup Tabs
function AuthPage({ onBack, defaultTab = "login", onLoginSuccess }) {
  const [tab, setTab] = useState(defaultTab === "login" ? 0 : 1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const bgGradient = useColorModeValue(
    "linear(to-br, gray.100, white)",
    "linear(135deg, gray.900 0%, gray.800 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.900");

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
    <Center minH="100vh" w="100%" bgGradient={bgGradient}>
      <Box 
        w="full" 
        maxW="md" 
        mx={4}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="2xl"
        overflow="hidden"
        border="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Tabs
          isFitted
          variant="enclosed"
          index={tab}
          onChange={(index) => setTab(index)}
          colorScheme="green"
        >
          <TabList>
            <Tab 
              py={4} 
              _selected={{ 
                bg: "green.500", 
                color: "white" 
              }}
            >
              Log In
            </Tab>
            <Tab 
              py={4}
              _selected={{ 
                bg: "green.500", 
                color: "white" 
              }}
            >
              Sign Up
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} p={8}>
                <Text fontSize="2xl" fontWeight="bold">
                  Log in to your account
                </Text>
                <form style={{ width: '100%' }} onSubmit={handleLogin}>
                  <VStack spacing={4} w="100%">
                    <Input
                      bg={inputBg}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                    />
                    <Input
                      bg={inputBg}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                    />
                    <Button
                      w="100%"
                      colorScheme="green"
                      size="lg"
                      type="submit"
                    >
                      Log in
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} p={8}>
                <Text fontSize="2xl" fontWeight="bold">
                  Create a new account
                </Text>
                <form style={{ width: '100%' }} onSubmit={handleSignup}>
                  <VStack spacing={4} w="100%">
                    <Input
                      bg={inputBg}
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      size="lg"
                    />
                    <Input
                      bg={inputBg}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                    />
                    <Input
                      bg={inputBg}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                    />
                    <Button
                      w="100%"
                      colorScheme="green"
                      size="lg"
                      type="submit"
                    >
                      Sign up
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {message && (
          <Box px={8} pb={6}>
            <Alert
              status={message.includes("success") ? "success" : "error"}
              borderRadius="md"
            >
              <AlertIcon />
              {message}
            </Alert>
          </Box>
        )}

        <Box p={8} pt={0}>
          <Button
            variant="outline"
            w="100%"
            onClick={onBack}
            size="lg"
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

export default AuthPage;
