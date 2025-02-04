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
import { IoChevronBack } from 'react-icons/io5';
import { FaGoogle, FaAmazon, FaSlack } from 'react-icons/fa';
import { SiSmartthings } from 'react-icons/si';

const ThirdPartyServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: 'Google Assistant',
      icon: <FaGoogle size={40} color="#4285F4" />,
      description: 'Connect your account to Google Assistant for voice-controlled automation.',
      link: 'https://assistant.google.com',
    },
    {
      name: 'Amazon Alexa',
      icon: <FaAmazon size={40} color="#FF9900" />,
      description: 'Enable Alexa skills to control your devices with voice commands.',
      link: 'https://alexa.amazon.com',
    },
    {
      name: 'SmartThings',
      icon: <SiSmartthings size={40} color="#00B4FF" />,
      description: 'Integrate with SmartThings for seamless smart home automation.',
      link: 'https://www.smartthings.com',
    },
    {
      name: 'Slack',
      icon: <FaSlack size={40} color="#4A154B" />,
      description: 'Get notifications and updates directly in your Slack workspace.',
      link: 'https://slack.com',
    },
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
          {/* Header */}
          <HStack justify="space-between" px={2}>
            <Button
              borderRadius="full"
              width="30px"
              height="40px"
              bg="#43eb7f"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
              aria-label="Back"
              onClick={() => navigate('/accountspage')}
            >
              <IoChevronBack color="white" />
            </Button>
            <Heading size="lg" flex="1" color="black">
              Third Party Services
            </Heading>
            <Box width="30px" />
          </HStack>

          {/* Services Grid */}
          <Flex
            wrap="wrap"
            justify="center"
            mt={10}
            px={4}
            gap="30px" // Creates space between items
          >
            {services.map((service, index) => (
              <Box
                key={index}
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                p={6}
                width={{ base: "100%", md: "calc(50% - 30px)", xl: "calc(33% - 30px)" }}
                maxW="500px"
                textAlign="center"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Flex direction="column" align="center" h="100%">
                  <Box mb={4}>{service.icon}</Box>
                  <Heading size="md" mb={2} color="gray.800">
                    {service.name}
                  </Heading>
                  <Text color="gray.600" mb={4} flex={1}>
                    {service.description}
                  </Text>
                  <Link 
                    href={service.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    width="100%"
                  >
                    <Button
                      bg="#43eb7f"
                      color="white"
                      _hover={{ bg: '#3ad073' }}
                      size="sm"
                      width="100%"
                    >
                      Learn More
                    </Button>
                  </Link>
                </Flex>
              </Box>
            ))}
          </Flex>

          {/* Footer */}
          <Box mt={10} textAlign="center" color="gray.500">
            <Text fontSize="sm">
              Need help? Contact support at{' '}
              <Link 
                href="mailto:support@example.com" 
                color="#43eb7f"
              >
                support@example.com
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ThirdPartyServices;