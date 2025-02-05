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
import { LuQrCode } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import AddHome from './AddHome.tsx';
import '@/customComponents/login/register.css'

const InitialView = () => {
  const username = sessionStorage.getItem('username');
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [isRemoveRoomVisibile, setRemoveRoomVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible); // Toggle the info card visibility
};

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
    <div>

        {isAddHomeVisible && <AddHome closeAddHome={toggleAddHome}/> }
      <Stack className='homepageContainer' position={'relative'} display={'flex'} height={'auto'}>
        <Box className='homepageHeader'>
          <Heading bg={'transparent'} ml={'20px'} mt={'20px'} mb={'20px'} fontWeight={'extrabold'} className='introHomepage'>
            Ya Halla, <span className='guestIntro'>{username || 'guest'}</span>
          </Heading>
        </Box>

        <Stack justify={'center'} align={'center'} height={'100vh'} width={'100%'} position={'absolute'} bg={'transparent'}>
            <Heading bg={'transparent'} textAlign={'center'} color={'lightgray'} width={'60%'}>
                Get started by adding your first home!
            </Heading>

            <Button bg={'#6cce58'} width={'40%'} color={'white'} borderRadius={'20px'} onClick={toggleAddHome}>
                Add Home
                
            </Button>

        </Stack>

    </Stack>
        
    </div>
  );
};

export default InitialView;
