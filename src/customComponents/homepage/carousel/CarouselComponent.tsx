import { background } from "@chakra-ui/system";
import { Carousel } from "flowbite-react";
import Logo from '@/images/logo.png';
import Intro from '@/images/tutorial/1.png'
import { Box, Button, Heading, HStack, Stack } from "@chakra-ui/react";
import AdminHub from './images/adminhub.png'
import TenantHub from './images/tenanthub.png'
import Pin from './images/pin.png'
import Gendata from './images/gendata.png'
import Rooms from './images/room.png'
import AC from './images/ac.png'
import Beati from './images/beati.png'
import GH from './images/greenhouse.png'
import Stats from './images/stats.png'
import ACC from './images/ACC.png'
import CB from './images/CB.png'
import { IoCloseCircleSharp } from "react-icons/io5";

const CarouselComponent = () => {
  return (
    <div className="relative w-full h-66 sm:h-64 xl:h-80 2xl:h-96 overflow-hidden">

      <Button
        position={"absolute"}
        top={"5%"}
        right={"5%"}
        width={"auto"}
        height={"auto"}
        zIndex={99999}
        bg={'transparent'}
      >
        <IoCloseCircleSharp style={{ background: "transparent" }} size={"20%"} color='white'/>
      </Button>
      <Carousel
        slide={false}
        indicators={false}
        leftControl={
          <div style={{background: 'transparent'}} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 transition-all duration-200 ml-2 z-10">
            <svg style={{background: 'transparent'}} className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path style={{background: 'transparent'}} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        }
        rightControl={
          <div style={{background: 'transparent'}} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 transition-all duration-200 mr-2 z-10">
            <svg style={{background: 'transparent'}} className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path style={{background: 'transparent'}} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        }
        className="h-full [&_.group]:!relative [&_.group]:!inset-0 [&_.group]:!translate-y-0"
      >
        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={5} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'250%'}>
                SUKOON
              </Heading>
              <Heading color={'white'} bg={'transparent'} textAlign={'center'} fontSize={'80%'} lineHeight={1}>
                Hello! Thank you for downloading Sukoon! This is your guide to get started on connecting your hub and managing your home!

              </Heading>
            </Stack>
            
          </Box>
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={-1} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Hubs
              </Heading>
              <Heading color={'white'} bg={'transparent'} textAlign={'center'} fontSize={'80%'} lineHeight={1}>
                Your hub can either be a tenant hub, or an admin hub.
              </Heading>

              <HStack bg={'transparent'}>
                <Stack bg={'transparent'} spaceY={-5}>
                  <img src={TenantHub} style={{background: 'transparent'}}/>
                  <Heading color={'white'} bg={'transparent'} fontSize={'50%'} textAlign={'center'}>
                    Tenant Hub
                  </Heading>
                </Stack>

                <Stack bg={'transparent'} spaceY={-5}>
                  <img src={AdminHub} style={{background: 'transparent'}}/>
                  <Heading bg={'transparent'} color={'white'} fontSize={'50%'} textAlign={'center'}>
                    Admin Hub
                  </Heading>
                </Stack>
              </HStack>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
                Look at the back of the hub to find the hub's linking code, and click on the add home button or the + button next to your list of homes to connect the hub to your account. Just give it a name, write down its code, and you're ready to go.

              </Heading>
            </Stack>

            
            
          </Box>
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Home
              </Heading>
          
              <HStack bg={'transparent'}>
                
                <img src={Gendata} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
                <img src={Pin} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
              </HStack>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
                The homepage is where you find yourself every time you log into your app after connecting a hub to your account. This is where basic information is displayed such as the amount of devices connected, and your total consumption. You can even pin devices for quick access!
              </Heading>
            </Stack>

            
            
          </Box>
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Rooms
              </Heading>
          
              <HStack bg={'transparent'}>
                
                <img src={Rooms} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
                <img src={AC} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
              </HStack>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
              The Rooms page is where you can organize and manage all of your devices. Create new custom rooms by clicking on the + button! Add new devices to your hub by linking them through their linking codes in the All Devices module! Enter your rooms and assign different devices to different rooms!
              </Heading>
            </Stack>

            
            
          </Box>
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Be'ati
              </Heading>
          
              <HStack bg={'transparent'}>
                
                <img src={Beati} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
                <img src={GH} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>
              </HStack>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
                Be'ati is our way of turning energy conservation into a game. Here is where you can set your own personal goals to try and save more energy everyday and make the world a cleaner place. We encourage you to save more energy by giving you a range of plants in your garden to unlock! The more energy you save, the more plants you unlock!
              </Heading>
            </Stack>

            
            
          </Box>        
        </div>

        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Stats
              </Heading>
          
                
                <img src={Stats} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
              The statistics page is where you can view your energy consumption statistics. Here, you can see how much energy is being consumed for this hub, how much each room is consuming, and the energy statistics of each device per room. Download a report and share with friends!
              </Heading>
            </Stack>

            
            
          </Box>        
        </div>

        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Account
              </Heading>
          
                
                <img src={ACC} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
              The account page is where you can customize your account, submit enquiries, log out, delete your account, and view this tutorial again in case you need assistance.
              </Heading>
            </Stack>

            
            
          </Box>        
        </div>

        <div className="relative h-full" style={{background: 'transparent'}}>
          <Box width={'100%'} height={'100%'} bg={'black'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
            <Stack spaceY={0} bg={'transparent'} display={'flex'} justifyContent={'center'} alignContent={'center'} alignItems={'center'} width={'80%'}>
              <Heading className={'bold'} color={'white'} bg={'transparent'} fontSize={'200%'}>
                Chatbot
              </Heading>
          
                
                <img src={CB} width={'50%'} style={{background: 'transparent', borderRadius: '20px'}}/>

              <Heading bg={'transparent'} color={'white'} textAlign={'center'} fontSize={'50%'} lineHeight={1}>
              We provide instant assistance at the touch of a button on our homepage. Simply click the chatbot to receive expert advice on energy-saving techniques and quick insights into your energy statistics!              </Heading>
            </Stack>

            
            
          </Box>        
        </div>


      </Carousel>
    </div>
  );
};

export default CarouselComponent;
