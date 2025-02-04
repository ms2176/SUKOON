import React from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  Icon,
  Button,
  Text,
  Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { 
  IoChevronBack,
  IoCubeOutline,
  IoStatsChart,
  IoHardwareChipOutline,
  IoCalendar,
  IoShieldCheckmark
} from 'react-icons/io5';
import { FiBox, FiActivity, FiCheckSquare, FiClock, FiMonitor } from 'react-icons/fi';

const MoreTools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Virtual Home Tour",
      icon: <FiBox size={40} color="#4A90E2" />,
      description: "Explore your home in 3D with our interactive virtual tour",
      link: "/virtual-tour"
    },
    {
      name: "Energy Usage Analyzer",
      icon: <FiActivity size={40} color="#7ED321" />,
      description: "Track and optimize your home's energy consumption patterns",
      link: "/energy-analysis"
    },
    {
      name: "Device Compatibility Checker",
      icon: <IoHardwareChipOutline size={40} color="#FF6B6B" />,
      description: "Verify device compatibility before adding to your network",
      link: "/compatibility-check"
    },
    {
      name: "Smart Schedule Planner",
      icon: <FiClock size={40} color="#F5A623" />,
      description: "Create automated routines for all connected devices",
      link: "/schedule-planner"
    },
    {
      name: "Security Monitor",
      icon: <IoShieldCheckmark size={40} color="#9013FE" />,
      description: "Real-time security status of all connected devices",
      link: "/security-monitor"
    },
    {
      name: "Maintenance Predictor",
      icon: <FiCheckSquare size={40} color="#50E3C2" />,
      description: "AI-powered predictions for device maintenance needs",
      link: "/maintenance-predictor"
    }
  ];

  return (
    <Box minH="100vh" bg="gray.100">
      <Box p={0} m={0}>
        <Box 
          as="header" 
          bgColor="white"
          p={4}
          textAlign="center"
          position="relative"
          minH="100vh"
        >
          {/* Header with Glowing Back Button */}
          <HStack justify="space-between" px={2}>
            <Button
              borderRadius="full"
              width="30px"
              height="40px"
              bg="#43eb7f"
              boxShadow="0 4px 12px rgba(67, 235, 127, 0.3)"
              _hover={{ boxShadow: '0 4px 15px rgba(67, 235, 127, 0.5)' }}
              aria-label="Back"
              onClick={() => navigate('/accountspage')}
            >
              <IoChevronBack color="white" />
            </Button>
            <Heading size="lg" flex="1" color="black" letterSpacing="tight">
              Advanced Tools
            </Heading>
            <Box width="30px" />
          </HStack>

          {/* Tools Grid with Hover Effects */}
          <Flex
            wrap="wrap"
            justify="center"
            mt={10}
            px={4}
            gap="30px"
          >
            {tools.map((tool, index) => (
              <Box
                key={index}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                p={8}
                width={{ base: "100%", md: "calc(50% - 30px)", xl: "calc(33% - 30px)" }}
                minH="300px"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{ 
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl'
                }}
              >
                <Flex direction="column" align="center" h="100%" justify="space-between">
                  {/* Header with Icon and Title on the Same Line */}
                  <Flex align="center" mb={6} width="100%">
                    <Box mr={4}>{tool.icon}</Box>
                    <Heading size="md" color="black" fontWeight="bold" textAlign="center" flex={1}>
                      {tool.name}
                    </Heading>
                  </Flex>

                  {/* Description */}
                  <Text color="gray.600" fontSize="md" mb={6} textAlign="center">
                    {tool.description}
                  </Text>

                  {/* Explore Button */}
                  <Button
                    mt={6}
                    bg="linear-gradient(135deg, #43eb7f 0%, #3ad073 100%)"
                    color="white"
                    _hover={{ opacity: 0.9 }}
                    size="md"
                    width="100%"
                    boxShadow="md"
                    onClick={() => navigate(tool.link)}
                  >
                    Explore Tool
                  </Button>
                </Flex>
              </Box>
            ))}
          </Flex>

          {/* Futuristic Footer */}
          <Box mt={12} textAlign="center" color="gray.500">
            <Text fontSize="sm" opacity={0.8}>
              Powered by SmartHome AI • 
              <Link 
                href="mailto:support@smarthome.com" 
                color="#43eb7f"
                ml={2}
              >
                Request New Tool
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MoreTools;