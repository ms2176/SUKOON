import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Text, VStack, Center, Spinner, Image } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import ToggleButton from './toggleButton';
import AddDeviceButton from './addDeviceButton';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Import device images
import LightImg from '@/images/devicesIcons/lamp.png';
import TvImg from '@/images/devicesIcons/tv.png';
import FireImg from '@/images/devicesIcons/fireplace.png';
import AcImg from '@/images/devicesIcons/ac.png';
import FanImg from '@/images/devicesIcons/fan.png';
import WasherImg from '@/images/devicesIcons/washing-machine.png';
import MicrowaveImg from '@/images/devicesIcons/microwave-oven.png';
import SpeakerImg from '@/images/devicesIcons/speaker.png';
import ThermostatImg from '@/images/devicesIcons/thermostat.png';
import DoorbellImg from '@/images/devicesIcons/smart-door.png';

// Define the Device type
type DeviceType =
  | 'light'
  | 'tv'
  | 'fireplace'
  | 'ac'
  | 'fan'
  | 'washingMachine'
  | 'microwave'
  | 'speaker'
  | 'thermostat'
  | 'door';

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
  fireplace: FireImg,
  ac: AcImg,
  fan: FanImg,
  washingMachine: WasherImg,
  microwave: MicrowaveImg,
  speaker: SpeakerImg,
  thermostat: ThermostatImg,
  door: DoorbellImg,
};

// Normalize device type to match the keys in deviceTypeToImage
const normalizeDeviceType = (deviceType: string): DeviceType => {
  const normalizedType = deviceType.toLowerCase().replace(/\s+/g, ''); // Remove spaces and convert to lowercase
  switch (normalizedType) {
    case 'washingmachine':
      return 'washingMachine';
    case 'microwaveoven':
      return 'microwave';
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
  const [loading, setLoading] = useState(true);

  // Fetch room and associated devices
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

    fetchRoomAndDevices();
  }, [roomId]);

  const toggleDevice = (id: string) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

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
    <Box bg="white" minH="100vh" p={4}>
      {/* Room Header */}
      <Box
        bg="#6CCE58"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        mb={6}
      >
        <Text fontSize="2xl" fontWeight="bold" color="white" bg={'transparent'}>
          Room Devices
        </Text>
        <Text fontSize="sm" color="whiteAlpha.800" mt={1} bg={'transparent'}>
          Manage your devices seamlessly
        </Text>
      </Box>

      {/* Devices Grid */}
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
              <Text fontSize="md" fontWeight="medium" color="gray.700">
                {device.name}
              </Text>

              {/* Toggle Button */}
              <ToggleButton isOn={device.isOn} onToggle={() => toggleDevice(device.id)} />
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Devices;