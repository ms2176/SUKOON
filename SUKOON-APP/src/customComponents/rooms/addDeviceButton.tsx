import React, { useState } from 'react';
import { Box, Text, Button, VStack, HStack, Image, Center } from '@chakra-ui/react';

// Import device images (Icons)
import LightImg from '@/images/devicesIcons/lamp.png';
import TvImg from '@/images/devicesIcons/tv.png';
import FireImg from '@/images/devicesIcons/fireplace.png';
import AcImg from '@/images/devicesIcons/ac.png';
import ConsoleImg from '@/images/devicesIcons/console.png';
import FanImg from '@/images/devicesIcons/fan.png';
import DishwasherImg from '@/images/devicesIcons/dishwasher.png';
import HeaterImg from '@/images/devicesIcons/heater-convector.png';
import MicrowaveImg from '@/images/devicesIcons/microwave-oven.png';
import ThermostatImg from '@/images/devicesIcons/thermostat.png';
import CoffeeMachineImg from '@/images/devicesIcons/coffee-machine.png';
import HumidifierImg from '@/images/devicesIcons/humidifier.png';
import SmartDoorImg from '@/images/devicesIcons/smart-door.png';
import SpeakerImg from '@/images/devicesIcons/speaker.png';
import WashingMachineImg from '@/images/devicesIcons/washing-machine.png';

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
  { name: 'Dishwasher', src: DishwasherImg },
  { name: 'Heater Convector', src: HeaterImg },
  { name: 'Microwave Oven', src: MicrowaveImg },
  { name: 'Thermostat', src: ThermostatImg },
  { name: 'Coffee Machine', src: CoffeeMachineImg },
  { name: 'Humidifier', src: HumidifierImg },
  { name: 'Smart Door', src: SmartDoorImg },
  { name: 'Speaker', src: SpeakerImg },
  { name: 'Washing Machine', src: WashingMachineImg }
];

const AddDeviceButton: React.FC<AddDeviceButtonProps> = ({ onAddDevice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDevice = (device: { name: string; src: string }) => {
    onAddDevice({ id: Date.now(), name: device.name, image: device.src, isOn: false });
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
            <Button size="lg" colorScheme="gray" variant="ghost" fontSize="4xl" p={0}>+</Button>
            <Text fontSize="lg" color="black" fontWeight="semibold" ml={2}>Add New Device</Text>
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
          <Box w="90%" maxW="400px" bg="white" p={6} borderRadius="lg" boxShadow="xl">
            <Text fontSize="xl" fontWeight="bold" mb={4} color="#6cce58" textAlign="center">
              Select a Device to Add
            </Text>
            <Box maxH="400px" overflowY="auto" borderRadius="md" border="1px solid #ddd" p={2}>
              <VStack align="stretch" >
                {deviceImages.map((device) => (
                  <HStack
                    key={device.name}
                    p={3}
                    borderRadius="md"
                    border="1px solid gray"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: '#6cce58', color: 'white' }}
                    onClick={() => handleAddDevice(device)}
                  >
                    <Image src={device.src} alt={device.name} boxSize="40px" />
                    <Text fontSize="md" fontWeight="medium" color="black" _hover={{ color: 'black' }}>{device.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <HStack justifyContent="flex-end" mt={4}>
              <Button colorScheme="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddDeviceButton;




