import { Box, Button, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react';
import TopBorderImage from '@/images/pngegg (1).png';
import './Register.css';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState } from 'react'
import { FormControl } from '@chakra-ui/form-control';


const ResetPassword = () => {

  const [email, setEmail] = useState('');
  const [, setError] = useState('');
  const [emailError, setEmailError] = useState('');


  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the email state when the user types
  };
  
  


  const handleReset = async () => {
    setEmailError(''); // Reset any previous errors

    if (!email) {
      setEmailError('Enter a valid email.');
      return;
    }
  
    // Simulating email validation without Firebase for testing purposes
    console.log("Email entered:", email);
    console.log("Navigating to OTP...");
  
    navigate('/OTP');

    setEmailError('');
  
    // if (!email) {
    //   setEmailError('Enter a valid email.');
    //   return;
    // }
  
    // try {
    //   const methods = await fetchSignInMethodsForEmail(getAuth(), email);
    //   console.log("Firebase sign-in methods:", methods); // Debugging step
  
    //   if (methods.length > 0) {
    //     console.log("Navigating to OTP...");
    //     navigate('/OTP');
    //   } else {
    //     setEmailError('Email not found. Please enter a registered email.');
    //   }
    // } catch (error) {
    //   console.error("Error checking email:", error);
    //   setEmailError('Something went wrong. Please try again.');
    // }
  };
  


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

      <Stack className='signUpDataInputStack' spaceY={3} transform={'translate(-50%, -80%)'} bg={'transparent'} mt={'60%'}>
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

          {/* Log In Heading */}
          <Heading textAlign="center" width="100%" color={'black'} bg={'transparent'}>
            Reset Password
          </Heading>
        </Flex>

        <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
          <FormControl isInvalid={!!emailError} width={'100%'}>
            <Box className='OuterInputBox'>
              <Input
                placeholder="Email"
                className='InputData'
                value={email}
                onChange={handleEmailChange}
              />
              <Box className='InnerInputBox'>
                <MdOutlineEmail />
              </Box>
            </Box>

          </FormControl>
        </Box>

        <Text textAlign={'center'}>
            Enter your email, and we will send you an email with a confirmation code to reset your password.
        </Text>
        
        <Flex 
        width={'100%'} 
        display={'flex'} 
        flexDir={'column'} 
        justifyContent={'center'} 
        alignItems={'center'}
        >
          <Button 
            className='next-Button' 
            backgroundColor={'#6cce58'} 
            color={'#f6f6f6'} 
            onClick={(e) => {
              e.preventDefault(); 
              handleReset();
            }}
          >
            Next
          </Button>

          {/* Reserve space to prevent layout shifting */}
          <Text 
            color={'red.500'} 
            fontSize={'sm'} 
            minH="20px" 
            visibility={emailError ? 'visible' : 'hidden'} 
          >
            Enter a valid email.
          </Text>
        </Flex>

      </Stack>
    </div>
  );
};

export default ResetPassword;


