import React from 'react'
import { Box, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { FormControl } from '@chakra-ui/form-control'
import './AddHome.css'

const AddHome = () => {
  return (
    <div>

        <Box className='addContainer' width={'80%'} position={'absolute'} bg={'white'} height={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} transform={'translate(-50%, -50%)'} top={'50%'} left={'50%'} zIndex={100}>
            <Stack margin={'10px 10px 10px 10px'}>
                <Heading bg={'transparent'} textAlign={'center'} color={'black'}>
                    Add Home
                </Heading>

                <Stack width={'100%'} bg={'transparent'} height={'auto'}>

                <HStack>
                        <Heading bg={'transparent'} fontSize={'90%'} color={'black'} whiteSpace={'nowrap'}>
                            Home Name:
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
                    </HStack>

                    <HStack>
                        <Heading bg={'transparent'} fontSize={'90%'} color={'black'} whiteSpace={'nowrap'}>
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
                    </HStack>


                </Stack>
            </Stack>
        </Box>
        

      
    </div>
  )
}

export default AddHome
