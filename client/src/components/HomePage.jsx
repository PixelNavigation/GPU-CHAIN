import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Card,
  CardBody,
  Stack,
} from "@chakra-ui/react";
import { FaServer, FaClock, FaDollarSign, FaArrowRight } from "react-icons/fa";

function Header({ onAuth }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box 
      as="header" 
      bg={bg} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="sticky"
      py={4}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Heading
            size="lg"
            bgGradient="linear(to-r, green.400, green.600)"
            bgClip="text"
          >
            GPU Share
          </Heading>
          <HStack spacing={4}>
            <Button
              variant="ghost"
              colorScheme="green"
              onClick={() => onAuth("login")}
            >
              Log in
            </Button>
            <Button
              colorScheme="green"
              onClick={() => onAuth("signup")}
            >
              Sign up
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function Hero() {
  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={bg} minH={{ base: "90vh", md: "80vh" }} display="flex" alignItems="center">
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          align="center" 
          justify="space-between"
          gap={8}
          minH={{ base: "60vh", md: "50vh" }}
        >
          <VStack align="start" spacing={6} maxW="600px">
            <Heading
              as="h1"
              size="3xl"
              bgGradient="linear(to-r, green.400, green.600)"
              bgClip="text"
              lineHeight="shorter"
            >
              Unlock the Power of Shared GPUs
            </Heading>
            <Text fontSize="xl" color={useColorModeValue("gray.600", "gray.300")}>
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
            w={{ base: "100%", md: "500px" }}
            h={{ base: "300px", md: "400px" }}
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <GpuSVG />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

function GpuSVG() {
  const strokeColor = useColorModeValue("green.500", "green.400");
  return (
    <Box
      as="svg"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      w="100%"
      h="100%"
    >
      <rect x="30" y="40" width="200" height="100" rx="16" fill="gray.800" stroke={strokeColor} strokeWidth="4"/>
      <rect x="50" y="60" width="160" height="60" rx="8" fill="gray.700" stroke="gray.600" strokeWidth="2"/>
      <circle cx="70" cy="90" r="10" fill={strokeColor} />
      <circle cx="210" cy="90" r="10" fill={strokeColor} />
      <rect x="110" y="75" width="60" height="30" rx="6" fill="gray.900" stroke={strokeColor} strokeWidth="2"/>
      <rect x="240" y="70" width="12" height="40" rx="3" fill={strokeColor} />
      <rect x="20" y="70" width="12" height="40" rx="3" fill={strokeColor} />
      <text x="140" y="98" textAnchor="middle" fill={strokeColor} fontSize="18" fontWeight="bold" fontFamily="monospace">GPU</text>
    </Box>
  );
}

function Features() {
  const features = [
    {
      icon: FaServer,
      title: "High-Performance GPUs",
      description: "Browse a wide selection of GPUs and find the perfect match for your needs.",
    },
    {
      icon: FaClock,
      title: "Flexible Access",
      description: "Access GPUs on demand, with flexible rental durations to suit your project timeline.",
    },
    {
      icon: FaDollarSign,
      title: "Cost-Effective",
      description: "Pay only for the resources you use, eliminating the need for expensive hardware purchases.",
    },
  ];

  return (
    <Box py={20} w="full">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="outline"
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s"
              h="full"
            >
              <CardBody>
                <VStack spacing={4} align="start" h="full">
                  <Icon as={feature.icon} w={8} h={8} color="green.400" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={useColorModeValue("gray.600", "gray.300")}>
                    {feature.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function JoinUs() {
  const bg = useColorModeValue("green.50", "green.900");

  return (
    <Box bg={bg} py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} textAlign="center">
          <Heading size="xl">Join Our Community</Heading>
          <Text fontSize="xl" maxW="700px">
            Want to be part of a vibrant GPU sharing community?
            <br />
            Connect, collaborate, and grow with like-minded tech enthusiasts!
          </Text>
          <Button
            size="lg"
            colorScheme="green"
            rightIcon={<FaArrowRight />}
            onClick={() => alert("Thank you for your interest! Community joining coming soon.")}
          >
            Join Us
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

function FAQ() {
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
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8}>
        <Heading textAlign="center">Frequently Asked Questions</Heading>
        <Accordion allowToggle w="100%" maxW="800px">
          {faqs.map((faq, i) => (
            <AccordionItem key={i}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium">
                    {faq.q}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  {faq.a}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
    </Container>
  );
}

function GetStarted() {
  const bg = useColorModeValue("green.50", "green.900");

  return (
    <Box bg={bg} py={20}>
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={6}>
          <Heading size="xl">Ready to Get Started?</Heading>
          <Text fontSize="xl" color={useColorModeValue("gray.600", "gray.300")}>
            Join our community and unlock the power of shared GPUs.
          </Text>
          <Button size="lg" colorScheme="green">
            Get Started
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

function Footer() {
  const bg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box bg={bg} borderTop="1px" borderColor={borderColor} py={8}>
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Text>Terms of Service</Text>
          <Text>Privacy Policy</Text>
          <Text>Support</Text>
          <Text>© 2024 GPU Share. All rights reserved.</Text>
        </Stack>
      </Container>
    </Box>
  );
}

function HomePage({ onAuth }) {
  const bg = useColorModeValue("gray.50", "gray.900");
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
      <Header onAuth={onAuth} />
      <Box as="main" flex="1" display="flex" flexDirection="column">
        <Hero />
        <Box flex="1">
          <Container maxW="container.xl" h="full" py={10}>
            <VStack spacing={16} align="stretch" minH="full">
              <Box textAlign="center">
                <Heading size="xl" mb={4}>How It Works</Heading>
                <Text fontSize="xl" color={useColorModeValue("gray.600", "gray.300")} maxW="800px" mx="auto">
                  Our platform connects renters with providers, offering a flexible and cost-effective solution for accessing powerful GPUs.
                </Text>
              </Box>
              <Features />
              <JoinUs />
              <FAQ />
              <GetStarted />
            </VStack>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default HomePage;
