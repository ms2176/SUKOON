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
import './OTP.css'

const ResetPassword = () => {

    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState(''); // State for username error
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility State for toggling password visibility

  
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // Update the password state when the user types
  };


  const navigate = useNavigate(); // Initialize navigate function

  // Function to navigate back to Auth page
  const goToAuth = () => {
    navigate('/'); // Navigate to the root Auth page
  };

  const handleSubmit = () => {
    if (password === '' || confirmPassword === '') {
      setPasswordError('Password and Confirm Password cannot be empty');
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
      goToAuth(); // If passwords match, proceed to the next step
    }
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

      <Button
        borderRadius={200}
        width="30px"
        height="40px"
        display={'flex'}
        bg={'#43eb7f'}
        position="absolute"
        boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'
        onClick={goToAuth} 
        top={'10%'}
        left={'10%'}
      >
            <Text color={'white'} bg={'transparent'}>&lt;</Text>
      </Button>

      <Stack spaceY={'50%'}>

        <Heading textAlign={'center'} bg={'transparent'} color={'black'} fontSize={'120%'}>
            Enter your new password:
        </Heading>

      
        <Stack className='signUpDataInputStack' spaceY={3} bg={'transparent'}>
            <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
                <FormControl isInvalid={!!passwordError} width={'100%'}>

                    <Box className='OuterInputBox'>
                    <Input
                        placeholder="Password"
                        className='InputData'
                        type={showPassword ? 'text' : 'password'} // Toggle password visibility
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box className='InnerInputBox'>
                        <CiLock />
                    </Box>
                    <HStack position="absolute" right="10px" top="50%" transform="translateY(-50%)">
                        <Button 
                        size="sm" 
                        onClick={() => setShowPassword(prev => !prev)}
                        >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                        </Button>
                    </HStack>
                    </Box>

                </FormControl>
                </Box>
                
                <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
                <FormControl isInvalid={!!passwordError} width={'100%'}>

                    <Box className='OuterInputBox'>
                    <Input
                        placeholder="Confirm Password"
                        className='InputData'
                        type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Box className='InnerInputBox'>
                        <CiLock />
                    </Box>
                    <HStack position="absolute" right="10px" top="50%" transform="translateY(-50%)">
                        <Button 
                        size="sm" 
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </Button>
                    </HStack>
                    </Box>
                    {passwordError && <Text color="red.500">{passwordError}</Text>}

                </FormControl>
                </Box>

                <Button className='next-Button' backgroundColor={'#6cce58'} color={'#f6f6f6'} onClick={handleSubmit}>
                    Next
                </Button>
            </Stack>
        </Stack>

        
          
        




      
    </div>
  );
};

export default ResetPassword;


