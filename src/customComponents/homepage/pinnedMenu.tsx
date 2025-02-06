import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import './pinnedMenu.css';
import Dropdown from './Dropdown';
import { VscClose } from 'react-icons/vsc';
import Mockroom from './Mockroom';
import roomsData from '@/JSONFiles/roomsdata.json'; // Import the JSON file
import Dropdownpinned from './Dropdownpinned.tsx';
import deviceData from '@/JSONFiles/devicesdata.json';
import MockDevice from './MockDevice.tsx';

interface PinnedMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Room | Device) => void; }

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
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Rooms' | 'Devices'>('All'); // Move this up

  if (!isVisible) return null;


  const handleItemClick = (index: number, type: 'room' | 'device') => {
    if (type === 'room') {
      const room = roomsData[index]; // Get the full room object
      onPinItem({ type: 'room', ...room }); // Pass the room object to the Homepage
    } else {
      const device = deviceData[index]; // Get the full device object
      onPinItem({ type: 'device', ...device }); // Pass the device object to the Homepage
    }
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

                  {/* Render devices if "All" or "Devices" is selected */}
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
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenu;