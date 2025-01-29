import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Image,
  Grid,
  GridItem,
  Center,
} from '@chakra-ui/react';

// Import device images (Icons)
import LightImg from '@/images/devicesIcons/lamp.png';
import TvImg from '@/images/devicesIcons/tv.png';
import FireImg from '@/images/devicesIcons/fireplace.png';
import AcImg from '@/images/devicesIcons/ac.png';
import ConsoleImg from '@/images/devicesIcons/console.png';
import FanImg from '@/images/devicesIcons/fan.png';

// Define types for props
interface AddDeviceButtonProps {
  onAddDevice: (device: { id: number; name: string; image: string; isOn: boolean }) => void;
}

const deviceImages = [
  { name: 'Light', src: LightImg },
  { name: 'TV', src: TvImg },
  { name: 'Fireplace', src: FireImg },
  { name: 'AC', src: AcImg },
  { name: 'Console', src: ConsoleImg },
  { name: 'Fan', src: FanImg },
];

const AddDeviceButton: React.FC<AddDeviceButtonProps> = ({ onAddDevice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAddDevice = () => {
    if (!deviceName || !selectedImage) {
      alert('Please enter a device name and select an image.');
      return;
    }
    onAddDevice({ id: Date.now(), name: deviceName, image: selectedImage, isOn: false });
    setDeviceName('');
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Center mt={6}>
        <Box
          w="300px"
          h="70px"
          border="2px dashed gray"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setIsModalOpen(true)}
        >
          <HStack>
            <Button size="lg" colorScheme="gray" variant="ghost" fontSize="4xl" p={0}>
              +
            </Button>
            <Text fontSize="lg" color="black" fontWeight="semibold" ml={2}>
              Add New Device
            </Text>
          </HStack>
        </Box>
      </Center>

      {/* Modal */}
      {isModalOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
        >
          <Box w="90%" maxW="400px" bg="white" p={6} borderRadius="md" boxShadow="lg">
            <Text fontSize="xl" fontWeight="bold" mb={4} color="black">
              Add a New Device
            </Text>
            <VStack >
              <Input
                placeholder="Enter device name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                size="md"
                color="black"
              />

              {/* Device Image Selection */}
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {deviceImages.map((device) => (
                  <GridItem key={device.name}>
                    <Box
                      border={selectedImage === device.src ? '2px solid green' : '1px solid gray'}
                      p={2}
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => setSelectedImage(device.src)}
                      transition="all 0.2s"
                      _hover={{ border: '2px solid black' }}
                    >
                      <Image src={device.src} alt={device.name} boxSize="50px" />
                    </Box>
                  </GridItem>
                ))}
              </Grid>

              <HStack>
                <Button colorScheme="blue" onClick={handleAddDevice}>
                  Add
                </Button>
                <Button colorScheme="gray" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddDeviceButton;

