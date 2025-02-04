import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react';
import { Switch } from "@/components/ui/switch"
import { IoChevronBack, IoInformationCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [language, setLanguage] = useState('english');
  const [region, setRegion] = useState('us');
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const infoContent = {
    about: {
      title: 'About Us',
      content: 'We are dedicated to providing innovative smart home solutions...'
    },
    privacy: {
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. We collect only necessary data...'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By using our services, you agree to our terms of service...'
    }
  };

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
              Settings
            </Heading>
            <Box width="30px" />
          </HStack>

          {!selectedInfo ? (
            <VStack p={6} mt={10} px={4} align="stretch">
              {/* Account Settings */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">Account Settings</Heading>
                <VStack padding={4} bg="white" borderRadius="xl" p={6} boxShadow="md">
                  <Flex w="100%" justify="space-between" align="center">
                    <Text>Language</Text>
                    <Select 
                      width="150px" 
                      value={language}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                    </Select>
                  </Flex>

                  <Flex w="100%" justify="space-between" align="center">
                    <Text>Region</Text>
                    <Select 
                      width="150px"
                      value={region}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value)}
                    >
                      <option value="us">United States</option>
                      <option value="eu">Europe</option>
                      <option value="asia">Asia</option>
                    </Select>
                  </Flex>

                  <Flex w="100%" justify="space-between" align="center">
                    <Text>Security</Text>
                    <Button 
                      variant="ghost" 
                      color="#43eb7f"
                      onClick={() => navigate('/security-settings')}
                    >
                      Manage →
                    </Button>
                  </Flex>

                  <Flex w="100%" justify="space-between" align="center">
                    <Text>Notifications</Text>
                    <Button 
                      variant="ghost" 
                      color="#43eb7f"
                      onClick={() => navigate('/notification-settings')}
                    >
                      Configure →
                    </Button>
                  </Flex>

                  <Flex w="100%" justify="space-between" align="center">
                    <Text>Temperature Unit</Text>
                    <HStack p={2}>
                      <Text>C</Text>
                      <Switch 
                        colorScheme="green"
                        checked={tempUnit === 'F'}
                        onChange={(e) => setTempUnit((e.target as HTMLInputElement).checked ? 'F' : 'C')}
                      />
                      <Text>F</Text>
                    </HStack>
                  </Flex>
                </VStack>
              </Box>

              {/* Other Settings */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">Other</Heading>
                <VStack padding={4} bg="white" borderRadius="xl" p={6} boxShadow="md">
                  {Object.entries(infoContent).map(([key, { title }]) => (
                    <Flex 
                      key={key}
                      w="100%" 
                      justify="space-between" 
                      align="center"
                      cursor="pointer"
                      _hover={{ bg: 'gray.50' }}
                      p={2}
                      borderRadius="md"
                      onClick={() => setSelectedInfo(key)}
                    >
                      <Text>{title}</Text>
                      <IoInformationCircle color="#43eb7f" />
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          ) : (
            /* Info Detail View */
            <Box mt={10} px={4}>
              <Flex align="center" mb={6}>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedInfo(null)}
                  leftIcon={<IoChevronBack />}
                >
                  Back
                </Button>
              </Flex>
              <Box bg="white" borderRadius="xl" p={6} boxShadow="md">
                <Heading size="md" mb={4} color="gray.700">
                  {infoContent[selectedInfo as keyof typeof infoContent].title}
                </Heading>
                <Text color="gray.600">
                  {infoContent[selectedInfo as keyof typeof infoContent].content}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;