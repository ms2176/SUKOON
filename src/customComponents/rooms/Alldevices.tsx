import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Text, VStack, Center, Spinner, Image, HStack, Heading, Button } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import LinkDevice from './LinkDevice';

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
  dishwasher: Dishwasher,
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

const AllDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkDevice, setShowLinkDevice] = useState(false);
  const navigate = useNavigate();

  // Get the selected home from localStorage
  const selectedHome = localStorage.getItem('selectedHome')
    ? JSON.parse(localStorage.getItem('selectedHome') as string)
    : null;

  // Fetch all devices attached to the hub
  const fetchDevices = async () => {
    if (selectedHome) {
      const db = getFirestore();

      try {
        // Fetch devices with the same hubCode as the selected home
        const devicesRef = collection(db, 'devices');
        const devicesQuery = query(devicesRef, where('hubCode', '==', selectedHome.hubCode));
        const devicesSnapshot = await getDocs(devicesQuery);

        const devicesData: Device[] = [];
        devicesSnapshot.forEach((doc) => {
          const data = doc.data();
          const deviceType = normalizeDeviceType(data.deviceType || 'light'); // Normalize the device type
          devicesData.push({
            id: doc.id,
            name: data.deviceName || 'Unnamed Device',
            isOn: data.on || false, // Use the 'on' field from Firestore
            deviceType: deviceType,
            hubCode: data.hubCode, // Include hubCode
          });
        });

        setDevices(devicesData);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [selectedHome]);

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
      {/* LinkDevice Modal */}
      {showLinkDevice && (
        <LinkDevice
          closeLinkDevice={() => setShowLinkDevice(false)}
          onDeviceLinked={() => {
            // Re-fetch devices to reflect the newly linked device
            setLoading(true);
            fetchDevices();
          }}
          currentHubCode={selectedHome?.hubCode || ''}
        />
      )}

      {/* Header */}
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
            All Devices {/* Display the title */}
          </Heading>

          <Button
            onClick={() => setShowLinkDevice(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
            }}
          >
            +
          </Button>
        </HStack>
      </Box>

      {/* Devices Grid */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
        {devices.map((device) => (
          <GridItem key={device.id}>
            <Link to={`/device/${device.id}`} state={{ fromAllDevices: true }}>
              {/* Navigate to the device's page */}
              <VStack
                p={4}
                bg="white"
                borderRadius="lg"
                boxShadow="base"
                border={'1px solid #e0e0e0'}
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
                  bg={'gray.50'}
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

export default AllDevices;