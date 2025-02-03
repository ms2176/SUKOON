import React from 'react';
import { Box, Flex, Text, VStack, HStack, Icon, Heading, Separator } from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import HeaderBg from '@/images/green.jpg';
import { FiUser, FiStar, FiHelpCircle, FiSettings, FiArrowLeft, FiChevronRight, FiSun, FiMoon, FiHome, FiTool } from 'react-icons/fi';
import {FaUsers } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

const AccountsPage = () => {

  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.100">
    <Box p={0} m={0}>
      <Box 
      as="header" 
      bgImage={`url(${HeaderBg})`}
      bgSize="cover"
     // bgPosition="center"
      p={4}
      textAlign="center"
      position="relative"
      height="50vh">
      
      
        <HStack justify="space-between">
          <Icon boxSize={6} >
                <FiArrowLeft />
            </Icon>
          <Heading size="lg" flex="1">
            Accounts
          </Heading>
          <Icon boxSize={6} >
                <FiSettings />
            </Icon>          
        </HStack>

        {/* Profile Section */}
      <Flex align="center" direction="column" mt={6}>
        <Avatar
          p={9}
          size="2xl"
          src="https://via.placeholder.com/150" // Replace with your image URL
          name="Profile"

        />
        <Text fontSize="lg" fontWeight="bold" mt={2}>
          Kaywan
        </Text>
        <Text fontSize="sm" color="white.400">
          kk2024@kaywan.co.uk
        </Text>
      </Flex>

      </Box>





      {/* Options */}
    <Box 
          pt="1"
          pb="5"
          bg="white"
          borderTopRadius="4xl"
          boxShadow="md"
          width="100%"
          mx="auto"
          mt={-60}
          zIndex={1}
          position="relative"
        >
    <Box 
        bg="white.500" 
        p={0} 
        shadow="md"
        borderRadius="3xl"
        width="90%"
        mx="auto">

      <VStack gap={2} mt={6} p={4}>
        {/* Account Information */}
        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
          onClick={() => navigate('/accinfo')}
          cursor="pointer"
        >
            
        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiUser />
        </Icon>
        
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Account Information
            </Text>
            <Text fontSize="sm" color="gray.400">
                Manage your account settings
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>
        </HStack>

        <Separator size="sm" />

        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
        >
            

        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiSun />
        </Icon>
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Dark Mode
            </Text>
            <Text fontSize="sm" color="gray.400">
                Choose the Dark Side
            </Text>
            </VStack>

        </HStack>
        <Switch size="lg" color="green" />
        </HStack>
      </VStack> 
    </Box>



    <Box 
        bg="white.500" 
        p={0} 
        shadow="md"
        borderRadius="3xl"
        width="90%"
        mx="auto">

      <VStack gap={2} mt={6} p={4}>
        {/* Home Managment */}
        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
        >
            
        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiHome />
        </Icon>
        
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Home Management
            </Text>
            <Text fontSize="sm" color="gray.400">
                View, create or join home
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>
        </HStack>

        <Separator size="sm" />

        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
        >
            

        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FaUsers />
        </Icon>
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Third Party services
            </Text>
            <Text fontSize="sm" color="gray.400">
                Alexa, google assistant, smart things...
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>        
        </HStack>

        <Separator size="sm" />

        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
        >
            

        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiTool />
        </Icon>
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                More Tools
            </Text>
            <Text fontSize="sm" color="gray.400">
                Watch, Virtual Experience...
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>        
        </HStack>
      </VStack> 
    </Box>


    <Box 
        bg="white.500" 
        p={0} 
        shadow="md"
        borderRadius="3xl"
        width="90%"
        mx="auto">

      <VStack gap={2} mt={6} p={4}>
        {/* Account Information */}
        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
        >
            
        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiHelpCircle />
        </Icon>
        
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Support Center
            </Text>
            <Text fontSize="sm" color="gray.400">
                Need help?
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>
        </HStack>

        <Separator size="sm" />

        <HStack
         // bg="gray.800"
          p={4}
          borderRadius="md"
          justify="space-between"
          align="center"
          width="100%"
          onClick={() => navigate('/rating')}
          cursor="pointer"
        >
            

        <HStack align="center" gap={5}>
        <Icon boxSize={6} color="green.600">
            <FiStar />
        </Icon>
        <VStack gap={0} align="flex-start">
            <Text fontSize="md" color="black" fontWeight="bold">
                Rate Us
            </Text>
            <Text fontSize="sm" color="gray.400">
                You better give us 5 Stars!
            </Text>
            </VStack>

        </HStack>
        <Icon boxSize={6} color="green.600">
            <FiChevronRight />
        </Icon>        
        </HStack>
      </VStack> 
    </Box>
    </Box>
    </Box>
    </Box>

  );
};

export default AccountsPage;