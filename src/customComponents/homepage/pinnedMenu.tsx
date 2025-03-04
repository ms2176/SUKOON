import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState, useEffect} from 'react';
import './pinnedMenu.css';
import { VscClose } from 'react-icons/vsc';
import Mockroom from './Mockroom';
import Dropdownpinned from './Dropdownpinned.tsx';
import MockDevice from './MockDevice.tsx';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc  } from "firebase/firestore";

interface PinnedMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Room | Device) => void;
  selectedHubCode: string;
  refreshPinnedMenu: () => void; // Add this prop
}

interface Room {
  type: 'room';
  id: string; // Map to roomId
  roomName: string;
  hubCode: string;
  roomId: string;
  pinned: boolean;
  devices: string[]; // Array of device IDs
}

interface Device {
  type: 'device';
  id: string; // Map to deviceId
  deviceName: string;
  deviceId: string; // Keep this if needed for other purposes
  deviceType: string;
  hubCode: string;
  pinned: boolean;
}

const PinnedMenu: React.FC<PinnedMenuProps> = ({ isVisible, onClose, onPinItem, selectedHubCode, refreshPinnedMenu }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Rooms' | 'Devices'>('All');
  const [rooms, setRooms] = useState<Room[]>([]); // State to store rooms
  const [devices, setDevices] = useState<Device[]>([]); // State to store devices

  const fetchRoomsAndDevices = async () => {
    const auth = getAuth();
    const db = getFirestore();
  
    const user = auth.currentUser;
    if (user && selectedHubCode) {
      try {
        // Fetch rooms associated with the selected hub
        const roomsRef = collection(db, "rooms");
        const roomsQuery = query(
          roomsRef,
          where("hubCode", "==", selectedHubCode),
          where("pinned", "==", false) // Only fetch unpinned items
        );
        const roomsSnapshot = await getDocs(roomsQuery);
  
        const roomsData: Room[] = [];
        roomsSnapshot.forEach((doc) => {
          const data = doc.data();
          roomsData.push({
            type: 'room',
            id: data.roomId, // Use roomId
            roomId: data.roomId, // Include roomId
            roomName: data.roomName,
            hubCode: data.hubCode,
            pinned: data.pinned,
            devices: data.devices || [], // Array of device IDs
          });
        });
        setRooms(roomsData);
  
        // Fetch devices associated with the selected hub
        const devicesRef = collection(db, "devices");
        const devicesQuery = query(
          devicesRef,
          where("hubCode", "==", selectedHubCode),
          where("pinned", "==", false) // Only fetch unpinned items
        );
        const devicesSnapshot = await getDocs(devicesQuery);
  
        const devicesData: Device[] = [];
        devicesSnapshot.forEach((doc) => {
          const data = doc.data();
          devicesData.push({
            type: 'device',
            id: data.deviceId, // Use deviceId
            deviceId: data.deviceId, // Include deviceId
            deviceName: data.deviceName,
            deviceType: data.deviceType,
            hubCode: data.hubCode,
            pinned: data.pinned,
          });
        });
        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching rooms and devices:", error);
      }
    }
  };

  useEffect(() => {
    fetchRoomsAndDevices(); // Fetch unpinned items when the component mounts or selectedHubCode changes
  }, [selectedHubCode]);

  useEffect(() => {
    if (isVisible) {
      fetchRoomsAndDevices(); // Re-fetch unpinned items when the menu is opened
    }
  }, [isVisible]);

  const handleItemClick = async (item: Room | Device) => {
    const db = getFirestore();
  
    try {
      if (!item.id) {
        throw new Error("Item ID is missing.");
      }
  
      const collectionName = item.type === 'room' ? 'rooms' : 'devices';
      const itemId = item.type === 'room' ? item.roomId : item.deviceId;
  
      const itemRef = doc(db, collectionName, itemId);
      await updateDoc(itemRef, { pinned: true });
  
      onPinItem({
        ...item,
        id: itemId,
      });
  
      // Refresh the pinned menu after pinning an item
      refreshPinnedMenu(); // Call the function passed from Homepage
      fetchRoomsAndDevices(); // Re-fetch unpinned items
    } catch (error) {
      console.error("Error pinning item:", error);
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
              <Box bg={'transparent'}>
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
                <Flex wrap="wrap" justify="start" display={'flex'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} gapX={'10px'}>
                  {/* Render rooms if "All" or "Rooms" is selected */}
                  {(selectedFilter === 'All' || selectedFilter === 'Rooms') &&
                    rooms.map((room, index) => (
                      <Box key={`room-${index}`} width={'calc(45%)'}>
                        <Mockroom
                          style={{ width: 'calc(100%)' }}
                          onClick={() => handleItemClick(room)}
                          roomNum={`${index + 1}`}
                          roomName={room.roomName}
                        />
                      </Box>
                    ))}

                  {/* Render devices if "All" or "Devices" is selected */}
                  {(selectedFilter === 'All' || selectedFilter === 'Devices') &&
                    devices.map((device, index) => (
                      <Box key={`device-${index}`} width={'calc(45%)'}>
                        <MockDevice
                          style={{ width: 'calc(100%)' }}
                          onClick={() => handleItemClick(device)}
                          deviceName={device.deviceName}
                        />
                      </Box>
                    ))}
                </Flex>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenu;