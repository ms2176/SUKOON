import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Text, VStack, Center, Spinner, Image, HStack, Heading } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddDevice from './AddDevice';

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

interface Device {
  id: string;
  name: string;
  isOn: boolean;
  deviceType: DeviceType;
  hubCode: string; // Add hubCode to the Device interface
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
  heatconvector: HeatconvectorImg,
  dishwasher: Dishwasher
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

const Devices = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [roomName, setRoomName] = useState<string>(''); // State to store the room name
  const [loading, setLoading] = useState(true);
  const [isAddDeviceVisible, setIsAddDeviceVisible] = useState(false); // State to manage AddDevice visibility

  const navigate = useNavigate();

  // Fetch room and associated devices
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
            console.log(`Device ID: ${doc.id}, Device Type: ${deviceType}`); // Log the device type
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

  useEffect(() => {
    fetchRoomAndDevices();
  }, [roomId]);

  // Get the image for a device based on its type
  const getDeviceImage = (deviceType: DeviceType) => {
    return deviceTypeToImage[deviceType] || LightImg; // Default to LightImg if deviceType is unknown
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box bg="white" minH="100vh" p={4} overflowY={'scroll'} pb={'20%'}>
      {/* Pass the refreshDevices function to AddDevice */}
      {isAddDeviceVisible && (
        <AddDevice
          roomId={roomId}
          onClose={() => setIsAddDeviceVisible(false)}
          refreshDevices={fetchRoomAndDevices} // Pass the refresh function
        />
      )}

      {/* Room Header */}
      <Box
        bg="#6CCE58"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        mb={6}
      >
        <HStack bg="transparent" justifyContent="space-between" w="100%">
          <button className="back-button" style={{ color: 'white' }} onClick={() => navigate(`/rooms`)}>
            ←
          </button>

          <Heading fontSize="2xl" fontWeight="bold" color="white" bg="transparent" className="roomName">
            {roomName} {/* Display the room name */}
          </Heading>

          <Heading fontSize="2xl" fontWeight="bold" color="white" bg="transparent" onClick={() => setIsAddDeviceVisible(true)}>
            +
          </Heading>
        </HStack>
      </Box>

      {/* Devices Grid */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
        {devices.map((device) => (
          <GridItem key={device.id}>
            <Link to={`/devices/${roomId}/${device.id}`} state={{ fromAllDevices: false }}>
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
            </Link>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Devices;