import React, { useState, useEffect } from 'react';
import './beatiMain.css';
import { Box, Button, Heading, HStack, Stack } from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import './myGreenhouse.css';
import { IoMdInformation } from 'react-icons/io';
import Shelf from './gardenflowerstrans/Shelf.tsx';
import { useNavigate } from 'react-router-dom';
import GardeninfoCard from './GardeninfoCard.tsx';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Default unlockedPlants object
const defaultUnlockedPlants = {
  Bonsai: false,
  Daisy: false,
  Piranha: false,
  Roses: false,
  Sunflower: false,
  Cactus: false,
};

const MyGreenhouse: React.FC = () => {
  const navigate = useNavigate();
  const currEnergy = 50;
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [unlockedPlants, setUnlockedPlants] = useState(defaultUnlockedPlants);

  // Fetch user's plants from Firestore
  useEffect(() => {
    const fetchUserPlants = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const plants = data.plants; // Assuming plants is an array of objects

          // Map Firestore plant names to unlockedPlants keys
          const updatedPlants = {
            Bonsai: plants.bonsai || false,
            Daisy: plants.daisy || false,
            Piranha: plants.VFtrap || false, // Map VFtrap to Piranha
            Roses: plants.roses || false,
            Sunflower: plants.sunflower || false,
            Cactus: plants.cactus || false,
          };

          setUnlockedPlants(updatedPlants);
        }
      }
    };

    fetchUserPlants();
  }, []);

  const goToBeati = () => {
    navigate('/beati');
  };

  const toggleInfoCard = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  return (
    <div className='gardenCont'>
      {isInfoVisible && <GardeninfoCard closeInfoCard={toggleInfoCard} />}
      <Button className='beatiBackButton' onClick={goToBeati}>
        <IoArrowBack style={{ background: 'transparent' }} color='white' size={'80%'} />
      </Button>

      <Button className='gardenInfo' onClick={toggleInfoCard}>
        <IoMdInformation style={{ background: 'transparent' }} size={'10%'} color='#3627ba' />
      </Button>

      <Stack className='myGContainer'>
        <Box bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
          <HStack bg={'transparent'} display={'flex'} justifyContent={'center'}>
            <Heading className='greenhouseHead'>MY GREENHOUSE</Heading>
          </HStack>
        </Box>

        <Stack bg={'transparent'} spaceY={'0%'}>
          {/* First Shelf */}
          <Stack bg={'transparent'} spaceY={'-45%'}>
            <Shelf firstPlant="Roses" secondPlant="Cactus" unlockedPlants={unlockedPlants} spacing={51} />
            <HStack bg={'transparent'} display={'flex'} alignContent={'center'} justifyContent={'center'} alignItems={'center'} spaceX={'10%'}>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Roses ? 'Roses' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 50KW
                  </Heading>
                </Stack>
              </Box>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Cactus ? 'Cactus' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 100KW
                  </Heading>
                </Stack>
              </Box>
            </HStack>
          </Stack>

          {/* Second Shelf */}
          <Stack bg={'transparent'} spaceY={'-45%'}>
            <Shelf firstPlant="Bonsai" secondPlant="Daisy" unlockedPlants={unlockedPlants} spacing={53} />
            <HStack bg={'transparent'} display={'flex'} alignContent={'center'} justifyContent={'center'} alignItems={'center'} spaceX={'10%'}>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Bonsai ? 'Bonsai' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 150KW
                  </Heading>
                </Stack>
              </Box>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Daisy ? 'Daisy' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 200KW
                  </Heading>
                </Stack>
              </Box>
            </HStack>
          </Stack>

          {/* Third Shelf */}
          <Stack bg={'transparent'} spaceY={'-45%'}>
            <Shelf firstPlant="Sunflower" secondPlant="Piranha" unlockedPlants={unlockedPlants} spacing={58} />
            <HStack bg={'transparent'} display={'flex'} alignContent={'center'} justifyContent={'center'} alignItems={'center'} spaceX={'10%'}>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Sunflower ? 'Sunflower' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 250KW
                  </Heading>
                </Stack>
              </Box>
              <Box className='flowerInfo'>
                <Stack bg={'transparent'} className='flowerInfoStack' spaceY={'-20%'}>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'90%'}>
                    {unlockedPlants.Piranha ? 'VF Trap' : '???'}
                  </Heading>
                  <Heading bg={'transparent'} textAlign={'center'} fontSize={'50%'}>
                    {currEnergy} / 300KW
                  </Heading>
                </Stack>
              </Box>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default MyGreenhouse;