import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FcTwoSmartphones } from "react-icons/fc";

const miniDisplays = ({Icon, title, value}) => {
  return (
    <div style={{backgroundColor: 'transparent', width: 120}}>

        <HStack color={'black'} bg={'transparent'}>
            <Icon size={40} />

            <Stack gap={0} bg={'transparent'}>
                <Heading fontSize={'80%'} lineHeight={1} bg={'transparent'}>
                    {title}
                </Heading>

                <Text fontSize={'80%'} bg={'transparent'}>
                    {value}
                </Text>
            </Stack>

        </HStack>
      
    </div>
  )
}

export default miniDisplays
