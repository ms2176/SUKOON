import { Box, Button, Flex, Heading, HStack, Stack, Image, Text, Grid } from '@chakra-ui/react'
import React, { useState, useRef } from 'react'
import './Homepage.css'
import Dropdown from './Dropdown.tsx'
import MiniDisplays from './miniDisplays.tsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import Lottie from 'react-lottie-player';
import PulseAnimationGreen from '@/images/animatedIcons/Animation - 1737092091343.json'
import PulseAnimationBlue from '@/images/animatedIcons/Animation - 1738960096286.json'
import { TbCirclePlusFilled } from "react-icons/tb";
import PinnedMenu from './pinnedMenu.tsx';
import { useEffect } from 'react';
import Mockroom from './Mockroom.tsx';
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineBatterySaver } from "react-icons/md";
import { FaExpandAlt } from "react-icons/fa";
import { AiOutlineShrink } from "react-icons/ai";
import AddHome from './AddHome.tsx';
import EditHomes from './EditHomes.tsx'
import MockDevice from './MockDevice.tsx';
import PinnedMenuAdmin from './pinnedMenuAdmin.tsx';
import MockUnits from './MockUnits.tsx';
import { MdOutlineEdit } from "react-icons/md";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import NoImage from '@/images/noImage.png'
// Import device images
import LightImg from '@/images/devicesIcons/lamp.png';
import TvImg from '@/images/devicesIcons/tv.png';
import AcImg from '@/images/devicesIcons/ac.png';
import FanImg from '@/images/devicesIcons/fan.png';
import WasherImg from '@/images/devicesIcons/washing-machine.png';
import SpeakerImg from '@/images/devicesIcons/speaker.png';
import ThermostatImg from '@/images/devicesIcons/thermostat.png';
import DoorbellImg from '@/images/devicesIcons/smart-door.png';
import HeatconvectorImg from '@/images/devicesIcons/heater-convector.png';
import Dishwasher from '@/images/devicesIcons/dishwasher.png';

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface HomepageProps {
  selectedHome: Home | null;
  onSelectHome: (home: Home) => void;
}

// Define the Room type
interface Room {
  type: 'room';
  id: string;
  roomName: string;
  hubCode: string;
  pinned: boolean;
  devices: string[];
  image?: string; // Optional field for room image
}

// Define the Device type
interface Device {
  type: 'device';
  id: string;
  deviceName: string;
  deviceType: string;
  hubCode: string;
  pinned: boolean;
}

// Define the Unit type
interface Unit {
  type: 'unit';
  id: string;
  unitName: string;
  hubCode: string;
  pinned: boolean;
}

// Define the PinnedItem type as a union of Room, Device, and Unit
type PinnedItem = Room | Device | Unit;

// Define device types and their corresponding images
type DeviceType =
  | 'light'
  | 'tv'
  | 'ac'
  | 'fan'
  | 'washingMachine'
  | 'speaker'
  | 'thermostat'
  | 'door'
  | 'heatconvector'
  | 'dishwasher';

const deviceTypeToImage: Record<DeviceType, string> = {
  light: LightImg,
  tv: TvImg,
  ac: AcImg,
  fan: FanImg,
  washingMachine: WasherImg,
  speaker: SpeakerImg,
  thermostat: ThermostatImg,
  door: DoorbellImg,
  heatconvector: HeatconvectorImg,
  dishwasher: Dishwasher,
};

const normalizeDeviceType = (deviceType: string): DeviceType => {
  const normalizedType = deviceType.toLowerCase().replace(/\s+/g, ''); // Remove spaces and convert to lowercase
  switch (normalizedType) {
    case 'light':
      return 'light';
    case 'tv':
      return 'tv';
    case 'ac':
      return 'ac';
    case 'fan':
      return 'fan';
    case 'washingmachine':
      return 'washingMachine';
    case 'speaker':
      return 'speaker';
    case 'thermostat':
      return 'thermostat';
    case 'door':
      return 'door';
    case 'heatconvector':
      return 'heatconvector';
    case 'dishwasher':
      return 'dishwasher';
    default:
      return 'light'; // Default to 'light' if the type is unknown
  }
};

const Homepage: React.FC<{ selectedHomePass: Home | null; onSelectHome: (home: Home) => void }> = ({ selectedHomePass, onSelectHome }) => {
  const [username, setUsername] = useState<string>('guest');
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [isEditHomesVisible, setIsEditHomesVisible] = useState(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username || 'guest');
        } else {
          setUsername('guest');
        }

        const userHubsRef = collection(db, 'userHubs');
        const q = query(userHubsRef, where('userId', '==', userId));

        try {
          const querySnapshot = await getDocs(q);
          const hubs: Home[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            hubs.push({
              homeName: data.homeName,
              homeType: data.homeType,
              hubCode: data.hubCode,
            });
          });

          setHomes(hubs);

          const storedSelectedHome = localStorage.getItem('selectedHome');
          if (storedSelectedHome) {
            const selectedHome = JSON.parse(storedSelectedHome);
            setSelectedHome(selectedHome);
            onSelectHome(selectedHome);
          } else if (hubs.length > 0) {
            const firstHome = hubs[0];
            setSelectedHome(firstHome);
            onSelectHome(firstHome);
          }
        } catch (error) {
          console.error('Error fetching user hubs:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUsername('guest');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleHubSelect = (home: Home) => {
    setSelectedHome(home);
    onSelectHome(home);
  };

  const handleSelectHome = (home: Home) => {
    setSelectedHome(home);
    setPinnedItems([]);
    localStorage.setItem('selectedHome', JSON.stringify(home));
  };

  const handleHomeRenamed = () => {
    fetchHomes();
  };

  const handlePinItem = (item: PinnedItem) => {
    setPinnedItems((prev) => [...prev, item]);
  };

  const fetchPinnedItems = async () => {
    const db = getFirestore();

    if (selectedHome) {
      try {
        const roomsRef = collection(db, 'rooms');
        const roomsQuery = query(roomsRef, where('hubCode', '==', selectedHome.hubCode), where('pinned', '==', true));
        const roomsSnapshot = await getDocs(roomsQuery);
        const pinnedRooms: Room[] = roomsSnapshot.docs.map((doc) => ({
          type: 'room',
          id: doc.id,
          roomName: doc.data().roomName,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
          devices: doc.data().devices || [],
          image: doc.data().image || NoImage,
        }));

        const devicesRef = collection(db, 'devices');
        const devicesQuery = query(devicesRef, where('hubCode', '==', selectedHome.hubCode), where('pinned', '==', true));
        const devicesSnapshot = await getDocs(devicesQuery);
        const pinnedDevices: Device[] = devicesSnapshot.docs.map((doc) => ({
          type: 'device',
          id: doc.id,
          deviceName: doc.data().deviceName,
          deviceType: doc.data().deviceType,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
        }));

        const unitsRef = collection(db, 'units');
        const unitsQuery = query(unitsRef, where('hubCode', '==', selectedHome.hubCode), where('pinned', '==', true));
        const unitsSnapshot = await getDocs(unitsQuery);
        const pinnedUnits: Unit[] = unitsSnapshot.docs.map((doc) => ({
          type: 'unit',
          id: doc.id,
          unitName: doc.data().unitName,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
        }));

        const pinnedItems = [...pinnedRooms, ...pinnedDevices, ...pinnedUnits];
        setPinnedItems(pinnedItems);
      } catch (error) {
        console.error('Error fetching pinned items:', error);
      }
    }
  };

  const refreshPinnedMenu = () => {
    fetchPinnedItems();
  };

  useEffect(() => {
    fetchPinnedItems();
  }, [selectedHome]);

  const handleUnpinItem = async (item: PinnedItem) => {
    const db = getFirestore();

    try {
      let collectionName: string;
      switch (item.type) {
        case 'room':
          collectionName = 'rooms';
          break;
        case 'device':
          collectionName = 'devices';
          break;
        case 'unit':
          collectionName = 'units';
          break;
        default:
          throw new Error('Invalid item type.');
      }

      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, { pinned: false });

      setPinnedItems((prev) => prev.filter((i) => i.id !== item.id));
      refreshPinnedMenu();
    } catch (error) {
      console.error('Error unpinning item:', error);
    }
  };

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible);
  };

  const toggleEditHomes = () => {
    setIsEditHomesVisible(!isEditHomesVisible);
  };

  useEffect(() => {
    if (pinnedItems.length === 0) {
      setIsEditing(false);
    }
  }, [pinnedItems]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isPinnedMenuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isPinnedMenuVisible]);

  const handleHomeAdded = () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const userHubsRef = collection(db, 'userHubs');
      const q = query(userHubsRef, where('userId', '==', userId));

      getDocs(q).then((querySnapshot) => {
        const hubs: Home[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          hubs.push({
            homeName: data.homeName,
            homeType: data.homeType,
            hubCode: data.hubCode,
          });
        });

        setHomes(hubs);
      });
    }
  };

  const fetchHomes = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const hubsRef = collection(db, 'userHubs');
      const q = query(hubsRef, where('userId', '==', userId));

      try {
        const querySnapshot = await getDocs(q);
        const homesData: Home[] = [];

        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          homesData.push({
            homeName: data.homeName,
            homeType: data.homeType,
            hubCode: data.hubCode,
          });
        });

        setHomes(homesData);
      } catch (error) {
        console.error('Error fetching user hubs:', error);
      }
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleHomeDeleted = () => {
    fetchHomes();
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {isAddHomeVisible && (
        <AddHome
          closeAddHome={() => setIsAddHomeVisible(false)}
          onHomeAdded={handleHomeAdded}
        />
      )}

      {isEditHomesVisible && (
        <EditHomes
          closeEditHomes={toggleEditHomes}
          onHomeDeleted={handleHomeDeleted}
          onHomeRenamed={handleHomeRenamed}
          homes={homes}
        />
      )}

      <Stack className="homepageContainer" position={'relative'} display={'flex'} overflow={'hidden'}>
        <Box className="homepageHeader" bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#6cce58'}>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} mb={'20px'} fontWeight={'extrabold'} className="introHomepage">
            Ya Halla, <span className="guestIntro">{username}</span>
          </Heading>
        </Box>

        <HStack align="center" ml="20px" mt={'10px'} zIndex={1} bg={'transparent'} width={'90%'}>
          <Heading color={'#454545'} bg={'transparent'}>
            Homes:
          </Heading>
          <Dropdown
            homes={homes}
            onSelect={(home) => {
              onSelectHome(home);
              handleSelectHome(home);
              handleHubSelect(home);
            }}
            initialShow={selectedHome ? selectedHome.homeName : 'Choose Home...'}
          />
          <Button bg={'transparent'} width={'auto'} height={'auto'} onClick={toggleAddHome}>
            <TbCirclePlusFilled color="#21334a" size={'50%'} />
          </Button>

          <Box
            bg={'white'}
            width={'50%'}
            height={'25px'}
            justifyContent={'center'}
            alignItems={'center'}
            alignContent={'center'}
            display={'flex'}
            borderRadius={20}
            onClick={toggleEditHomes}
          >
            <MdOutlineEdit color="#21334a" size={'100%'} style={{ background: 'transparent' }} />
          </Box>
        </HStack>

        <Flex display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'25px'} zIndex={1} bg={'transparent'}>
          <HStack spaceX={'-5%'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} bg={'transparent'}>
            <MiniDisplays Icon={MdOutlinePhoneAndroid} title="Active devices:" value="8" />
            <MiniDisplays Icon={BsGraphUpArrow} title="Home Status:" value="Good" />
            <MiniDisplays Icon={MdOutlineBatterySaver} title="Energy Generation:" value="50KW/h" />
          </HStack>
        </Flex>

        <Flex className="pulseBoxContainer">
          <Lottie
            loop
            animationData={selectedHome?.homeType === 'admin' ? PulseAnimationBlue : PulseAnimationGreen}
            play
            className="pulseAnimation"
            style={{ background: 'transparent' }}
          />
          <Box className="pulseBox" bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'}>
            <Heading bg={'transparent'} fontWeight={'bold'} className="totalConsShow">
              50.1KW/h
            </Heading>
          </Box>
        </Flex>

        <Flex zIndex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Heading color={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'} textDecor={'underline'} className="totConsHeading">
            Total Consumption
          </Heading>
        </Flex>

        <Flex className="shadowPinned">
          <HStack ml="20px" zIndex={1} spaceX={'20%'} display={'flex'} mt={'20px'} className="pinnedinfoContainer">
            <Heading fontSize={'220%'} className="pinnedHeader">
              Pinned
            </Heading>

            <HStack display={'flex'} bg={'transparent'} transform={'translateX(-5%)'}>
              <Flex
                bg="#6cce58"
                borderRadius="full"
                overflow="hidden"
                alignItems="center"
                height={'3vh'}
              >
                <Button
                  bg="transparent"
                  color="white"
                  px={6}
                  py={2}
                  fontSize="md"
                  _hover={{ bg: '#5bb046' }}
                  onClick={() => setPinnedMenuVisible(true)}
                >
                  +
                </Button>
                <Button
                  bg="transparent"
                  color="white"
                  px={6}
                  py={2}
                  fontSize="md"
                  _hover={{ bg: '#5bb046' }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  -
                </Button>
              </Flex>

              <FaExpandAlt
                color="#21334a"
                size={'15%'}
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
              />
            </HStack>
          </HStack>
        </Flex>

        <Flex justifyContent={'center'} display={'flex'} alignItems={'center'} alignContent={'center'} zIndex={1}>
          <Box
            bg={'white'}
            width={isExpanded ? '100vw' : '95%'}
            height={isExpanded ? '100vh' : '300px'}
            overflow={'scroll'}
            position={isExpanded ? 'fixed' : 'static'}
            top={isExpanded ? '0' : 'auto'}
            left={isExpanded ? '0' : 'auto'}
            zIndex={isExpanded ? 1000 : 'auto'}
            mb={'20%'}
          >
            {isExpanded && (
              <Box
                position="absolute"
                top="20px"
                right="20px"
                zIndex={1001}
                cursor="pointer"
                onClick={() => setIsExpanded(false)}
                bg={'transparent'}
              >
                <AiOutlineShrink size={24} color="#21334a" />
              </Box>
            )}

            {isExpanded && (
              <Box
                position="absolute"
                top="20px"
                left="50%"
                transform="translateX(-50%)"
                zIndex={1001}
                textAlign="center"
                overflowY={'scroll'}
              >
                <Heading fontSize="2xl" color="#21334a" bg={'transparent'}>
                  Pinned Items
                </Heading>
              </Box>
            )}

            <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
              {pinnedItems.map((item) => (
                <Box
                  key={item.id}
                  borderRadius="20px"
                  overflow="hidden"
                  bg="white"
                  p={3} // Reduced padding
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                  border={`1px solid ${isEditing ? 'red' : 'rgba(0, 0, 0, 0.08)'}`}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f5f5f5',
                  }}
                  onClick={() => {
                    if (isEditing) {
                      handleUnpinItem(item);
                    } else {
                      if (item.type === 'room') {
                        navigate(`/devices/${item.id}`);
                      } else if (item.type === 'device') {
                        navigate(`/device/${item.id}`);
                      } else if (item.type === 'unit') {
                        navigate(`/unit/${item.id}`);
                      }
                    }
                  }}
                  height="180px" // Slightly reduced height
                >
                  <Image
                    src={
                      item.type === 'room'
                        ? (item as Room).image || NoImage
                        : deviceTypeToImage[normalizeDeviceType((item as Device).deviceType)] || LightImg
                    }
                    alt={item.type === 'room' ? (item as Room).roomName : (item as Device).deviceName}
                    borderRadius="12px"
                    objectFit="cover"
                    width="100%"
                    height="90px" // Reduced image height
                  />
                  <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58"> {/* Reduced font size */}
                    {item.type === 'room' ? (item as Room).roomName : (item as Device).deviceName}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {item.type === 'room' ? `${(item as Room).devices.length} devices` : (item as Device).deviceType}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Stack>

      {selectedHome?.homeType === 'admin' ? (
        <PinnedMenuAdmin
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
          selectedHubCode={selectedHome?.hubCode || ''}
          refreshPinnedMenu={refreshPinnedMenu}
        />
      ) : (
        <PinnedMenu
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
          selectedHubCode={selectedHome?.hubCode || ''}
          refreshPinnedMenu={refreshPinnedMenu}
        />
      )}
    </div>
  );
};

export default Homepage;