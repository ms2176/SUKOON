import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import './auth.css';
import LoginAnimation from '@/images/animatedIcons/Forest-Waterfall.mp4';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Auth = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div>
      <Stack className="loginStartStack">
        <video className="loginAnimation" autoPlay loop>
          <source src={LoginAnimation} type="video/mp4" />
          Your browser does not support mp4s.
        </video>

        <Heading className='Sukoon-logo'>
          SUKOON
        </Heading>

        <Heading className="loginStart-Heading">
          Smarter choices for a better tomorrow!
        </Heading>

        {/* Get Started Button */}
        <Button
          className="loginStart-Button"
          backgroundColor={'#6cce58'}
          color={'#f6f6f6'}
          onClick={() => navigate('/register')} // Navigate to Register
        >
          Get started
        </Button>

        {/* Login Button */}
        <Button
          className="loginStart-Button"
          backgroundColor={'#f6f6f6'}
          color={'#6cce58'}
          onClick={() => navigate('/login')} // Navigate to Login
        >
          Log in
        </Button>

        <Text className="loginStart-text">
          By continuing, you agree to the{' '}
          <span style={{ color: '#6cce58' }}>Terms of Service</span> and{' '}
          <span style={{ color: '#6cce58' }}>Privacy Policy</span>
        </Text>
      </Stack>
    </div>
  );
};

export default Auth;


