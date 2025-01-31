import React, { useState } from 'react';
import { LuQrCode } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import { Box, Button, Heading, HStack, Input, Stack, Text, FormControl } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import './QRWait.css';
import './register.css';

const QRWait = () => {
  const navigate = useNavigate();
  const [hubLink, setHubLink] = useState('');
  const [hubLinkError, setHubLinkError] = useState('');

  const goToLogin = () => {
    navigate('/login');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log("File selected:", file);
        const extractedData = "hub-link-or-user-specific-data"; // Example of extracted data from QR
        const userEmail = sessionStorage.getItem('userEmail');

        if (!userEmail) {
          console.error("User email is not available in sessionStorage.");
          return;
        }

        const db = getFirestore();
        const userDocRef = doc(db, "users", userEmail);

        await setDoc(userDocRef, {
          qrCodeData: extractedData,
          updatedAt: new Date(),
        }, { merge: true });

        console.log("QR code data successfully attached to the user's email.");
        navigate('/home');
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  };

  const handleHubLink = async () => {
    if (!hubLink) {
      setHubLinkError("Please enter a valid hub link.");
      return;
    }

    const db = getFirestore();
    const hubDocRef = doc(db, "hubs", hubLink);

    try {
      const docSnapshot = await getDoc(hubDocRef);

      if (docSnapshot.exists()) {
        console.log("Hub link found:", docSnapshot.data());
        const userEmail = sessionStorage.getItem('userEmail');

        if (!userEmail) {
          console.error("User email is not available in sessionStorage.");
          return;
        }

        const userDocRef = doc(db, "users", userEmail);

        await setDoc(userDocRef, {
          hubLink: hubLink,
          updatedAt: new Date(),
        }, { merge: true });

        console.log("Hub link successfully attached to the user's email.");
        navigate('/home');
      } else {
        setHubLinkError("Hub link not found. Please check and try again.");
      }
    } catch (error) {
      console.error("Error checking hub link:", error);
      setHubLinkError("Error checking the hub link. Please try again.");
    }
  };

  return (
    <Box style={{ overflow: 'hidden' }}>
      <Box className='QRHeader'></Box>
      <Stack
        className='QRStack'
        spacing={6}
        align="center"
        justify="center"
        width={{ base: '90%', md: '60%' }}
        margin="0 auto"
        mt={{ base: 4, md: 8 }}
      >
        <Stack className='QRIconContainer' spacing={4} align="center">
          <LuQrCode className='QRIcon' size={120} />
          <Heading className='QRHeading' textAlign="center" fontSize={{ base: 'xl', md: '2xl' }}>
            To get started, please scan your hub's QR code!
          </Heading>
        </Stack>

        <Button className='scanButton' as="label" htmlFor="camera-input">
          <HStack spacing={2}>
            <Heading fontSize={{ base: 'md', md: 'lg' }}>Scan</Heading>
            <FaCamera className='QRCamera' />
          </HStack>
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Button>

        <HStack spacing={4} mt={{ base: 4, md: 6 }}>
          <Box className='regBox' flex={1} height="1px" bg="gray.300" />
          <Text color="gray.500">or</Text>
          <Box className='regBox' flex={1} height="1px" bg="gray.300" />
        </HStack>

        <Text color="gray.600" textAlign="center" mt={{ base: 4, md: 6 }}>
          Type in and submit your hub's link code:
        </Text>

        <Box width="100%" maxWidth="400px">
          <FormControl isInvalid={!!hubLinkError}>
            <Input
              placeholder="Link Code"
              value={hubLink}
              onChange={(e) => setHubLink(e.target.value)}
              borderRadius={20}
              borderColor="gray.300"
              _focus={{ borderColor: '#6cce58', boxShadow: 'none' }}
            />
          </FormControl>
        </Box>

        <Button
          className='next-Button'
          backgroundColor="#6cce58"
          color="white"
          onClick={handleHubLink}
          width="100%"
          maxWidth="400px"
          mt={{ base: 4, md: 6 }}
        >
          Next
        </Button>

        {hubLinkError && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {hubLinkError}
          </Text>
        )}

        <Heading
          color="#6cce58"
          fontWeight="light"
          textDecoration="underline"
          cursor="pointer"
          onClick={goToLogin}
          mt={{ base: 4, md: 6 }}
        >
          Back to Login
        </Heading>
      </Stack>
    </Box>
  );
};

export default QRWait;