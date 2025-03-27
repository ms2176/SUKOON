import { Box, Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { SlGraph } from "react-icons/sl";
import { MdAccountCircle } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import { FiHome, FiBarChart2, FiUser, FiLayout } from "react-icons/fi";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const [hasHubs, setHasHubs] = useState(false); // State to track if the user has hubs
  const [loading, setLoading] = useState(true); // State to track loading status

  // Function to check if the user has any hubs
  const checkUserHubs = async (userId: string) => {
    const db = getFirestore();
    const userHubsRef = collection(db, "userHubs");
    const q = query(userHubsRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Return true if hubs exist, false otherwise
    } catch (error) {
      console.error("Error checking user hubs:", error);
      return false;
    }
  };

  // Fetch hubs when the component mounts
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const hasHubs = await checkUserHubs(userId);
        setHasHubs(hasHubs); // Update the state
      } else {
        setHasHubs(false); // No user is signed in
      }
      setLoading(false); // Set loading to false
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Navigation functions
  const goToHome = () => {
    if (hasHubs) {
      navigate('/Home'); // Navigate to Home if hubs exist
    } else {
      navigate('/initial'); // Navigate to Initial if no hubs exist
    }
  };

  const goToUnits = () => {
    if (hasHubs) {
      navigate("/unitsList");
    }
  };

  const goToStats = () => {
    if (hasHubs) {
      navigate('/Stats');
    }
  };

  const goToAccount = () => {
    navigate('/accountspage');
  };

  return (
    <Box position="fixed" bottom="-4" width="100%" bg="white" color="white" p="4" className="navContainer" zIndex={1000}>
      <HStack
        bg={'transparent'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        alignContent={'center'}
        spaceX={'10%'}
        mb={2}
      >
        {/* Home Button */}
        <Button className="navButton" onClick={goToHome}>
          <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <FiHome size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
            <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
              Home
            </Heading>
          </Stack>
        </Button>

        {/* Units Button */}
        <Button
          className="navButton"
          onClick={goToUnits}
          isDisabled={!hasHubs || loading} // Disable if no hubs or still loading
          opacity={!hasHubs || loading ? 0.5 : 1} // Gray out if no hubs
        >
          <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <FaRegBuilding size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
            <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
              Units
            </Heading>
          </Stack>
        </Button>

        {/* Stats Button */}
        <Button
          className="navButton"
          onClick={goToStats}
          isDisabled={!hasHubs || loading} // Disable if no hubs or still loading
          opacity={!hasHubs || loading ? 0.5 : 1} // Gray out if no hubs
        >
          <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <FiBarChart2 size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
            <Heading color="#21334a" fontSize={'90%'} bg={'transparent'} textAlign={'center'}>
              Stats
            </Heading>
          </Stack>
        </Button>

        {/* Account Button */}
        <Button className="navButton" onClick={goToAccount}>
          <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <MdAccountCircle size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
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