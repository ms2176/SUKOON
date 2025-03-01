import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import './pinnedMenu.css';
import { VscClose, VscAdd } from 'react-icons/vsc'; // Import VscAdd for plus icon
import Mockroom from './Mockroom';
import roomsData from '@/JSONFiles/roomsdata.json'; // Import the JSON file
import Dropdownpinned from './Dropdownpinned.tsx';
import deviceData from '@/JSONFiles/devicesdata.json';
import MockDevice from './MockDevice.tsx';

interface PinnedMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Room | Device) => void; 
}

interface Room {
  type: 'room';
  roomName: string;
  roomImage: string;
  numDevices: number;
}

interface Device {
  type: 'device';
  deviceName: string;
  deviceImage: string;
}

const PinnedMenu: React.FC<PinnedMenuProps> = ({ isVisible, onClose, onPinItem }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Rooms' | 'Devices'>('All');
  const [showRoomList, setShowRoomList] = useState(false); // State to manage the visibility of the room list

  if (!isVisible) return null;

  const handleItemClick = (index: number, type: 'room' | 'device') => {
    if (type === 'room') {
      const room = roomsData[index];
      onPinItem({ type: 'room', ...room }); // Pass the room object to the Homepage
    } else {
      const device = deviceData[index];
      onPinItem({ type: 'device', ...device }); // Pass the device object to the Homepage
    }
  };

  // Function to toggle the room list visibility when the plus button is clicked
  const handleAddRoomClick = () => {
    setShowRoomList(!showRoomList);
  };

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
                <Dropdownpinned initialShow="All"
                    onChange={(value) => setSelectedFilter(value as 'All' | 'Rooms' | 'Devices')}/>
              </HStack>
            </Stack>

            {/* Add Plus Button to show Room List */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg={'transparent'}
              mb={3}
            >
              <VscAdd
                size={30}
                color="#6cce58"
                onClick={handleAddRoomClick}
                style={{ cursor: 'pointer' }}
              />
              <Heading fontSize="xl" ml={3}>
                Add Room
              </Heading>
            </Box>

            {/* Conditionally show the room list when the plus button is clicked */}
            {showRoomList && (
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
                    {(selectedFilter === 'All' || selectedFilter === 'Rooms') &&
                      roomsData.map((room, index) => (
                        <Box key={`room-${index}`} width={'calc(45%)'}>
                          <Mockroom
                            style={{ width: 'calc(100%)' }}
                            onClick={() => handleItemClick(index, 'room')}
                            roomNum={`${index + 1}`}
                            image={room.roomImage}
                            roomName={room.roomName}
                            numDevices={room.numDevices}
                          />
                        </Box>
                      ))}

                    {(selectedFilter === 'All' || selectedFilter === 'Devices') &&
                      deviceData.map((device, index) => (
                        <Box key={`device-${index}`} width={'calc(45%)'}>
                          <MockDevice
                            style={{ width: 'calc(100%)' }}
                            onClick={() => handleItemClick(index, 'device')}
                            deviceName={device.deviceName}
                            deviceImage={device.deviceImage}
                          />
                        </Box>
                      ))}
                  </Flex>
                </Box>
              </Box>
            )}
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenu;
