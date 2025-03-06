import React from 'react'
import { Box, Text, Button, VStack, HStack, Image, Center, Heading, Stack } from '@chakra-ui/react';

const AddDevice = () => {
  return (
    <div style={{display: 'none'}}>
        <Box width={'80%'} zIndex={1000} height={'auto'} bg={'blue'} display={'flex'} position={'absolute'} alignContent={'center'} justifyContent={'center'} alignItems={'center'} transform={'translate(-50%, -50%)'} top={'50%'} left={'50%'}>
            <Stack bg={'transparent'} width={'100%'} padding={'5%'}>
                <Heading color={'#6cc358'} textAlign={'center'}>
                    Room name
                </Heading>
                <HStack bg={'transparent'}>
                    <Button width={'50%'}>
                        Add +
                    </Button>
                    <Button width={'50%'}>
                        Delete -
                    </Button>
                </HStack>
            </Stack>
            



        </Box>
      
    </div>
  )
}

export default AddDevice
