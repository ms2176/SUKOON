import React, { useState } from 'react';
import { LuQrCode } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import './QRWait.css';
import { Box, Button, Heading, HStack, Input, Stack, Text, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './register.css'
import { FormControl } from '@chakra-ui/form-control';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

        // Extract data from the QR code (you might use a library for this, e.g., "qrcode-decoder")
        const extractedData = "hub-link-or-user-specific-data"; // Example of extracted data from QR

        // Get the user's email from sessionStorage
        const userEmail = sessionStorage.getItem('userEmail'); // Make sure the email is saved in sessionStorage at login or registration

        if (!userEmail) {
          console.error("User email is not available in sessionStorage.");
          return;
        }

        // Initialize Firestore
        const db = getFirestore();

        // Reference to the user's document in the Firestore users collection
        const userDocRef = doc(db, "users", userEmail); // Assuming "users" is the collection and userEmail is the document ID

        // Attach the QR code data to the user's document
        await setDoc(userDocRef, {
          qrCodeData: extractedData,
          updatedAt: new Date(),
        }, { merge: true }); // merge:true ensures we don't overwrite other fields

        console.log("QR code data successfully attached to the user's email.");
        navigate('/home'); // Navigate to home after success
      } 
      
      catch (error) {
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
    <Flex direction="column" height="100vh" overflow="hidden" overflowY={'auto'}>
      {/* Green Box at the Top */}
      <Box className='QRTop' flexShrink={0} />

      {/* Stack Below the Green Box */}
      <Flex flexGrow={1} direction="column" justifyContent="center" alignItems="center">
        <Stack className='QRDataInputStack' align="center">
          <LuQrCode style={{background:'transparent'}} size={'70%'} color='#0c1033'/>
          <Heading className='QRHead'>
            To get started, please scan your hub's QR code.
          </Heading>

          <Button 
            className='next-Button' 
            backgroundColor={'#6cce58'} 
            color={'#f6f6f6'} 
            width={'50%'}
          >
            Scan
            <FaCamera style={{background:'transparent'}}/>
          </Button>

          <HStack>
            <Box className='regBox' />
              <Text color={'black'}>
                or
              </Text>
            <Box className='regBox' />
          </HStack>

          <Heading color={'lightgray'} textAlign={'center'}>
            Enter your hub's link code.
          </Heading>

          <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
            <FormControl width={'100%'}>
              <Box className='OuterInputBox'>
                <Input
                  placeholder="Link Code"
                  className='InputData'
                />
              </Box>
            </FormControl>
          </Box>

          <Button 
            className='next-Button' 
            backgroundColor={'#6cce58'} 
            color={'#f6f6f6'} 
            width={'100%'}
          >
            Next
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default QRWait;