import { Box, Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { GiCircleForest } from "react-icons/gi";
import { SlGraph } from "react-icons/sl";
import { MdAccountCircle } from "react-icons/md";
import { BsDoorClosed } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaRegBuilding } from "react-icons/fa";

const NavbarAdmin = () => {

    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/Home')
    }

    const goToRooms = () => {
        navigate('/Rooms')
    }

    const goToStats = () => {
        navigate('/Stats')
    }

    const goToAccount = () => {
        navigate('/accountspage')
    }

  return (
    <Box
      position="fixed"  // Keeps it fixed on the screen
      bottom="-4"        // Moves it to the bottom
      width="100%"
      bg="white"     // Temporary color for visibility
      color="white"
      p="4"
      className="navContainer"
      zIndex={1000}
      
    >
        <HStack bg={'transparent'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'} spaceX={'10%'} mb={2}>
            <Button className="navButton" onClick={goToHome}>
                <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <FaHome size={'70%'} style={{background: 'transparent'}} color="#21334a"/>
                    <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
                        Home
                    </Heading>
                
                </Stack>
            </Button>
            
            <Button className="navButton" onClick={goToRooms}>
                <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <FaRegBuilding size={'70%'} style={{background: 'transparent'}} color="#21334a"/>
                    <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
                        Units
                    </Heading>

                </Stack>
            </Button>

            <Button className="navButton" onClick={goToStats}>
                <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <SlGraph size={'70%'} style={{background: 'transparent'}} color="#21334a"/>
                    <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
                        Stats
                    </Heading>
                </Stack>
            </Button>

            <Button className="navButton" onClick={goToAccount}>
                <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <MdAccountCircle size={'70%'} style={{background: 'transparent'}} color="#21334a"/>
                    <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
                        Account
                    </Heading>

                </Stack>
            </Button>
            
            
        </HStack>
    </Box>
  );
};

export default NavbarAdmin;
