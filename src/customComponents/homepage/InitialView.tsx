import { Box, Button, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import './Homepage.css'
import { useEffect } from 'react';
import '@/customComponents/login/register.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import AddHome from './AddHome'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

const InitialView: React.FC<{
  onSelectHome: (home: Home) => void;
  selectedHome: Home | null;
  onHomeAdded: (newHomes: Home[]) => void;
}> = ({ onSelectHome, selectedHome, onHomeAdded }) => {
  const username = sessionStorage.getItem('username');
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [homes, setHomes] = useState<Home[]>([]);
  const navigate = useNavigate();

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible); // Toggle the info card visibility
};



  // Disable editing mode if there are no pinned items
  useEffect(() => {
    if (pinnedItems.length === 0) {
      setIsEditing(false);
    }
  }, [pinnedItems]);

  useEffect(() => {
    // Disable scrolling when pinnedMenu is open
    document.body.style.overflow = 'hidden';

    // Clean up and allow scrolling again when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // Disable scrolling when pinnedMenu is open
    if (isPinnedMenuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isPinnedMenuVisible]);

  const handleHomeAdded = (newHomes: Home[]) => {
    onHomeAdded(newHomes); // Update App's state
    navigate("/home"); // Navigate after state update
  };

  return (
    <div>

        {isAddHomeVisible && <AddHome onHomeAdded={handleHomeAdded} closeAddHome={toggleAddHome}/> }
      <Stack className='homepageContainer' position={'relative'} display={'flex'} height={'auto'}>
        <Box className='homepageHeader'>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} mb={'20px'} fontWeight={'extrabold'} className='introHomepage'>
            Ya Halla, <span className='guestIntro'>{username || 'guest'}</span>
          </Heading>
        </Box>

        <Stack justify={'center'} align={'center'} height={'100vh'} width={'100%'} position={'absolute'} bg={'transparent'}>
            <Heading bg={'transparent'} textAlign={'center'} color={'lightgray'} width={'60%'}>
                Get started by adding your first home!
            </Heading>

            <Button bg={'#6cce58'} width={'40%'} color={'white'} borderRadius={'20px'} onClick={toggleAddHome}>
                Add Home
                
            </Button>

        </Stack>

    </Stack>
        
    </div>
  );
};

export default InitialView;
