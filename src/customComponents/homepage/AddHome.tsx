import React from 'react'
import { Box, Heading, HStack, Input, Stack } from "@chakra-ui/react"

const AddHome = () => {
  return (
    <div>

        <Box width={'80%'} position={'absolute'} bg={'red'} height={'auto'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} transform={'translate(-50%, -50%)'} top={'50%'} left={'50%'} zIndex={100}>
            <Stack>
                <Heading bg={'transparent'} textAlign={'center'} color={'black'}>
                    Add Home
                </Heading>

                <Stack width={'100%'} bg={'transparent'} height={'auto'}>

                    <HStack>
                        <Heading bg={'transparent'}>
                            Home Name:
                        </Heading>

                        <Input placeholder='...'/>
                    </HStack>


                </Stack>
            </Stack>
        </Box>
        

      
    </div>
  )
}

export default AddHome
