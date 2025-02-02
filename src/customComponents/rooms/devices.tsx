import { useState } from 'react';
import { Box, Grid, GridItem, Text, VStack, Image, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ToggleButton from './toggleButton';
import AddDeviceButton from './addDeviceButton';

// Import device images (Icons)
import LightImg from '@/images/devicesIcons/lamp.png';
import TvImg from '@/images/devicesIcons/tv.png';
import FireImg from '@/images/devicesIcons/fireplace.png';
import AcImg from '@/images/devicesIcons/ac.png';
import ConsoleImg from '@/images/devicesIcons/console.png';
import FanImg from '@/images/devicesIcons/fan.png';

const Devices = () => {
  const initialDevices = [
    { id: 1, name: 'Light', isOn: false, image: LightImg },
    { id: 2, name: 'TV', isOn: false, image: TvImg },
    { id: 3, name: 'Fireplace', isOn: false, image: FireImg },
    { id: 4, name: 'AC', isOn: false, image: AcImg },
    { id: 5, name: 'Console', isOn: false, image: ConsoleImg },
    { id: 6, name: 'Fan', isOn: false, image: FanImg },
  ];

  const [devices, setDevices] = useState(initialDevices);

  const toggleDevice = (id: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

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
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Living Room
        </Text>
        <Text fontSize="sm" color="whiteAlpha.800" mt={1}>
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
              {/* Device Icon (Link wrapped around the Image) */}
              <Box position="relative">
                <Link to={`/device/${device.id}`}>
                  <Image
                    src={device.image}
                    alt={device.name}
                    boxSize="64px"
                    borderRadius="full"
                    bg={device.isOn ? 'green.50' : 'gray.50'}
                    p={2}
                    transition="all 0.3s ease"
                  />
                </Link>
              </Box>

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

      {/* Add New Device Button */}
      <Center mt={6}>
        <AddDeviceButton />
      </Center>
    </Box>
  );
};

export default Devices;






