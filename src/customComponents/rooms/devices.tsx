import React, { useState, useEffect } from 'react';
import { Box, Grid, Text, VStack, Center, Spinner, Image, HStack, Heading, GridItem } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddDevice from './AddDevice';
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
}

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

const normalizeDeviceType = (deviceType: string): DeviceType => {
  const normalizedType = deviceType.toLowerCase().replace(/\s+/g, '');
  switch (normalizedType) {
    case 'washingmachine':
      return 'washingMachine';
    case 'smartdoor':
      return 'door';
    default:
      return normalizedType as DeviceType;
  }
};

const Devices = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [roomName, setRoomName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAddDeviceVisible, setIsAddDeviceVisible] = useState(false);
  const navigate = useNavigate();

  const fetchRoomAndDevices = async () => {
    if (roomId) {
      const db = getFirestore();
  
      try {
        const roomDocRef = doc(db, 'rooms', roomId);
        const roomDocSnap = await getDoc(roomDocRef);
  
        if (roomDocSnap.exists()) {
          const roomData = roomDocSnap.data();
          setRoomName(roomData.roomName || 'Room');
  
          const deviceIds = roomData.devices || [];
          const devicesRef = collection(db, 'devices');
  
          let devicesData: Device[] = [];
  
          // Only query devices if deviceIds is not empty
          if (deviceIds.length > 0) {
            const devicesQuery = query(devicesRef, where('__name__', 'in', deviceIds));
            const devicesSnapshot = await getDocs(devicesQuery);
  
            devicesSnapshot.forEach((doc) => {
              const data = doc.data();
              const deviceType = normalizeDeviceType(data.deviceType || 'light');
              devicesData.push({
                id: doc.id,
                name: data.deviceName || 'Unnamed Device',
                isOn: false,
                deviceType: deviceType,
              });
            });
          }
  
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

  const getDeviceImage = (deviceType: DeviceType) => {
    return deviceTypeToImage[deviceType] || LightImg;
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
      {isAddDeviceVisible && (
        <AddDevice
          roomId={roomId}
          onClose={() => setIsAddDeviceVisible(false)}
          refreshDevices={fetchRoomAndDevices} // Pass the refresh function
        />
      )}

      <Box bg="#6CCE58" p={6} borderRadius="lg" boxShadow="md" textAlign="center" mb={6}>
        <HStack bg="transparent" justifyContent="space-between" w="100%">
          <button className="back-button" style={{ color: 'white' }} onClick={() => navigate(`/rooms`)}>
            ←
          </button>
          <Heading fontSize="2xl" fontWeight="bold" color="white" bg="transparent" className="roomName">
            {roomName}
          </Heading>
          <Heading fontSize="2xl" fontWeight="bold" color="white" bg="transparent" onClick={() => setIsAddDeviceVisible(true)}>
            +
          </Heading>
        </HStack>
      </Box>

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
                <Image
                  src={getDeviceImage(device.deviceType)}
                  alt={device.name}
                  boxSize="64px"
                  borderRadius="full"
                  bg={device.isOn ? 'green.50' : 'gray.50'}
                  p={2}
                  transition="all 0.3s ease"
                />
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