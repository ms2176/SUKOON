import { Box, Button, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import './Homepage.css'
import { MdArrowDropDown } from "react-icons/md";
import Dropdown from './Dropdown.tsx'
import MiniDisplays from './miniDisplays.tsx';
import { FcTwoSmartphones } from "react-icons/fc";
import { FcPositiveDynamic } from "react-icons/fc";
import { FcChargeBattery } from "react-icons/fc";
import Lottie from 'react-lottie-player';
import PulseAnimationGreen from '@/images/animatedIcons/Animation - 1737092091343.json'
import PulseAnimationBlue from '@/images/animatedIcons/Animation - 1738960096286.json'
import { TbCirclePlusFilled } from "react-icons/tb";
import PinnedMenu from './pinnedMenu.tsx';
import { useEffect } from 'react';
import Mockroom from './Mockroom.tsx';
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineBatterySaver } from "react-icons/md";
import { FaExpandAlt } from "react-icons/fa";
import { AiOutlineShrink } from "react-icons/ai";
import AddHome from './AddHome.tsx';
import EditHomes from './EditHomes.tsx'
import MockDevice from './MockDevice.tsx';
import homesdata from '@/JSONFiles/homesdata.json'
import PinnedMenuAdmin from './pinnedMenuAdmin.tsx';
import MockUnits from './MockUnits.tsx';

interface Home {
  homeName: string;
  homeType: string;
}

interface HomepageProps {
  selectedHome: Home | null;
  onSelectHome: (home: Home) => void;
}

const Homepage: React.FC<HomepageProps> = ({ selectedHomePass, onSelectHome }) => {
  const username = sessionStorage.getItem('username');
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]); // Store both rooms and devices
  const [isRemoveRoomVisibile, setRemoveRoomVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [isEditHomesVisible, setIsEditHomesVisible] = useState(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null); // Track the selected home

  const handleSelectHome = (home: Home) => {
    setSelectedHome(home); // Update the selected home
    setPinnedItems([]); // Clear the pinned items when a new home is selected

  };

  interface Room {
    type: 'room';
    roomName: string;
    numDevices: number;
    roomImage: string;
  }

  interface Device {
    type: 'device'; // Add a type discriminator
    deviceName: string;
    deviceImage: string;
  }

  interface Unit {
    type: 'unit';
    unitName: string;
    unitImage: string;
  }

  type PinnedItem = Room | Device | Unit; // Union type for pinned items


  
  const handlePinItem = (item: Room | Device | Unit) => {
    setPinnedItems((prev) => [...prev, item]); // Add the room object to the pinned list
  };

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible); // Toggle the info card visibility
  }; 
  
  const toggleEditHomes = () => {
    setIsEditHomesVisible(!isEditHomesVisible); // Toggle the info card visibility
  };

  // Disable editing mode if there are no pinned items
  useEffect(() => {
    if (pinnedItems.length === 0) {
      setIsEditing(false);
    }
  }, [pinnedItems]);

  useEffect(() => {
    // Disable scrolling when pinnedMenu is open
    document.body.style.overflow = 'hidden';

    // Clean up and allow scrolling again when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // Disable scrolling when pinnedMenu is open
    if (isPinnedMenuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isPinnedMenuVisible]);

  return (
    <div style={{ overflow: 'hidden' }}>
      {isAddHomeVisible && <AddHome closeAddHome={toggleAddHome}/>}
      {isEditHomesVisible && <EditHomes closeEditHomes={toggleEditHomes}/>}
      <Stack className='homepageContainer' position={'relative'} display={'flex'} overflow={'hidden'}>
        <Box className='homepageHeader' bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#6cce58'}>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} mb={'20px'} fontWeight={'extrabold'} className='introHomepage'>
            Ya Halla, <span className='guestIntro'>{username || 'guest'}</span>
          </Heading>
        </Box>

        <HStack align="center" ml="20px" mt={'10px'} zIndex={1} bg={'transparent'} width={'90%'}>
          <Heading color={'#454545'} bg={'transparent'}>
            Homes:
          </Heading>
          <Dropdown homes={homesdata} onSelect={(home) => {
              onSelectHome(home);
              handleSelectHome(home); 
            }} initialShow='Choose Home...'>

          </Dropdown>
          <Button bg={'transparent'} width={'auto'} height={'auto'} onClick={toggleAddHome}>
            <TbCirclePlusFilled color='#21334a' size={'50%'} />  
          </Button>
          
          <Box bg={'#E4E4E7'} width={'50%'} height={'25px'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display={'flex'} borderRadius={20} onClick={toggleEditHomes}>
            <Heading className='editHeader' fontSize={'80%'} bg={'transparent'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'2px'}>
              Edit
            </Heading>
          </Box>
        </HStack>

        <Flex display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'25px'} zIndex={1} bg={'transparent'}>
          <HStack spaceX={'-5%'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} bg={'transparent'}>
            <MiniDisplays Icon={MdOutlinePhoneAndroid} title="Active devices:" value="8"></MiniDisplays>
            <MiniDisplays Icon={BsGraphUpArrow} title="Home Status:" value="Good"></MiniDisplays>
            <MiniDisplays Icon={MdOutlineBatterySaver} title="Energy Generation:" value="50KW/h"></MiniDisplays>
          </HStack>
        </Flex>

        <Flex className='pulseBoxContainer'>
          <Lottie loop animationData={selectedHome?.homeType === 'admin' ? PulseAnimationBlue : PulseAnimationGreen} play className='pulseAnimation' style={{background: 'transparent'}}/>
          <Box className='pulseBox' bg={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'}>
            <Heading bg={'transparent'} fontWeight={'bold'} className='totalConsShow'>
              50.1KW/h
            </Heading>
          </Box>
        </Flex>

        <Flex zIndex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Heading color={selectedHome?.homeType === 'admin' ? '#0b13b0' : '#05FF02'} textDecor={'underline'} className='totConsHeading'>
            Total Consumption
          </Heading>
        </Flex>

        <Flex className='shadowPinned'>
          <HStack ml="20px" zIndex={1} spaceX={'20%'} display={'flex'} mt={'20px'} className='pinnedinfoContainer'>
            <Heading fontSize={'220%'} className='pinnedHeader'>
              Pinned
            </Heading>

            <HStack display={'flex'} bg={'transparent'} transform={'translateX(-5%)'}>
              <Box bg={'#E4E4E7'} width={'70%'} height={'25px'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display={'flex'} borderRadius={20} onClick={() => setIsEditing(!isEditing)}>
                <Heading className='editHeader' fontSize={'100%'} bg={'transparent'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'2px'}>
                  Edit
                </Heading>
              </Box>

              <FaExpandAlt
                color='#21334a'
                size={'15%'}
                onClick={() => setIsExpanded(!isExpanded)} 
                style={{ cursor: 'pointer' }}
              />
              <TbCirclePlusFilled color='#21334a' size={'20%'} onClick={() => setPinnedMenuVisible(true)} />

            </HStack>
          </HStack>
        </Flex>

        <Flex justifyContent={'center'} display={'flex'} alignItems={'center'} alignContent={'center'} zIndex={1}>
          <Box
            bg={'white'}
            width={isExpanded ? '100vw' : '95%'}
            height={isExpanded ? '100vh' : '300px'}
            overflow={'scroll'}
            position={isExpanded ? 'fixed' : 'static'} 
            top={isExpanded ? '0' : 'auto'}
            left={isExpanded ? '0' : 'auto'}
            zIndex={isExpanded ? 1000 : 'auto'} 
            mb={'20%'}
          >
            {isExpanded && (
              <Box
                position="absolute"
                top="20px" 
                right="20px"
                zIndex={1001} 
                cursor="pointer"
                onClick={() => setIsExpanded(false)} 
                bg={'transparent'}
              >
                <AiOutlineShrink size={24} color="#21334a" />
              </Box>
            )}

            {isExpanded && (
              <Box
                position="absolute"
                top="20px" 
                left="50%" 
                transform="translateX(-50%)" y
                zIndex={1001} 
                textAlign="center" 
                overflowY={'scroll'}
              >
                <Heading fontSize="2xl" color="#21334a" bg={'transparent'}>
                  Pinned Items
                </Heading>
              </Box>
            )}

            <Flex
              wrap="wrap"
              gap={'10px'}
              display={'flex'}
              alignItems={'center'}
              alignContent={'center'}
              justifyContent={'center'}
              pt={isExpanded ? '80px' : '0'} 
            >
              {pinnedItems.map((item, index) => (
              <Box width={'calc(45%)'} key={index}>
                {item.type === 'room' ? (
                  <Mockroom
                    style={{ width: 'calc(100%)' }}
                    roomNum={`${index + 1}`} // Optional: You can pass the index or room ID
                    roomName={item.roomName} // Use `item` instead of `room`
                    numDevices={item.numDevices} // Use `item` instead of `room`
                    image={item.roomImage} // Use `item` instead of `room`
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => {
                      setPinnedItems((prev) => prev.filter((_, i) => i !== index));
                    }}
                  />
                ) : item.type === 'device' ? (
                  <MockDevice
                    style={{ width: 'calc(100%)' }}
                    deviceName={item.deviceName}
                    deviceImage={item.deviceImage}
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => {
                      setPinnedItems((prev) => prev.filter((_, i) => i !== index));
                    }}
                  />
                ) : item.type === 'unit' ? (
                  <MockUnits
                    style={{ width: 'calc(100%)' }}
                    unitName={item.unitName}
                    image={item.unitImage}
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => {
                      setPinnedItems((prev) => prev.filter((_, i) => i !== index));
                    }}
                  />
                ) : null} {/* Add a fallback (null) for unexpected types */}
              </Box>
            ))}
            </Flex>
          </Box>
        </Flex>
      </Stack>

      {selectedHome?.homeType === 'admin' ? (
        <PinnedMenuAdmin
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
        />
      ) : (
        <PinnedMenu
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
        />
      )}    </div>
  );
};

export default Homepage;
