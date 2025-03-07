import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Heading, Stack, HStack, Grid, GridItem, Text, Image } from '@chakra-ui/react';
import { FaPen } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

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

// Define the Device type
type DeviceType =
  | 'light'
  | 'tv'
  | 'ac'
  | 'fan'
  | 'washingMachine'
  | 'speaker'
  | 'thermostat'
  | 'door'
  | 'heatConvector';

interface Device {
  id: string;
  name: string;
  isOn: boolean;
  deviceType: DeviceType;
}

// Map device types to their corresponding images
const deviceTypeToImage: Record<DeviceType, string> = {
  light: LightImg,
  tv: TvImg,
  ac: AcImg,
  fan: FanImg,
  washingMachine: WasherImg,
  speaker: SpeakerImg,
  thermostat: ThermostatImg,
  door: DoorbellImg,
  heatConvector: HeatconvectorImg,
};

// Normalize device type to match the keys in deviceTypeToImage
const normalizeDeviceType = (deviceType: string): DeviceType => {
  const normalizedType = deviceType.toLowerCase().replace(/\s+/g, ''); // Remove spaces and convert to lowercase
  switch (normalizedType) {
    case 'washingmachine':
      return 'washingMachine';
    case 'smartdoor':
      return 'door';
    // Add other mappings as needed
    default:
      return normalizedType as DeviceType;
  }
};

interface AddDeviceProps {
  onClose: () => void;
  roomId: string; // Pass the roomId as a prop
}

const AddDevice = ({ onClose, roomId }: AddDeviceProps) => {
  const [isAddActive, setIsAddActive] = useState(true);
  const [roomName, setRoomName] = useState<string>(''); // State to store the room name
  const [devices, setDevices] = useState<Device[]>([]); // State to store devices
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch room name and devices when the component mounts
  useEffect(() => {
    const fetchRoomAndDevices = async () => {
      if (roomId) {
        const db = getFirestore();

        try {
          // Fetch the room document
          const roomDocRef = doc(db, 'rooms', roomId);
          const roomDocSnap = await getDoc(roomDocRef);

          if (roomDocSnap.exists()) {
            const roomData = roomDocSnap.data();
            setRoomName(roomData.roomName || 'Room'); // Set the room name

            const deviceIds = roomData.devices || []; // Array of device IDs

            // Fetch devices associated with the room
            const devicesRef = collection(db, 'devices');
            const devicesQuery = query(devicesRef, where('__name__', 'in', deviceIds)); // Query devices by IDs
            const devicesSnapshot = await getDocs(devicesQuery);

            const devicesData: Device[] = [];
            devicesSnapshot.forEach((doc) => {
              const data = doc.data();
              const deviceType = normalizeDeviceType(data.deviceType || 'light'); // Normalize the device type
              devicesData.push({
                id: doc.id,
                name: data.deviceName || 'Unnamed Device',
                isOn: false,
                deviceType: deviceType,
              });
            });

            setDevices(devicesData);
          } else {
            console.error('Room not found');
          }
        } catch (error) {
          console.error('Error fetching room and devices:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoomAndDevices();
  }, [roomId]);

  // Get the image for a device based on its type
  const getDeviceImage = (deviceType: DeviceType) => {
    return deviceTypeToImage[deviceType] || LightImg; // Default to LightImg if deviceType is unknown
  };

  return (
    <Box 
      width={'80%'} 
      zIndex={1000} 
      height={'auto'} 
      bg={'white'} 
      display={'flex'} 
      position={'absolute'} 
      alignContent={'center'} 
      justifyContent={'center'} 
      alignItems={'center'} 
      transform={'translate(-50%, -50%)'} 
      top={'50%'} 
      left={'50%'}
      style={{ borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
    >
      <Stack 
        bg={'transparent'} 
        width={'100%'} 
        spaceY={'5%'} 
        paddingTop={'5%'} 
        paddingBottom={'5%'} 
        display={'flex'} 
        alignItems={'center'}
      >
        {/* Close Button */}
        <IoMdClose 
          style={{
            background: 'transparent',
            position: 'absolute',
            top: '3%',
            right: '5%',
            fontSize: '24px',
            cursor: 'pointer'
          }}
          color='black'
          onClick={onClose}
        />

        {/* Centered Room Name with Pen Icon */}
        <HStack justifyContent="center">
          <Heading color={'#6cc358'} textDecor={'underline'}>
            {roomName} {/* Display the room name */}
          </Heading>
          <FaPen color="#6cc358" size={16} />
        </HStack>

        {/* Power Buttons */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          width="100%"
          margin="0"
          border={'1px solid lightgray'}
        >
          <Button
            flex="1"
            borderRadius="0"
            borderRight="1px solid #ccc"
            bg={isAddActive ? "#6cc358" : "white"}
            color={isAddActive ? "white" : "#6cc358"}
            onClick={() => setIsAddActive(true)}
          >
            Add +
          </Button>
          <Button
            flex="1"
            borderRadius="0"
            bg={!isAddActive ? "#6cc358" : "white"}
            color={!isAddActive ? "white" : "#6cc358"}
            onClick={() => setIsAddActive(false)}
          >
            Delete -
          </Button>
        </Box>

        {/* Devices Grid (Visible only when Delete is active) */}
        {!isAddActive && (
          <Box width={'100%'} height={'30vh'} overflowY={'auto'}>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
              {devices.map((device) => (
                <GridItem key={device.id}>
                  <VStack
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="base"
                    border={device.isOn ? '2px solid #66BB6A' : '1px solid #e0e0e0'}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'lg',
                    }}
                    display={'flex'}
                    justify={'center'}
                    align={'center'}
                    height={'100%'}
                  >
                    {/* Device Icon */}
                    <Image
                      src={getDeviceImage(device.deviceType)}
                      alt={device.name}
                      boxSize="64px"
                      borderRadius="full"
                      bg={device.isOn ? 'green.50' : 'gray.50'}
                      p={2}
                      transition="all 0.3s ease"
                    />

                    {/* Device Name */}
                    <Text fontSize="md" fontWeight="medium" color="gray.700" textAlign={'center'}>
                      {device.name}
                    </Text>
                  </VStack>
                </GridItem>
              ))}
            </Grid>
          </Box>
        )}

        {/* Apply Button */}
        <Button 
          width={'50%'} 
          display={'flex'} 
          height={'auto'} 
          borderRadius={'20px'} 
          bg={'#6cc35a'} 
          color={'white'} 
          fontSize={'150%'} 
          padding={'3%'}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default AddDevice;