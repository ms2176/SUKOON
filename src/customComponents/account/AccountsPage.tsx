import React from 'react';
import { Box, Flex, Text, VStack, HStack, Icon, Heading, Separator, Stack } from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import HeaderBg from '@/images/green.jpg';
import { FiUser, FiStar, FiHelpCircle, FiSettings, FiArrowLeft, FiChevronRight, FiSun, FiMoon, FiHome, FiTool, FiCircle } from 'react-icons/fi';
import {FaUsers } from 'react-icons/fa';
import './Accountspage.css'

import { useNavigate } from 'react-router-dom';

const AccountsPage = () => {

  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.100" overflowY={'auto'} height={'120vh'}>
      <Box p={0} m={0}>
        <Box 
        as="header" 
        bgImage={`url(${HeaderBg})`}
        bgSize="cover"
        p={4}
        textAlign="center"
        height="30vh">
      
      
          <HStack justify="space-between" bg={'transparent'}>
            <Icon boxSize={6} bg={'transparent'} >
                  <FiArrowLeft />
              </Icon>
            <Heading size="lg" flex="1"  bg={'transparent'}>
              Accounts
            </Heading>
            <Icon boxSize={6}  bg={'transparent'}>
                  <FiSettings />
              </Icon>          
          </HStack>

          {/* Profile Section */}
          <Flex align="center" direction="column" mt={6}  bg={'transparent'}>
            <Avatar
              p={9}
              size="2xl"
              src="https://via.placeholder.com/150" // Replace with your image URL
              name="Profile"
              bg={'transparent'}
            />
            <Text fontSize="lg" fontWeight="bold" mt={2} bg={'transparent'}>
              Kaywan
            </Text>
            <Text fontSize="sm" color="white.400" bg={'transparent'}>
              kk2024@kaywan.co.uk
            </Text>
          </Flex>

        </Box>





        {/* Options */}
        <Box className='optionsContainer'>
          <Stack width={'85%'} height={'auto'} spaceY={'10%'} display={'flex'} justify={'center'} alignItems={'center'} alignContent={'center'} mt={'5%'}>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/AccInfo')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiUser style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Account Info
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Manage your account settings...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiUser style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Dark Mode
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Choose the dark side...
                  </Heading>
                </Stack>

                <Switch size={'lg'} colorScheme="green" onChange={() => console.log('Dark Mode')} />

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/HomeManagement')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiHome style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Home Management
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    View, Create, or join home...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/services')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FaUsers style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Third Party Services
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Alexa, Google, Smart things...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/tools')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiTool style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    More Tools
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Watch, Virtual experience...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/support')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiHelpCircle style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Support Center
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Need help?
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>

            <Box height={'1px'} width={'95%'} bg={'#bdbebf'}/>

            <Box width={'100%'} height={'auto'} bg={'white'} onClick={() => navigate('/Rate')}>
              <HStack bg={'transparent'} spaceX={'10%'}>
                <FiStar style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

                <Stack bg={'transparent'} width={'100%'}>
                  <Heading bg={'transparent'} color={'#09090b'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    Rate Us
                  </Heading>
                  <Heading bg={'transparent'} color={'#a1a1aa'} width={'100%'} fontSize={'sm'} lineHeight={'100%'}>
                    You better give us 5 stars...
                  </Heading>
                </Stack>

                <FiChevronRight style={{background: 'transparent'}} size={'20%'} color='#16a34a'/>

              </HStack>
            </Box>
            
          </Stack>

        </Box>
    
      </Box>
    </Box>

  );
};

export default AccountsPage;
