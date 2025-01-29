import React from 'react';
import {
  Box,
  Button,
  Card, 
  Stack, 
  Input,
  defineStyle,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';

import { Avatar } from "@/components/ui/avatar"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"

import { FiSettings, FiArrowLeft} from 'react-icons/fi';

import { EditIcon, ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';

const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  })

const AccInfo = () => {
  return (
    <Box minH="100vh" bg="gray">
    <Box p={0} m={0}>
      <Box 
      as="header" 
      bgColor="white"
      p={4}
      textAlign="center"
      position="relative"
      height="100vh">
      
      
        <HStack justify="space-evenly">
          <Icon boxSize={6} color={'black'}>
                <FiArrowLeft />
            </Icon>
          <Heading size="lg" flex="1" color={'black'}>
            Profile Edit
          </Heading>
          <Icon boxSize={6} >
                <FiSettings />
            </Icon>        
        </HStack>

        {/* Profile Section */}
      <Flex align="center" direction="column" mt={6} pt={9}>
        <Avatar
          p={12}
          size="2xl"
          src="https://via.placeholder.com/150" // Replace with your image URL
          name="Profile"
          colorPalette="green"
          css={ringCss}
        />
        <Text fontSize="lg" fontWeight="bold" mt={2} color={'black'}>
          Kaywan
        </Text>
        <Text fontSize="sm" color={'black'}>
          kk2024@kaywan.co.uk
        </Text>
      </Flex>


      <VStack spacing={4} align="stretch" mt={6}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter your name" />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter your email" />
          </FormControl>
          <Button colorScheme="teal" size="lg" mt={4}>Save Changes</Button>
        </VStack>


      </Box>
      </Box>
      
      
    </Box>
  );
};

export default AccInfo;
