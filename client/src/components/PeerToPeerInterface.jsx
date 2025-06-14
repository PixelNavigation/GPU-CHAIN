import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useToast,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FaCircle,
  FaSignOutAlt, 
  FaUser, 
  FaServer,
  FaExchangeAlt
} from 'react-icons/fa';
import PeerManager from '../PeerManager'
import './PeerToPeerInterface.css'

// Peer-to-Peer Interface Component
function PeerToPeerInterface({ userEmail, onLogout }) {
  const [peerId, setPeerId] = useState('')
  const [connId, setConnId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [peerManager, setPeerManager] = useState(null)
  const toast = useToast()

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const messagesBg = useColorModeValue('gray.50', 'gray.700')

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

  const handleConnect = () => {
    toast({
      title: 'Connecting to peer...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    connectToPeer()
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Card mb={8} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center" wrap={{ base: "wrap", md: "nowrap" }} gap={4}>
              <Flex align="center" gap={4}>
                <Heading
                  size="lg"
                  bgGradient="linear(to-r, green.400, green.600)"
                  bgClip="text"
                >
                  GPU Share Network
                </Heading>
                <Badge 
                  colorScheme={isConnected ? "green" : "gray"}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  <Icon as={FaCircle} w={2} h={2} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </Flex>
              
              <Flex align="center" gap={4}>
                <Tooltip label={userEmail}>
                  <Flex align="center" color={mutedColor}>
                    <Icon as={FaUser} mr={2} />
                    <Text>{userEmail}</Text>
                  </Flex>
                </Tooltip>
                <Button
                  leftIcon={<FaSignOutAlt />}
                  variant="outline"
                  colorScheme="green"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <Heading size="md" color={textColor}>
                <Flex align="center" gap={2}>
                  <Icon as={FaServer} />
                  Network Status
                </Flex>
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Text color={mutedColor}>
                  {isConnected 
                    ? `Connected to: ${connId}`
                    : 'Not connected to any peer'}
                </Text>
                <Button
                  colorScheme="green"
                  isDisabled={isConnected}
                  onClick={handleConnect}
                  leftIcon={<FaExchangeAlt />}
                >
                  Connect to Peer
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* GPU Resources */}
          <Card>
            <CardHeader>
              <Heading size="md" color={textColor}>
                GPU Resources
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box p={4} bg={messagesBg} borderRadius="md">
                  <Text color={mutedColor}>Available GPUs: 2</Text>
                  <Text color={mutedColor}>Total Memory: 16GB</Text>
                  <Text color={mutedColor}>Utilization: 45%</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <Heading size="md" color={textColor}>
                Quick Actions
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Button colorScheme="green" w="full">
                  Share GPU
                </Button>
                <Button colorScheme="green" variant="outline" w="full">
                  Request GPU
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Messages Section */}
        <Card mt={8}>
          <CardHeader>
            <Heading size="md" color={textColor}>
              Network Messages
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Box
                maxH="400px"
                overflowY="auto"
                bg={messagesBg}
                p={4}
                borderRadius="md"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.500',
                    borderRadius: '24px',
                  },
                }}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <Box
                      key={index}
                      p={3}
                      mb={2}
                      bg={cardBg}
                      borderRadius="md"
                      borderLeft="4px"
                      borderLeftColor={msg.startsWith('You:') ? 'green.400' : 'orange.400'}
                    >
                      <Text color={textColor}>{msg}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color={mutedColor} textAlign="center" py={8}>
                    No messages yet
                  </Text>
                )}
              </Box>
              <Divider />
              <Flex gap={4}>
                <Input
                  placeholder="Type a message..."
                  bg={messagesBg}
                  border="1px"
                  borderColor={borderColor}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                />
                <Button colorScheme="green" onClick={sendMessage} disabled={!isConnected}>
                  Send
                </Button>
              </Flex>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default PeerToPeerInterface;
