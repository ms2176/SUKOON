import { Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FcTwoSmartphones } from "react-icons/fc";

const miniDisplays = ({Icon, title, value}) => {
  return (
    <div style={{backgroundColor: 'transparent', width: 120}}>

        <HStack color={'black'} bg={'transparent'}>
            <Icon size={40} />

            <HStack gap={2} bg={'transparent'}>
                <Heading fontSize={'80%'} lineHeight={1.5} bg={'transparent'}>
                    {title} {value}
                </Heading>
            </HStack>

        </HStack>
      
    </div>
  )
}

export default miniDisplays
