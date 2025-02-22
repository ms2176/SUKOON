import React from 'react'
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { FormControl } from '@chakra-ui/form-control'
import './AddHome.css'
import { FaCamera } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

interface AddHomeProps {
    closeAddHome: () => void;
}

const AddHome: React.FC<AddHomeProps> = ({ closeAddHome }) => {
  return (
    <div>

        <Box className='addContainer' width={'80%'} position={'absolute'} bg={'white'} height={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} transform={'translate(-50%, -50%)'} top={'50%'} left={'50%'} zIndex={100}>
            <Stack margin={'5% 5% 5% 5%'} width={'100%'}>

                <Button position={'absolute'} top={'5%'} right={'5%'} width={'auto'} height={'auto'} onClick={closeAddHome}>
                    <IoCloseCircleSharp style={{background: 'transparent'}} size={'20%'}/>
                </Button>

                <Heading bg={'transparent'} textAlign={'center'} color={'black'}>
                    Add Home
                </Heading>

                <Stack width={'100%'} bg={'transparent'} height={'auto'} mt={'8%'}>

                    <Stack>
                            <Heading bg={'transparent'} fontSize={'80%'} color={'black'} whiteSpace={'nowrap'}>
                                Home Name:
                            </Heading>

                            <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
                                <FormControl width={"100%"} >
                                    <Box className="OuterInputBox">
                                    <Input
                                        placeholder="..."
                                        className="InputData"
                                        color={'black'}
                                    />
                                    </Box>
                                </FormControl>
                            </Box>
                        </Stack>

                        <Stack>
                            <Heading bg={'transparent'} fontSize={'80%'} color={'black'} whiteSpace={'nowrap'}>
                                Hub Link Code:
                            </Heading>

                            <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
                                <FormControl width={"100%"}>
                                    <Box className="OuterInputBox">
                                    <Input
                                        placeholder="..."
                                        className="InputData"
                                        color={'black'}
                                    />
                                    </Box>
                                </FormControl>
                            </Box>
                        </Stack>

                        <HStack bg={'transparent'} justify={'center'} align={'center'}>
                            <Box bg={'black'} height={'1px'} width={'100%'} />
                                <Heading bg={'transparent'} color={'black'} fontSize={'50%'}>
                                    OR
                                </Heading>
                            <Box bg={'black'} height={'1px'} width={'100%'} />
                        </HStack>

                        <Heading bg={'transparent'} color={'black'} fontSize={'80%'} textAlign={'center'}>
                            Scan your hub's QR code.
                        </Heading>
                        
                        <Box width={'100%'} bg={'transparent'} justifyContent={'center'} alignContent={'center'} display={'flex'} alignItems={'center'}>
                            <Button className={'addContainer'} borderRadius={'20px'} bg={'#6cc358'} width={'40%'} color={'white'}>
                                Scan
                                <FaCamera style={{background: 'transparent'}}/>
                            </Button>
                        </Box>
                        


                </Stack>
            </Stack>
        </Box>
        

      
    </div>
  )
}

export default AddHome
