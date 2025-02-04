import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React from 'react'
import './pinnedMenu.css'
import Dropdown from './Dropdown'
import { VscClose } from "react-icons/vsc";
import { FaCircleMinus } from "react-icons/fa6";
import Mockroom from './Mockroom';

const pinnedMenu = ({ isVisible, onClose, onPinItem}) => {

    if (!isVisible) return null;

    const handleItemClick = (index) => {
        onPinItem(`MockRoom ${index + 1}`); // Pass item to Homepage
    };

  return (
    <div style={{overflow: 'hidden'}}>

        <Flex position="fixed" width="100vw" height="100vh" justifyContent="center" alignItems="center" zIndex={10} display={'flex'}>
            <Box 
                width="95%" 
                height="50vh" 
                borderColor="#21334a" 
                borderRadius={20} 
                position="fixed" 
                left="50%" 
                top="50%"
                transform={'translate(-50%, -50%)'}
                className='pinBox'
                zIndex={10}
            >
                <Stack bg={'transparent'} className='editStack' spaceY={'20px'}>
                    
                    <HStack bg={'transparent'} spaceX={'50%'}>
                        <Heading className='addPinnedItem'>
                            Pin Item
                            
                        </Heading>
                        
                        <Box bg={'transparent'}>
                            <VscClose color='#21334a' style={{background: 'transparent'}} onClick={onClose}/>
                        </Box>
                       

                    </HStack>
                    


                    <Stack bg={'transparent'}>

                        <HStack bg={'transparent'}>

                            <Heading bg={'transparent'} className='pinType'>
                                Pin type:
                            </Heading>

                            <Dropdown initialShow='Choose Pin Type...'/>
                            
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

                            <Flex wrap="wrap" justify="start" display={'flex'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} spaceX={'10px'}>
                                {[...Array(4)].map((_, index) => (
                                    <>
                                        <Box width={'calc(45%)'}>
                                            <Mockroom key={`${index}-1`} style={{width: 'calc(100%)'}} onClick={() => handleItemClick(index)} roomNum={`${index}-1`}></Mockroom>

                                        </Box>

                                        <Box width={'calc(45%)'}>
                                            <Mockroom key={`${index}-1`} style={{width: 'calc(100%)'}} onClick={() => handleItemClick(index)} roomNum={`${index}-1`}></Mockroom>

                                        </Box>
                                    </>
                                    
                                ))}
                            </Flex>

                        </Box>

                        

                        

                    </Box>
                    
                </Stack>

            </Box>
        </Flex>

      
    </div>
  )
}

export default pinnedMenu
