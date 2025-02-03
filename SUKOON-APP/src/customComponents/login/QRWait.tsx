import React, { useState } from 'react';
import { LuQrCode } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import './QRWait.css';
import { Box, Button, Heading, HStack, Input, Stack, Text } from '@chakra-ui/react';
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
    <div style={{overflow: 'hidden'}}>
      <Box className='QRHeader'></Box>
      <Stack className='QRStack'>
        <Box className='QRIconContainer'>
          <LuQrCode className='QRIcon' />
          <Box className='QRHeading'>
            To get started, please scan your hub's QR code!
          </Box>
        </Box>

        <Button className='scanButton'>
          <HStack bg={'transparent'}>
            <Heading bg={'transparent'}>
              Scan
            </Heading>
            <FaCamera className='QRCamera' />
          </HStack>
          {/* Hidden input field for opening the native camera */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
          />
        </Button>

        <HStack transform={'translateY(-240%)'}>
          <Box className='regBox' />
            <Text color={'black'}>
              or
            </Text>
          <Box className='regBox' />
        </HStack>

        <Text color={'black'} transform={'translateY(-100%)'} textAlign={'center'} mb={-10}>
          Type in and submit your hub's link code:
        </Text>
 
        <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
          <FormControl isInvalid={!!hubLinkError} width={'100%'} color={'black'} borderRadius={20}>
            <Box className='OuterInputBox' borderRadius={20}>
              <Input
                placeholder="Link Code"
                className='InputData'
                value={hubLink}
                onChange={(e) => setHubLink(e.target.value)}
              />
            </Box>
          </FormControl>
        </Box>
        
        <Button className='next-Button' backgroundColor={'#6cce58'} color={'#f6f6f6'} 
          onClick={(e) => {
            e.preventDefault(); // Mimics the behavior of form submission
            handleHubLink();
          }}>
          Next
        </Button>
        {(hubLinkError) && <Text color={'red.500'} fontSize={'sm'}>{hubLinkError}</Text>}

        <Heading
          color={'#6cce58'}
          fontWeight={'light'}
          ml={'auto'}
          mr={'auto'}
          textDecor={'underline'}
          onClick={goToLogin}
        >
          Back to Login
        </Heading>
      </Stack>
    </div>
  );
};

export default QRWait;
