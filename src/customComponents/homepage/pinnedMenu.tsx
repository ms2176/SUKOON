import { Box, Flex, Heading, HStack, Stack, Image, Text, Grid } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './pinnedMenu.css';
import { VscClose } from 'react-icons/vsc';
import Dropdownpinned from './Dropdownpinned.tsx';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import NoImage from '@/images/noImage.png'; // Default image for rooms

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

interface PinnedMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Room | Device) => void;
  selectedHubCode: string;
  refreshPinnedMenu: () => void;
}

interface Room {
  type: 'room';
  id: string;
  roomName: string;
  hubCode: string;
  pinned: boolean;
  devices: string[];
  image?: string; // Optional field for room image
}

interface Device {
  type: 'device';
  id: string;
  deviceName: string;
  deviceType: DeviceType;
  hubCode: string;
  pinned: boolean;
}

const PinnedMenu: React.FC<PinnedMenuProps> = ({ isVisible, onClose, onPinItem, selectedHubCode, refreshPinnedMenu }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Rooms' | 'Devices'>('All');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  // Fetch rooms and devices from Firestore
  const fetchRoomsAndDevices = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user && selectedHubCode) {
      try {
        // Fetch all rooms associated with the selected hub that are not pinned
        const roomsRef = collection(db, 'rooms');
        const roomsQuery = query(
          roomsRef,
          where('hubCode', '==', selectedHubCode),
          where('pinned', 'in', [false, null]) // Include items where pinned is false or undefined
        );
        const roomsSnapshot = await getDocs(roomsQuery);

        const roomsData: Room[] = [];
        roomsSnapshot.forEach((doc) => {
          const data = doc.data();
          roomsData.push({
            type: 'room',
            id: doc.id,
            roomName: data.roomName,
            hubCode: data.hubCode,
            pinned: data.pinned || false, // Default to false if pinned is undefined
            devices: data.devices || [],
            image: data.image || NoImage, // Use a default image if no image is provided
          });
        });
        setRooms(roomsData);

        // Fetch all devices associated with the selected hub that are not pinned
        const devicesRef = collection(db, 'devices');
        const devicesQuery = query(
          devicesRef,
          where('hubCode', '==', selectedHubCode),
          where('pinned', 'in', [false, null]) // Include items where pinned is false or undefined
        );
        const devicesSnapshot = await getDocs(devicesQuery);

        const devicesData: Device[] = [];
        devicesSnapshot.forEach((doc) => {
          const data = doc.data();
          devicesData.push({
            type: 'device',
            id: doc.id,
            deviceName: data.deviceName,
            deviceType: data.deviceType as DeviceType, // Ensure deviceType matches DeviceType
            hubCode: data.hubCode,
            pinned: data.pinned || false, // Default to false if pinned is undefined
          });
        });
        setDevices(devicesData);
      } catch (error) {
        console.error('Error fetching rooms and devices:', error);
      }
    }
  };

  useEffect(() => {
    fetchRoomsAndDevices(); // Fetch all items when the component mounts or selectedHubCode changes
  }, [selectedHubCode]);

  useEffect(() => {
    if (isVisible) {
      fetchRoomsAndDevices(); // Re-fetch all items when the menu is opened
    }
  }, [isVisible]);

  // Handle pinning an item (room or device)
  const handleItemClick = async (item: Room | Device) => {
    const db = getFirestore();

    try {
      const collectionName = item.type === 'room' ? 'rooms' : 'devices';
      const itemRef = doc(db, collectionName, item.id);

      // Update the item's pinned status in Firestore
      await updateDoc(itemRef, { pinned: true });

      // Notify the parent component that an item has been pinned
      onPinItem(item);

      // Remove the pinned item from the local state
      if (item.type === 'room') {
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== item.id));
      } else {
        setDevices((prevDevices) => prevDevices.filter((device) => device.id !== item.id));
      }

      // Refresh the pinned menu and re-fetch unpinned items
      refreshPinnedMenu();
    } catch (error) {
      console.error('Error pinning item:', error);
    }
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
              <Box bg={'transparent'} pos={'absolute'} right={'5%'} top={'5%'}>
                <VscClose color="#21334a" style={{ background: 'transparent' }} onClick={onClose} />
              </Box>
            </HStack>

            <Stack bg={'transparent'}>
              <HStack bg={'transparent'}>
                <Heading bg={'transparent'} className="pinType" whiteSpace={'nowrap'}>
                  Pin type:
                </Heading>
                <Dropdownpinned
                  initialShow="All"
                  onChange={(value) => setSelectedFilter(value as 'All' | 'Rooms' | 'Devices')}
                />
              </HStack>
            </Stack>

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
                <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
                  {/* Render rooms if "All" or "Rooms" is selected */}
                  {(selectedFilter === 'All' || selectedFilter === 'Rooms') &&
                    rooms.map((room) => (
                      <Box
                        key={room.id}
                        borderRadius="20px"
                        overflow="hidden"
                        bg="white"
                        p={3} // Reduced padding
                        cursor="pointer"
                        transition="all 0.3s ease-in-out"
                        boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                        border="1px solid rgba(0, 0, 0, 0.08)"
                        _hover={{
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#f5f5f5',
                        }}
                        onClick={() => handleItemClick(room)}
                        height="180px" // Slightly reduced height
                      >
                        <Image
                          src={room.image || NoImage}
                          alt={room.roomName}
                          borderRadius="12px"
                          objectFit="cover"
                          width="100%"
                          height="90px" // Reduced image height
                        />
                        <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58"> {/* Reduced font size */}
                          {room.roomName}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {room.devices.length} devices
                        </Text>
                      </Box>
                    ))}

                  {/* Render devices if "All" or "Devices" is selected */}
                  {(selectedFilter === 'All' || selectedFilter === 'Devices') &&
                    devices.map((device) => (
                      <Box
                        key={device.id}
                        borderRadius="20px"
                        overflow="hidden"
                        bg="white"
                        p={3} // Reduced padding
                        cursor="pointer"
                        transition="all 0.3s ease-in-out"
                        boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                        border="1px solid rgba(0, 0, 0, 0.08)"
                        _hover={{
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#f5f5f5',
                        }}
                        onClick={() => handleItemClick(device)}
                        height="180px" // Slightly reduced height
                      >
                        <Image
                          src={deviceTypeToImage[device.deviceType] || LightImg} // Use device icon
                          alt={device.deviceName}
                          borderRadius="12px"
                          objectFit="cover"
                          width="100%"
                          height="90px" // Reduced image height
                        />
                        <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58"> {/* Reduced font size */}
                          {device.deviceName}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {device.deviceType}
                        </Text>
                      </Box>
                    ))}
                </Grid>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenu;



