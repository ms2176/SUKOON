import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, VStack, HStack, Icon, Heading, Separator, Stack } from '@chakra-ui/react';
import { Switch } from "@chakra-ui/react"
import HeaderBg from '@/images/green.jpg';
import { FiUser, FiStar, FiHelpCircle, FiSettings, FiArrowLeft, FiChevronRight, FiSun, FiMoon, FiHome, FiTool, FiCircle } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import './Accountspage.css';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useColorMode } from "@/components/ui/color-mode";
import { 
  writeBatch,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const AccountsPage = () => {

  const [username, setUsername] = useState('Kaywan'); // Default username
  const [email, setEmail] = useState('kk2024@kaywan.co.uk'); // Default email
  const [avatarSrc, setAvatarSrc] = useState('https://via.placeholder.com/150'); // Default avatar
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const { colorMode, toggleColorMode } = useColorMode(); // Chakra UI color mode hook

  const auth = getAuth();
  const db = getFirestore();

  const handleDarkModeToggle = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    toggleColorMode(); // Toggle Chakra UI color mode
  
    // Update dark mode in Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { darkMode: newDarkMode });
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
  
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const db = getFirestore();
      const batch = writeBatch(db);
  
      // 1. Get all user hubs
      const hubsQuery = query(
        collection(db, 'userHubs'),
        where('userId', '==', user.uid)
      );
      const hubsSnapshot = await getDocs(hubsQuery);
      const hubCodes = hubsSnapshot.docs.map(doc => doc.data().hubCode);
  
      // 2. Wipe user hub data
      hubsSnapshot.forEach(hubDoc => {
        batch.update(hubDoc.ref, {
          userId: '',
          homeName: '',
          unitName: '',
          image: '',
          units: [],
          pinned: false
        });
      });
  
      // 3. Delete rooms associated with hubs
      if (hubCodes.length > 0) {
        const roomsQuery = query(
          collection(db, 'rooms'),
          where('hubCode', 'in', hubCodes)
        );
        const roomsSnapshot = await getDocs(roomsQuery);
        roomsSnapshot.forEach(roomDoc => {
          batch.delete(roomDoc.ref);
        });
      }
  
      // 4. Wipe hub codes from devices
      if (hubCodes.length > 0) {
        const devicesQuery = query(
          collection(db, 'devices'),
          where('hubCode', 'in', hubCodes)
        );
        const devicesSnapshot = await getDocs(devicesQuery);
        devicesSnapshot.forEach(deviceDoc => {
          batch.update(deviceDoc.ref, { hubCode: '' });
        });
      }
  
      // Reauthentication
      if (!user.email) {
        throw new Error('Email is required for account deletion. Please ensure your account has an email address.');
      }
  
      const password = prompt('Please enter your password to confirm deletion:');
      if (!password) {
        throw new Error('Password is required for account deletion.');
      }
  
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
  
      // 5. Delete user document
      const userDocRef = doc(db, 'users', user.uid);
      batch.delete(userDocRef);
  
      // Commit all batch operations
      await batch.commit();
  
      // 6. Delete auth user
      await deleteUser(user);
  
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`Error deleting account: ${error.message}`);
    }
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || 'Kaywan');
          setEmail(userData.email || 'kk2024@kaywan.co.uk');
          setAvatarSrc(userData.profilePhoto || 'https://via.placeholder.com/150');
          setDarkMode(userData.darkMode || false); // Load dark mode preference
  
          // Apply dark mode if enabled
          if (userData.darkMode && colorMode === 'light') {
            toggleColorMode();
          }
        }
      }
    };
    fetchUserData();
  }, [auth, db, colorMode, toggleColorMode]);

  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.100" overflowY={'auto'} height={'120vh'}>
      <Box p={0} m={0}>
      <Box 
          as="header" 
          bgImage={`url(${HeaderBg})`}
          bgSize="cover"
          p={4}
          textAlign="center"
          height="30vh"
        >
          <HStack justify="space-between" bg={'transparent'}>
            
            <Heading size="lg" flex="1" bg={'transparent'}  color={'white'}>
              Account
            </Heading>
                    
          </HStack>

          {/* Profile Section */}
          <Flex align="center" direction="column" mt={6} bg={'transparent'}>
          <Box
            borderWidth="4px"
            borderColor="green.500"
            borderRadius="full" // Makes the Box perfectly round
            width="100px" // Fixed width for a small size
            height="100px" // Fixed height to match width for a perfect circle
            overflow="hidden" // Ensures the image stays within the rounded boundaries
            mx="auto" // Centers the Box horizontally
          >
            <img 
              src={avatarSrc}
              alt={username}
              style={{ 
                width: '100%', // Ensures the image fills the Box
                height: '100%', // Ensures the image fills the Box
                objectFit: 'cover' // Ensures the image covers the Box without distortion
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150'; // Fallback image
              }}
            />
          </Box>
            <Text fontSize="lg" color={'white'} fontWeight="bold" mt={2} bg={'transparent'}>
              {username} {/* Use the fetched username */}
            </Text>
            <Text fontSize="sm" color={'white'} bg={'transparent'}>
              {email} {/* Use the fetched email */}
            </Text>
          </Flex>
        </Box>





        {/* Options */}
        <Box className='optionsContainer'>
          <Stack width={'85%'} height={'auto'} spaceY={'10%'} display={'flex'} justify={'center'} alignItems={'center'} alignContent={'center'} mt={'5%'}>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/AccInfo')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiUser style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Account Info
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Manage your account settings...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiUser style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Dark Mode
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Choose the dark side...
                  </Heading>
                </Stack>

                <Switch.Root 
                  colorPalette="green" // Changed from colorPalette to colorScheme
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                  size="md"
                  variant="raised"
                  ml="auto"
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/HomeManagement')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiHome style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Home Management
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    View, Create, or join home...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/services')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FaUsers style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Third Party Services
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Alexa, Google, Smart things...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/tools')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiTool style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    More Tools
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Watch, Virtual experience...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/support')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiHelpCircle style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Support Center
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Need help?
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/Rate')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiStar style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Rate Us
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    You better give us 5 stars...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'} ml={'5%'}>
                  Log Out
                </Heading>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <Heading bg={'transparent'} color={'red'} width={'100%'} fontSize={'sm'} lineHeight={'100%'} ml={'5%'} textDecor={'underline'} onClick={handleDeleteAccount}>
                  Delete Account
                </Heading>

              </HStack>
            </Box>
            
          </Stack>

        </Box>
    
      </Box>
    </Box>

  );
};

export default AccountsPage;