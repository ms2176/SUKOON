import { Box, Button, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React, { useState, useRef } from 'react'
import './Homepage.css'
import Dropdown from './Dropdown.tsx'
import MiniDisplays from './miniDisplays.tsx';

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

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface HomepageProps {
  selectedHome: Home | null;
  onSelectHome: (home: Home) => void;
}

const Homepage: React.FC<HomepageProps> = ({ selectedHomePass, onSelectHome }) => {
  const [username, setUsername] = useState<string>('guest'); // State for username
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]); // Store both rooms and devices
  const [isRemoveRoomVisibile, setRemoveRoomVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [isEditHomesVisible, setIsEditHomesVisible] = useState(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null); // Track the selected home
  const [homes, setHomes] = useState<Home[]>([]); // State to store the list of hubs
  const [loading, setLoading] = useState(true); // State to track loading status
  const pinnedMenuRef = useRef<{ refreshPinnedMenu: () => void }>(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;

        // Fetch the user document from Firestore
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username || 'guest'); // Set the username from Firestore
        } else {
          console.log("User document not found.");
          setUsername('guest'); // Fallback to 'guest'
        }

        // Fetch user hubs
        const userHubsRef = collection(db, "userHubs");
        const q = query(userHubsRef, where("userId", "==", userId));

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

          setHomes(hubs); // Update the state with the fetched hubs

          // Automatically select the first home if one exists
          if (hubs.length > 0) {
            const firstHome = hubs[0];
            setSelectedHome(firstHome); // Set the first home as selected
            onSelectHome(firstHome); // Notify parent component (if needed)
          }
        } catch (error) {
          console.error("Error fetching user hubs:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user is signed in.");
        setUsername('guest'); // Fallback to 'guest'
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle hub selection
  const handleHubSelect = (home: Home) => {
    console.log("Selected hub:", home);
    setSelectedHome(home); // Update the selected home
    onSelectHome(home); // Notify parent component (if needed)
  };
  const handleSelectHome = (home: Home) => {
    setSelectedHome(home); // Update the selected home
    setPinnedItems([]); // Clear the pinned items when a new home is selected

  };

  interface Room {
    type: 'room';
    id: string; // Map to roomId
    roomName: string;
    hubCode: string;
    pinned: boolean;
    devices: string[]; // Array of device IDs
  }
  
  interface Device {
    type: 'device';
    id: string; // Map to deviceId
    deviceName: string;
    deviceId: string; // Keep this if needed for other purposes
    deviceType: string;
    hubCode: string;
    pinned: boolean;
  }
  
  interface Unit {
    type: 'unit';
    id: string; // Map to unitId
    unitName: string;
    unitId: string; // Keep this if needed for other purposes
    hubCode: string;
    pinned: boolean;
  }

  type PinnedItem = Room | Device | Unit; // Union type for pinned items

  
  const handlePinItem = (item: PinnedItem) => {
    setPinnedItems((prev) => [...prev, item]);
  };

  const fetchPinnedItems = async () => {
    const db = getFirestore();
  
    if (selectedHome) {
      try {
        // Fetch pinned rooms
        const roomsRef = collection(db, "rooms");
        const roomsQuery = query(
          roomsRef,
          where("hubCode", "==", selectedHome.hubCode),
          where("pinned", "==", true)
        );
        const roomsSnapshot = await getDocs(roomsQuery);
        const pinnedRooms: Room[] = roomsSnapshot.docs.map((doc) => ({
          type: 'room',
          id: doc.data().roomId, // Use roomId
          roomId: doc.data().roomId, // Include roomId
          roomName: doc.data().roomName,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
          devices: doc.data().devices || [], // Array of device IDs
        }));
  
        // Fetch pinned devices
        const devicesRef = collection(db, "devices");
        const devicesQuery = query(
          devicesRef,
          where("hubCode", "==", selectedHome.hubCode),
          where("pinned", "==", true)
        );
        const devicesSnapshot = await getDocs(devicesQuery);
        const pinnedDevices: Device[] = devicesSnapshot.docs.map((doc) => ({
          type: 'device',
          id: doc.data().deviceId, // Use deviceId
          deviceId: doc.data().deviceId, // Include deviceId
          deviceName: doc.data().deviceName,
          deviceType: doc.data().deviceType,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
        }));
  
        // Fetch pinned units
        const unitsRef = collection(db, "units");
        const unitsQuery = query(
          unitsRef,
          where("hubCode", "==", selectedHome.hubCode),
          where("pinned", "==", true)
        );
        const unitsSnapshot = await getDocs(unitsQuery);
        const pinnedUnits: Unit[] = unitsSnapshot.docs.map((doc) => ({
          type: 'unit',
          id: doc.id, // Use Firestore document ID
          unitId: doc.data().unitId, // Include unitId
          unitName: doc.data().unitName,
          hubCode: doc.data().hubCode,
          pinned: doc.data().pinned,
        }));
  
        // Combine all pinned items
        const pinnedItems = [...pinnedRooms, ...pinnedDevices, ...pinnedUnits];
        setPinnedItems(pinnedItems);
      } catch (error) {
        console.error("Error fetching pinned items:", error);
      }
    }
  };

  const refreshPinnedMenu = () => {
    // Re-fetch pinned items logic here
    fetchPinnedItems();
  };

  useEffect(() => {
    fetchPinnedItems(); // Fetch pinned items when selectedHome changes
  }, [selectedHome]);
  
  const handleUnpinItem = async (item: PinnedItem) => {
    const db = getFirestore();
  
    try {
      if (!item.id) {
        throw new Error("Item ID is missing.");
      }
  
      // Determine the collection name based on the item type
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
          throw new Error("Invalid item type.");
      }
  
      // Update the item's pinned status in Firestore
      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, { pinned: false });
  
      // Remove the item from the local pinnedItems state
      setPinnedItems((prev) => prev.filter((i) => i.id !== item.id));
  
      // Refresh the pinned menu after unpinning an item
      refreshPinnedMenu();
    } catch (error) {
      console.error("Error unpinning item:", error);
    }
  };

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible); // Toggle the info card visibility
  }; 
  
  const toggleEditHomes = () => {
    setIsEditHomesVisible(!isEditHomesVisible); // Toggle the info card visibility
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

  const handleHomeAdded = () => {
    // Refetch the user's homes to update the dropdown
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const userHubsRef = collection(db, "userHubs");
      const q = query(userHubsRef, where("userId", "==", userId));

      getDocs(q).then((querySnapshot) => {
        const hubs: Home[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          hubs.push({
            homeName: data.homeName,
            homeType: data.homeType,
            hubCode: data.hubCode
          });
        });

        setHomes(hubs); // Update the state with the fetched hubs
      });
    }
  };

  const fetchHomes = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const hubsRef = collection(db, "userHubs");
      const q = query(hubsRef, where("userId", "==", userId));

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

        setHomes(homesData); // Update the state with the fetched hubs
      } catch (error) {
        console.error("Error fetching user hubs:", error);
      }
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleHomeDeleted = () => {
    fetchHomes(); // Refetch the list of homes
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {isAddHomeVisible && (
        <AddHome
          closeAddHome={() => setIsAddHomeVisible(false)}
          onHomeAdded={handleHomeAdded} // Pass the callback to update the dropdown
        />
      )}

      {isEditHomesVisible && (
        <EditHomes
          closeEditHomes={toggleEditHomes}
          onHomeDeleted={handleHomeDeleted} />)}

      <Stack className='homepageContainer' position={'relative'} display={'flex'} overflow={'hidden'}>
        <Box className='homepageHeader' bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#6cce58'}>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} mb={'20px'} fontWeight={'extrabold'} className='introHomepage'>
            Ya Halla, <span className='guestIntro'>{username}</span>
          </Heading>
        </Box>

        <HStack align="center" ml="20px" mt={'10px'} zIndex={1} bg={'transparent'} width={'90%'}>
          <Heading color={'#454545'} bg={'transparent'}>
            Homes:
          </Heading>
          <Dropdown homes={homes} onSelect={(home) => {
              onSelectHome(home);
              handleSelectHome(home); 
              handleHubSelect(home);
            }} initialShow={selectedHome ? selectedHome.homeName : 'Choose Home...'}>

          </Dropdown>
          <Button bg={'transparent'} width={'auto'} height={'auto'} onClick={toggleAddHome}>
            <TbCirclePlusFilled color='#21334a' size={'50%'} />  
          </Button>
          
          <Box bg={'white'} width={'50%'} height={'25px'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display={'flex'} borderRadius={20} onClick={toggleEditHomes}>
            <MdOutlineEdit color='#21334a' size={'100%'} style={{background:'transparent'}}/>
          </Box>
        </HStack>

        <Flex display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'25px'} zIndex={1} bg={'transparent'}>
          <HStack spaceX={'-5%'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} bg={'transparent'}>
            <MiniDisplays Icon={MdOutlinePhoneAndroid} title="Active devices:" value="8"></MiniDisplays>
            <MiniDisplays Icon={BsGraphUpArrow} title="Home Status:" value="Good"></MiniDisplays>
            <MiniDisplays Icon={MdOutlineBatterySaver} title="Energy Generation:" value="50KW/h"></MiniDisplays>
          </HStack>
        </Flex>

        <Flex className='pulseBoxContainer'>
          <Lottie loop animationData={selectedHome?.homeType === 'admin' ? PulseAnimationBlue : PulseAnimationGreen} play className='pulseAnimation' style={{background: 'transparent'}}/>
          <Box className='pulseBox' bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'}>
            <Heading bg={'transparent'} fontWeight={'bold'} className='totalConsShow'>
              50.1KW/h
            </Heading>
          </Box>
        </Flex>

        <Flex zIndex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Heading color={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'} textDecor={'underline'} className='totConsHeading'>
            Total Consumption
          </Heading>
        </Flex>

        <Flex className='shadowPinned'>
          <HStack ml="20px" zIndex={1} spaceX={'20%'} display={'flex'} mt={'20px'} className='pinnedinfoContainer'>
            <Heading fontSize={'220%'} className='pinnedHeader'>
              Pinned
            </Heading>

            <HStack display={'flex'} bg={'transparent'} transform={'translateX(-5%)'}>
              <Box bg={'#E4E4E7'} width={'70%'} height={'25px'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display={'flex'} borderRadius={20} onClick={() => setIsEditing(!isEditing)}>
                <Heading className='editHeader' fontSize={'100%'} bg={'transparent'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'2px'}>
                  Edit
                </Heading>
              </Box>

              <FaExpandAlt
                color='#21334a'
                size={'15%'}
                onClick={() => setIsExpanded(!isExpanded)} 
                style={{ cursor: 'pointer' }}
              />
              <TbCirclePlusFilled color='#21334a' size={'20%'} onClick={() => setPinnedMenuVisible(true)} />

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
                transform="translateX(-50%)" y
                zIndex={1001} 
                textAlign="center" 
                overflowY={'scroll'}
              >
                <Heading fontSize="2xl" color="#21334a" bg={'transparent'}>
                  Pinned Items
                </Heading>
              </Box>
            )}

            <Flex
              wrap="wrap"
              gap={'10px'}
              display={'flex'}
              alignItems={'center'}
              alignContent={'center'}
              justifyContent={'center'}
              pt={isExpanded ? '80px' : '0'} 
            >
              {pinnedItems.map((item, index) => (
              <Box width={'calc(45%)'} key={index}>
                {item.type === 'room' ? (
                  <Mockroom
                    style={{ width: 'calc(100%)' }}
                    roomNum={`${index + 1}`}
                    roomName={item.roomName}
                    numDevices={item.devices.length} // Use the length of the devices array
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => handleUnpinItem(item)}
                  />
                ) : item.type === 'device' ? (
                  <MockDevice
                    style={{ width: 'calc(100%)' }}
                    deviceName={item.deviceName}
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => handleUnpinItem(item)}
                  />
                ) : item.type === 'unit' ? (
                  <MockUnits
                    style={{ width: 'calc(100%)' }}
                    unitName={item.unitName}
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => handleUnpinItem(item)}
                  />
                ) : null}
              </Box>
            ))}
            </Flex>
          </Box>
        </Flex>
      </Stack>

      {selectedHome?.homeType === 'admin' ? (
        <PinnedMenuAdmin
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem} // Pass the updated handlePinItem function
          selectedHubCode={selectedHome?.hubCode || ''}
          refreshPinnedMenu={refreshPinnedMenu}
        />
      ) : (
        <PinnedMenu
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
          selectedHubCode={selectedHome?.hubCode || ''} // Pass the selected hub's hubCode
          refreshPinnedMenu={refreshPinnedMenu}
        />
      )}    
      
    </div>
  );
};

export default Homepage;
