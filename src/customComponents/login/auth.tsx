import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import TAS from './TAS';
import { useState } from 'react';
import PP from './PP';
import Lottie from 'react-lottie-player';
import smartHomeAnimation from '@/images/animatedIcons/smartHome.json';
import Logo from '@/images/logo.png'

const Auth = () => {
  const navigate = useNavigate();
  const [showTAS, setShowTAS] = useState(false);
  const [showPP, setShowPP] = useState(false);

  

  return (
    <div className="auth-container">
      <Stack className="loginStartStack">
        <div className="animation-container">
          <Lottie
            loop
            animationData={smartHomeAnimation}
            play
            className="smart-home-animation"
          />
        </div>

        {showTAS && <TAS onClose={() => setShowTAS(false)} />}
        {showPP && <PP onClose={() => setShowPP(false)} />}

        <Heading className="Sukoon-logo">
          SUKOON
        </Heading>

        <Heading className="loginStart-Heading">
          Smarter choices for a better tomorrow!
        </Heading>

        <Button
          className="loginStart-Button"
          backgroundColor={'#6cce58'}
          color={'#f6f6f6'}
          onClick={() => navigate('/register')}
        >
          Get started
        </Button>

        <Button
          className="loginStart-Button"
          backgroundColor={'#f6f6f6'}
          color={'#6cce58'}
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>

        <Text className="loginStart-text">
          By continuing, you agree to the{' '}
          <span style={{ color: '#6cce58', cursor: 'pointer' }} onClick={() => setShowTAS(true)}>
            Terms of Service
          </span>{' '}
          and{' '}
          <span style={{ color: '#6cce58', cursor: 'pointer' }} onClick={() => setShowPP(true)}>
            Privacy Policy
          </span>
        </Text>
      </Stack>
    </div>
  );
};

export default Auth;