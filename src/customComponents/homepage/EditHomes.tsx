import React, { useState } from 'react'
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { FormControl } from '@chakra-ui/form-control'
import './AddHome.css'
import { FaCamera } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import ListboxComp from './ListboxComp';
import './EditHomes.css'

interface EditHomesProps {
    closeEditHomes: () => void;
}

const EditHomes: React.FC<EditHomesProps> = ({ closeEditHomes }) => {

    const [selectedHome, setSelectedHome] = useState<string | null>(null);

  const handleSelectHome = (homeName: string) => {
    setSelectedHome(homeName); // Update the selected home name
  };

  return (
    <div>

        <Box className='addContainer' width={'80%'} position={'absolute'} bg={'white'} height={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} transform={'translate(-50%, -50%)'} top={'50%'} left={'50%'} zIndex={100}>
            <Stack margin={'5% 5% 5% 5%'} >

                <Button position={'absolute'} top={'5%'} right={'5%'} width={'auto'} height={'auto'} onClick={closeEditHomes}>
                    <IoCloseCircleSharp style={{background: 'transparent'}} size={'20%'}/>
                </Button>

                <Heading bg={'transparent'} textAlign={'center'} color={'black'} className='edithomes'>
                    Edit Homes
                </Heading>

                <HStack bg={'transparent'} spaceX={'20%'}>

                    <ListboxComp onSelectHome={handleSelectHome}/>

                    <Stack bg={'transparent'}>

                        <Stack spaceY={'-3%'} bg={'transparent'}>

                            <Heading color={'black'} bg={'transparent'} className='yourhome'>
                                Your home:
                            </Heading>
                            <Heading color={'black'} fontSize={'80%'} bg={'transparent'} lineHeight={1}>
                                {selectedHome || 'No home selected'}
                            </Heading>

                        </Stack>
                        
                        <Stack bg={'transparent'} spaceY={'-3%'}>
                            <Heading color={'black'} fontSize={'80%'} lineHeight={1}>
                                Change home name:
                            </Heading>
                            <Input color={'black'} width={'80%'} height={'150%'} placeholder='New home name...'/>
                        </Stack>

                        <HStack>
                            <Button borderRadius={'8px'} width={'50%'} height={'auto'} bg={'#ba0707'} textAlign={'center'} color={'white'} className='editButton'>
                                Delete
                            </Button>

                            <Button borderRadius={'8px'} width={'50%'} height={'auto'} bg={'#6cc358'} textAlign={'center'} color={'white'} className='editButton'>
                                Apply
                            </Button>
                        </HStack>
                        
                    </Stack>

                </HStack>
            </Stack>
        </Box>
        

      
    </div>
  )
}

export default EditHomes
