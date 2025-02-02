import { Box, Button, Flex, Heading, HStack, Input, Stack, Text } from '@chakra-ui/react';
import TopBorderImage from '@/images/pngegg (1).png';
import './Register.css';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword, AuthError, fetchSignInMethodsForEmail } from 'firebase/auth'
import { FormControl } from '@chakra-ui/form-control';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { IoChevronBack } from "react-icons/io5";


const EmailConfirm = () => {


  const navigate = useNavigate(); // Initialize navigate function

  // Function to navigate back to Auth page
  const goToAuth = () => {
    navigate('/'); // Navigate to the root Auth page
  };

  return (
    <div style={{ overflowX: 'hidden' }}>

      <Flex className='registerTop' overflow="hidden" position="relative" width="100%">
        {/* Image */}
        <img
          src={TopBorderImage}
          alt="border image"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            maxHeight: '100vh',
          }}
        />
      </Flex>

      <Stack className='signUpDataInputStack' spaceY={3} transform={'translate(-50%, -80%)'} bg={'transparent'}>
        <Flex alignItems="center" width="100%" display={'flex'} position="relative" bg={'transparent'}>
          {/* Back Button */}
          <Button
            borderRadius={200}
            width="30px"
            height="40px"
            display={'flex'}
            bg={'#43eb7f'}
            position="absolute"
            left="-15%"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
            onClick={goToAuth} // Navigate to Auth when clicked
            top={'-120%'}
          >
            <Text color={'white'} bg={'transparent'}>&lt;</Text>
          </Button>

          <Heading textAlign={'center'} fontSize={'120%'} className='emailConfHead'>
            A confirmation Email has been sent to your Email account. Please verify your email to continue through.
          </Heading>

        </Flex>
      </Stack>
    </div>
  );
};

export default EmailConfirm;


