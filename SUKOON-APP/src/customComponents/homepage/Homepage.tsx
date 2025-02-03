import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import './Homepage.css'
import { MdArrowDropDown } from "react-icons/md";
import Dropdown from './Dropdown.tsx'
import MiniDisplays from './miniDisplays.tsx';
import { FcTwoSmartphones } from "react-icons/fc";
import { FcPositiveDynamic } from "react-icons/fc";
import { FcChargeBattery } from "react-icons/fc";
import Lottie from 'react-lottie-player';
import PulseAnimation from '@/images/animatedIcons/Animation - 1737092091343.json'
import { TbCirclePlusFilled } from "react-icons/tb";
import PinnedMenu from './pinnedMenu.tsx';
import { useEffect } from 'react';
import Mockroom from './Mockroom.tsx';
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineBatterySaver } from "react-icons/md";
import { FaExpandAlt } from "react-icons/fa";
import { AiOutlineShrink } from "react-icons/ai";

const Homepage = () => {
  const username = sessionStorage.getItem('username');
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [isRemoveRoomVisibile, setRemoveRoomVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode

  const handlePinItem = (item: string) => {
    setPinnedItems((prev) => [...prev, item]); // Add item to pinned list
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
      <Stack className='homepageContainer' position={'relative'} display={'flex'} overflow={'hidden'}>
        <Box className='homepageHeader'>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} fontWeight={'extrabold'} className='introHomepage'>
            Ya Halla, <span className='guestIntro'>{username || 'guest'}</span>
          </Heading>
        </Box>

        <HStack align="center" ml="20px" mt={'10px'} zIndex={1}>
          <Heading color={'#454545'} bg={'transparent'}>
            Homes:
          </Heading>
          <Dropdown initialShow='Choose Home...'></Dropdown>
        </HStack>

        <Flex display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} mt={'25px'} zIndex={1} bg={'transparent'}>
          <HStack spaceX={-5} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <MiniDisplays Icon={MdOutlinePhoneAndroid} title="Active devices:" value="8"></MiniDisplays>
            <MiniDisplays Icon={BsGraphUpArrow} title="Home Status:" value="Good"></MiniDisplays>
            <MiniDisplays Icon={MdOutlineBatterySaver} title="Energy Generation:" value="50KW/h"></MiniDisplays>
          </HStack>
        </Flex>

        <Flex className='pulseBoxContainer'>
          <Lottie loop animationData={PulseAnimation} play className='pulseAnimation' />
          <Box className='pulseBox'>
            <Heading bg={'transparent'} fontWeight={'bold'} className='totalConsShow'>
              50.1KW/h
            </Heading>
          </Box>
        </Flex>

        <Flex zIndex={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Heading color={'#05FF02'} textDecor={'underline'} className='totConsHeading'>
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
            height={isExpanded ? '100vh' : '50vw'}
            overflow={'scroll'}
            position={isExpanded ? 'fixed' : 'static'} 
            top={isExpanded ? '0' : 'auto'}
            left={isExpanded ? '0' : 'auto'}
            zIndex={isExpanded ? 1000 : 'auto'} 
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
              >
                <Heading fontSize="2xl" color="#21334a" bg={'transparent'}>
                  Pinned Items
                </Heading>
              </Box>
            )}

            <Flex
              wrap="wrap"
              spaceX={'10px'}
              display={'flex'}
              alignItems={'center'}
              alignContent={'center'}
              justifyContent={'center'}
              pt={isExpanded ? '80px' : '0'} 
            >
              {pinnedItems.map((item, index) => (
                <Box width={'calc(45%)'} key={index}>
                  <Mockroom
                    style={{ width: 'calc(100%)' }}
                    roomNum={item}
                    isEditing={isEditing && pinnedItems.length > 0}
                    onRemove={() => {
                      setPinnedItems(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Stack>

      <PinnedMenu isVisible={isPinnedMenuVisible} onClose={() => setPinnedMenuVisible(false)} onPinItem={handlePinItem} />
    </div>
  );
};

export default Homepage;
