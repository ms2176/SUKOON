import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Heading, Stack, HStack, Grid, GridItem, Text, Image, Input } from '@chakra-ui/react';
import { FaPen } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { LuImageUp } from 'react-icons/lu';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

interface AddDeviceProps {
  onClose: () => void;
  roomId: string;
  refreshDevices: () => void;
}

const AddDevice = ({ onClose, roomId, refreshDevices }: AddDeviceProps) => {
  const [isAddActive, setIsAddActive] = useState(true);
  const [roomName, setRoomName] = useState<string>('');
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<Set<string>>(new Set());
  const [roomImage, setRoomImage] = useState<string | null>(null);

  useEffect(() => {
    fetchRoomAndDevices();
  }, [roomId]);

  const fetchRoomAndDevices = async () => {
    if (roomId) {
      const db = getFirestore();

      try {
        const roomDocRef = doc(db, 'rooms', roomId);
        const roomDocSnap = await getDoc(roomDocRef);

        if (roomDocSnap.exists()) {
          const roomData = roomDocSnap.data();
          setRoomName(roomData.roomName || 'Room');
          setRoomImage(roomData.image || null);

          const deviceIds = roomData.devices || [];
          const devicesRef = collection(db, 'devices');
          let devicesData: Device[] = [];

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

          const selectedHome = JSON.parse(localStorage.getItem('selectedHome') || '{}') || {};
          const hubCode = selectedHome.hubCode || 'defaultHubCode';

          if (hubCode) {
            const roomsRef = collection(db, 'rooms');
            const roomsQuery = query(roomsRef, where('hubCode', '==', hubCode));
            const roomsSnapshot = await getDocs(roomsQuery);

            const assignedDeviceIds = new Set<string>();
            roomsSnapshot.forEach((doc) => {
              const roomData = doc.data();
              if (roomData.devices) {
                roomData.devices.forEach((deviceId: string) => assignedDeviceIds.add(deviceId));
              }
            });

            const allDevicesQuery = query(devicesRef, where('hubCode', '==', hubCode));
            const allDevicesSnapshot = await getDocs(allDevicesQuery);

            const allDevices: Device[] = [];
            allDevicesSnapshot.forEach((doc) => {
              const data = doc.data();
              const deviceType = normalizeDeviceType(data.deviceType || 'light');
              allDevices.push({
                id: doc.id,
                name: data.deviceName || 'Unnamed Device',
                isOn: false,
                deviceType: deviceType,
              });
            });

            const availableDevicesData = allDevices.filter(
              (device) => !assignedDeviceIds.has(device.id)
            );

            setAvailableDevices(availableDevicesData);
          }
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

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const handleApply = async () => {
    if (roomId) {
      const db = getFirestore();
      const roomDocRef = doc(db, 'rooms', roomId);
  
      try {
        const roomDocSnap = await getDoc(roomDocRef);
        if (roomDocSnap.exists()) {
          const roomData = roomDocSnap.data();
          const currentDevices = roomData.devices || [];
  
          if (isAddActive) {
            // Add selected devices to the room's devices array
            const updatedDevices = [...currentDevices, ...Array.from(selectedDeviceIds)];
            await updateDoc(roomDocRef, { devices: updatedDevices });
  
            const newDevices = availableDevices.filter((device) =>
              Array.from(selectedDeviceIds).includes(device.id)
            );
            setDevices((prev) => [...prev, ...newDevices]);
          } else {
            // Remove selected devices from the room's devices array
            const updatedDevices = currentDevices.filter((id: string) => !selectedDeviceIds.has(id));
            await updateDoc(roomDocRef, { devices: updatedDevices });
  
            // Update the local state by filtering out the removed devices
            setDevices((prev) => prev.filter((device) => !selectedDeviceIds.has(device.id)));
          }
  
          // Update the room name if it was edited
          if (isEditingRoomName) {
            await updateDoc(roomDocRef, { roomName: roomName });
            setIsEditingRoomName(false);
          }
  
          // Clear selected devices
          setSelectedDeviceIds(new Set());
  
          // Refresh the device grids
          fetchRoomAndDevices();
  
          // Call the refreshDevices callback to update the Devices page
          refreshDevices(); // This ensures the Devices component updates its state
        }
      } catch (error) {
        console.error('Error updating room devices:', error);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const db = getFirestore();
        const storage = getStorage();

        const storageRef = ref(storage, `room-images/${roomId}`);
        await uploadBytes(storageRef, file);

        const imageUrl = await getDownloadURL(storageRef);

        const roomDocRef = doc(db, 'rooms', roomId);
        await updateDoc(roomDocRef, { image: imageUrl });

        setRoomImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const getDeviceImage = (deviceType: DeviceType) => {
    return deviceTypeToImage[deviceType] || LightImg;
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
      style={{ borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
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
        <IoMdClose
          style={{
            background: 'transparent',
            position: 'absolute',
            top: '3%',
            right: '5%',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          color="black"
          onClick={onClose}
        />

        <Box
          position="absolute"
          top="3%"
          left="5%"
          cursor="pointer"
          onClick={() => document.getElementById('room-image-upload').click()}
        >
          <LuImageUp size={24} color="#6cc358" />
          <input
            id="room-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Box>

        <HStack justifyContent="center">
          {isEditingRoomName ? (
            <Input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              size="md"
              width="auto"
              textAlign="center"
              color="#6cc358"
              fontWeight="bold"
            />
          ) : (
            <Heading color={'#6cc358'} textDecor={'underline'}>
              {roomName}
            </Heading>
          )}
          <FaPen
            color="#6cc358"
            size={16}
            onClick={() => setIsEditingRoomName(!isEditingRoomName)}
            style={{ cursor: 'pointer' }}
          />
        </HStack>

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
            bg={isAddActive ? '#6cc358' : 'white'}
            color={isAddActive ? 'white' : '#6cc358'}
            onClick={() => setIsAddActive(true)}
          >
            Add +
          </Button>
          <Button
            flex="1"
            borderRadius="0"
            bg={!isAddActive ? '#6cc358' : 'white'}
            color={!isAddActive ? 'white' : '#6cc358'}
            onClick={() => setIsAddActive(false)}
          >
            Delete -
          </Button>
        </Box>

        {isAddActive && (
          <Box width={'100%'} height={'30vh'} overflowY={'auto'}>
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4}>
              {availableDevices.map((device) => (
                <GridItem key={device.id}>
                  <VStack
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="base"
                    border={selectedDeviceIds.has(device.id) ? '2px solid #66BB6A' : '1px solid #e0e0e0'}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'lg',
                    }}
                    display={'flex'}
                    justify={'center'}
                    align={'center'}
                    height={'100%'}
                    onClick={() => handleDeviceSelect(device.id)}
                    cursor="pointer"
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
                </GridItem>
              ))}
            </Grid>
          </Box>
        )}

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
                    border={selectedDeviceIds.has(device.id) ? '2px solid #66BB6A' : '1px solid #e0e0e0'}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'lg',
                    }}
                    display={'flex'}
                    justify={'center'}
                    align={'center'}
                    height={'100%'}
                    onClick={() => handleDeviceSelect(device.id)}
                    cursor="pointer"
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
                </GridItem>
              ))}
            </Grid>
          </Box>
        )}

        <Button
          width={'50%'}
          display={'flex'}
          height={'auto'}
          borderRadius={'20px'}
          bg={'#6cc35a'}
          color={'white'}
          fontSize={'150%'}
          padding={'3%'}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default AddDevice;