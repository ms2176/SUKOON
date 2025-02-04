import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  Icon,
  Input,
  Button,
  defineStyle,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/form-control';
import { Avatar } from "@/components/ui/avatar";
import { FiSettings, FiUser, FiPhone, FiEdit } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AccInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [avatarSrc, setAvatarSrc] = useState('https://via.placeholder.com/150');
  
  // Load saved data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('profileData');
    if (savedData) {
      const { name, email, phone, avatar } = JSON.parse(savedData);
      setName(name);
      setEmail(email);
      setPhone(phone);
      if (avatar) setAvatarSrc(avatar);
    }
  }, []);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhone(value);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Avatar editing functionality
  const handleAvatarEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarSrc(reader.result);
          // Save to session storage
          const savedData = sessionStorage.getItem('profileData');
          const profileData = savedData ? JSON.parse(savedData) : {};
          sessionStorage.setItem('profileData', 
            JSON.stringify({ ...profileData, avatar: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };



  const handleSave = () => {
    if (!validateEmail(email)) return;
    
    const profileData = { 
      name, 
      email, 
      phone,
      avatar: avatarSrc
    };
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    navigate('/accountspage');
  };


  const handleCancel = () => {
    // Reset to original saved values or empty
    const savedData = sessionStorage.getItem('profileData');
    if (savedData) {
      const { name, email, phone, avatar } = JSON.parse(savedData);
      setName(name);
      setEmail(email);
      setPhone(phone);
      setAvatarSrc(avatar || 'https://via.placeholder.com/150'); // Reset avatar
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAvatarSrc('https://via.placeholder.com/150'); // Reset to default
    }
    navigate('/accountspage');
  };
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

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
              Profile Edit
            </Heading>
            <Icon boxSize={6} as={FiSettings} />
          </HStack>

          <Flex align="center" direction="column" mt={6} pt={9}>
          <Box position="relative">
              <Avatar
                p={12}
                size="2xl"
                src={avatarSrc}
                name="Profile"
                colorPalette="green"
                css={defineStyle({
                  outlineWidth: "2px",
                  outlineColor: "colorPalette.500",
                  outlineOffset: "2px",
                  outlineStyle: "solid",
                })}
              />
              <IconButton
                aria-label="Edit profile picture"
                icon={<FiEdit />}
                borderRadius="full"
                position="absolute"
                bottom="2"
                right="2"
                bg="white"
                boxShadow="md"
                size="sm"
                onClick={handleAvatarEdit}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Box>

            <Box width="90%" mt={8}>
              {/* Name Input */}
              <FormControl mb={8}>
                <Box position="relative">
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={handleNameChange}
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'green.500' }}
                    color="gray.800"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FiUser size={24} />
                  </Box>
                </Box>
              </FormControl>

              {/* Email Input with Error */}
              <FormControl mb={8} isInvalid={!!emailError}>
                <Box position="relative">
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor={emailError ? 'red.500' : 'gray.200'}
                    _focus={{ borderColor: emailError ? 'red.500' : 'green.500' }}
                    color="gray.800"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <MdOutlineEmail size={24} />
                  </Box>
                </Box>
                {emailError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {emailError}
                  </Text>
                )}
              </FormControl>

              {/* Phone Input */}
              <FormControl mb={8}>
                <Box position="relative">
                  <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'green.500' }}
                    color="gray.800"
                    type="tel"  // Mobile-friendly number input
                    pattern="[0-9]*"  // Enforce numbers on mobile
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FiPhone size={24} />
                  </Box>
                </Box>
              </FormControl>
            </Box>

            <Flex width="90%" justify="space-between" mt={8}>
              <Button
                variant="outline"
                colorScheme="gray"
                borderRadius="xl"
                width="48%"
                height="50px"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                bg="#43eb7f"
                color="white"
                borderRadius="xl"
                width="48%"
                height="50px"
                _hover={{ bg: '#3ad073' }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AccInfo;