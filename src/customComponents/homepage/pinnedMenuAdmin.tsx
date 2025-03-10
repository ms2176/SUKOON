import { Box, Flex, Heading, HStack, Stack, Image, Text, Grid } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './pinnedMenu.css';
<<<<<<< HEAD
import { VscClose, VscAdd } from 'react-icons/vsc'; // Import VscAdd for plus icon
import Mockroom from './Mockroom';
import roomsData from '@/JSONFiles/roomsdata.json'; // Import the JSON file
import Dropdownpinned from './Dropdownpinned.tsx';
import deviceData from '@/JSONFiles/devicesdata.json';
import MockDevice from './MockDevice.tsx';
=======
import { VscClose } from 'react-icons/vsc';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NoImage from '@/images/noImage.png';
>>>>>>> zaid-fixedSettings

interface PinnedMenuAdminProps {
  isVisible: boolean;
  onClose: () => void;
<<<<<<< HEAD
  onPinItem: (item: Room | Device) => void; 
}

interface Room {
  type: 'room';
  roomName: string;
  roomImage: string;
  numDevices: number;
}

interface Device {
  type: 'device';
  deviceName: string;
  deviceImage: string;
}

const PinnedMenu: React.FC<PinnedMenuProps> = ({ isVisible, onClose, onPinItem }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Rooms' | 'Devices'>('All');
  const [showRoomList, setShowRoomList] = useState(false); // State to manage the visibility of the room list

  if (!isVisible) return null;

  const handleItemClick = (index: number, type: 'room' | 'device') => {
    if (type === 'room') {
      const room = roomsData[index];
      onPinItem({ type: 'room', ...room }); // Pass the room object to the Homepage
    } else {
      const device = deviceData[index];
      onPinItem({ type: 'device', ...device }); // Pass the device object to the Homepage
    }
  };

  // Function to toggle the room list visibility when the plus button is clicked
  const handleAddRoomClick = () => {
    setShowRoomList(!showRoomList);
=======
  onPinItem: (item: Unit) => void;
  selectedHubCode: string;
  refreshPinnedMenu: () => void;
}

interface Unit {
  type: 'unit';
  id: string;
  unitName: string;
  hubCode: string;
  pinned: boolean;
  image?: string;
}

const PinnedMenuAdmin: React.FC<PinnedMenuAdminProps> = ({ isVisible, onClose, onPinItem, selectedHubCode, refreshPinnedMenu }) => {
  const [units, setUnits] = useState<Unit[]>([]);

  // Fetch units when the component mounts or selectedHubCode changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedHubCode) {
        console.error('No selected hub code found');
        return;
      }
  
      const db = getFirestore();
  
      try {
        // Query to find the admin hub document based on the selected hub code
        const userHubsRef = collection(db, 'userHubs');
        const q = query(userHubsRef, where('hubCode', '==', selectedHubCode));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          console.error('Admin hub not found for the given hub code');
          return;
        }
  
        const adminHubDoc = querySnapshot.docs[0]; // Assume the first match is correct
        const adminHubData = adminHubDoc.data();
  
        if (adminHubData.homeType !== 'admin') {
          console.error('Selected hub is not an admin hub.');
          return;
        }
  
        // Ensure the admin hub contains a units array
        const unitHubCodes: string[] = adminHubData.units || [];
        if (unitHubCodes.length === 0) {
          setUnits([]);
          return;
        }
  
        // Fetch all unit documents in parallel for better performance
        const unitQueries = unitHubCodes.map((hubCode) => 
          getDocs(query(userHubsRef, where('hubCode', '==', hubCode)))
        );
        const unitSnapshots = await Promise.all(unitQueries);
  
        const unitsData: Unit[] = [];
        unitSnapshots.forEach((unitSnapshot, index) => {
          if (!unitSnapshot.empty) {
            const unitDoc = unitSnapshot.docs[0]; // Take the first document
            const unitData = unitDoc.data();
            unitsData.push({
              type: 'unit',
              id: unitDoc.id,
              unitName: unitData.homeName || 'Unnamed Unit',
              hubCode: unitHubCodes[index], // Use the original hub code
              pinned: unitData.pinned || false,
              image: unitData.image || NoImage,
            });
          } else {
            console.error(`Unit hub with hubCode ${unitHubCodes[index]} not found`);
          }
        });
  
        setUnits(unitsData);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };
  
    fetchUnits();
  }, [selectedHubCode]);
  

  // Handle pinning a unit
  const handleItemClick = async (unit: Unit) => {
    const db = getFirestore();

    try {
      // Update the tenant hub's pinned status
      await updateDoc(doc(db, 'userHubs', unit.id), {
        pinned: true,
      });

      // Add the unit to the pinned items in the parent component
      onPinItem(unit);

      // Refresh the pinned menu
      refreshPinnedMenu();

      // Close the menu
      onClose();
    } catch (error) {
      console.error('Error pinning unit:', error);
    }
>>>>>>> zaid-fixedSettings
  };

  if (!isVisible) return null;

  return (
    <div style={{ overflow: 'hidden' }}>
      <Flex
        position="fixed"
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        zIndex={10}
        display={'flex'}
      >
        <Box
          width="95%"
          height="50vh"
          borderColor="#21334a"
          borderRadius={20}
          position="fixed"
          left="50%"
          top="50%"
          transform={'translate(-50%, -50%)'}
          className="pinBox"
          zIndex={10}
        >
          <Stack bg={'transparent'} className="editStack" spaceY={'20px'}>
            <HStack bg={'transparent'} spaceX={'50%'}>
              <Heading className="addPinnedItem" whiteSpace={'nowrap'}>Pin Item</Heading>
              <Box bg={'transparent'}>
                <VscClose color="#21334a" style={{ background: 'transparent' }} onClick={onClose} />
              </Box>
            </HStack>

            <Stack bg={'transparent'}>
              <HStack bg={'transparent'}>
                <Heading bg={'transparent'} className="pinType" whiteSpace={'nowrap'}>
                  Pin type:
                </Heading>
                <Dropdownpinned initialShow="All"
                    onChange={(value) => setSelectedFilter(value as 'All' | 'Rooms' | 'Devices')}/>
              </HStack>
            </Stack>

            {/* Add Plus Button to show Room List */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg={'transparent'}
              mb={3}
            >
<<<<<<< HEAD
              <VscAdd
                size={30}
                color="#6cce58"
                onClick={handleAddRoomClick}
                style={{ cursor: 'pointer' }}
              />
              <Heading fontSize="xl" ml={3}>
                Add Room
              </Heading>
=======
              <Box width={'100%'} height={'100%'} overflow={'scroll'}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
                  {units.map((unit) => (
                    <Box
                      key={unit.id}
                      borderRadius="20px"
                      overflow="hidden"
                      bg="white"
                      p={3}
                      cursor="pointer"
                      transition="all 0.3s ease-in-out"
                      boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                      border="1px solid rgba(0, 0, 0, 0.08)"
                      _hover={{
                        transform: 'translateY(-5px)',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f5f5f5',
                      }}
                      onClick={() => handleItemClick(unit)}
                      height="180px"
                    >
                      <Image
                        src={unit.image || NoImage}
                        alt={unit.unitName}
                        borderRadius="12px"
                        objectFit="cover"
                        width="100%"
                        height="90px"
                      />
                      <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58">
                        {unit.unitName}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Unit
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
>>>>>>> zaid-fixedSettings
            </Box>

            {/* Conditionally show the room list when the plus button is clicked */}
            {showRoomList && (
              <Box
                bg={'white'}
                width="95%"
                height="30vh"
                borderColor="#21334a"
                borderRadius={20}
                borderWidth={2}
                position="absolute"
                top="60%"
                left="50%"
                transform="translate(-50%, -50%)"
                overflow={'hidden'}
              >
                <Box width={'100%'} height={'100%'} overflow={'scroll'}>
                  <Flex wrap="wrap" justify="start" display={'flex'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} gapX={'10px'}>
                    {(selectedFilter === 'All' || selectedFilter === 'Rooms') &&
                      roomsData.map((room, index) => (
                        <Box key={`room-${index}`} width={'calc(45%)'}>
                          <Mockroom
                            style={{ width: 'calc(100%)' }}
                            onClick={() => handleItemClick(index, 'room')}
                            roomNum={`${index + 1}`}
                            image={room.roomImage}
                            roomName={room.roomName}
                            numDevices={room.numDevices}
                          />
                        </Box>
                      ))}

                    {(selectedFilter === 'All' || selectedFilter === 'Devices') &&
                      deviceData.map((device, index) => (
                        <Box key={`device-${index}`} width={'calc(45%)'}>
                          <MockDevice
                            style={{ width: 'calc(100%)' }}
                            onClick={() => handleItemClick(index, 'device')}
                            deviceName={device.deviceName}
                            deviceImage={device.deviceImage}
                          />
                        </Box>
                      ))}
                  </Flex>
                </Box>
              </Box>
            )}
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenu;
