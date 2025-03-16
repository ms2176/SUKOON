import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { FormControl } from '@chakra-ui/form-control';
import './AddHome.css';
import { FaCamera } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore"; // Import Firestore functions

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}


interface AddHomeProps {
  closeAddHome: () => void;
  onHomeAdded: () => void; // Callback to notify parent component of a new home
}

const AddHome: React.FC<{
  closeAddHome: () => void;
  onHomeAdded: (newHomes: Home[]) => void; // Correct prop type
}> = ({ closeAddHome, onHomeAdded }) => {
  const [homeName, setHomeName] = useState(""); // State for home name
  const [hubCode, setHubCode] = useState(""); // State for hub link code
  const [error, setError] = useState(""); // State for error messages
  const modalRef = useRef<HTMLDivElement | null>(null); // Reference for modal container

  // Function to handle clicks outside the modal
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeAddHome(); // Close the modal if the click is outside
    }
  };

  // Add event listener for clicks outside modal when component mounts
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Function to link the hub to the user's account
  const linkHubToUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      setError("User not logged in.");
      return;
    }
  
    if (!homeName || !hubCode) {
      setError("Home name and hub code are required.");
      return;
    }
  
    const db = getFirestore();
  
    try {
      // Check if the hub code exists in the hubs collection
      const hubsRef = collection(db, "userHubs");
      const q = query(hubsRef, where("hubCode", "==", hubCode));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setError("Invalid hub code.");
        return;
      }
  
      // Get the hub document reference and data
      const hubDoc = querySnapshot.docs[0];
      const hubData = hubDoc.data();
  
      // Check if the hub already has a userId (already linked to another user)
      if (hubData.userId) {
        setError("This hub is already linked to another account.");
        return;
      }
  
      // Check if the user already has a home with the same name
      const userHubsRef = collection(db, "userHubs");
      const userHubsQuery = query(
        userHubsRef,
        where("userId", "==", user.uid),
        where("homeName", "==", homeName)
      );
      const userHubsSnapshot = await getDocs(userHubsQuery);
  
      if (!userHubsSnapshot.empty) {
        setError("You already have a home with this name.");
        return;
      }
  
      // Update the hub's userId and homeName fields
      await updateDoc(hubDoc.ref, {
        userId: user.uid,
        homeName: homeName,
      });
  
      // Fetch the updated list of homes
      const updatedHomesQuery = query(userHubsRef, where("userId", "==", user.uid));
      const updatedHomesSnapshot = await getDocs(updatedHomesQuery);
      const updatedHomes = updatedHomesSnapshot.docs.map((doc) => ({
        homeName: doc.data().homeName,
        homeType: doc.data().homeType,
        hubCode: doc.data().hubCode,
      }));
  
      onHomeAdded(updatedHomes); // Update parent state
      closeAddHome();
    } catch (error) {
      console.error("Error linking hub:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Box
        className="addContainer"
        width={"80%"}
        position={"absolute"}
        bg={"white"}
        height={"auto"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        alignContent={"center"}
        transform={"translate(-50%, -50%)"}
        top={"50%"}
        left={"50%"}
        zIndex={100}
        ref={modalRef} // Attach the ref to the modal container
      >
        <Stack margin={"5% 5% 5% 5%"} width={"100%"}>
          <Button
            position={"absolute"}
            top={"5%"}
            right={"5%"}
            width={"auto"}
            height={"auto"}
            onClick={closeAddHome}
          >
            <IoCloseCircleSharp style={{ background: "transparent" }} size={"20%"} />
          </Button>

          <Heading bg={"transparent"} textAlign={"center"} color={"black"}>
            Add Home
          </Heading>

          <Stack width={"100%"} bg={"transparent"} height={"auto"} mt={"8%"}>
            <Stack>
              <Heading bg={"transparent"} fontSize={"80%"} color={"black"} whiteSpace={"nowrap"}>
                Home Name:
              </Heading>

              <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
                <FormControl width={"100%"}>
                  <Box className="OuterInputBox">
                    <Input
                      placeholder="..."
                      className="InputData"
                      color={"black"}
                      value={homeName}
                      onChange={(e) => setHomeName(e.target.value)}
                    />
                  </Box>
                </FormControl>
              </Box>
            </Stack>

            <Stack>
              <Heading bg={"transparent"} fontSize={"80%"} color={"black"} whiteSpace={"nowrap"}>
                Hub Link Code:
              </Heading>

              <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
                <FormControl width={"100%"}>
                  <Box className="OuterInputBox">
                    <Input
                      placeholder="..."
                      className="InputData"
                      color={"black"}
                      value={hubCode}
                      onChange={(e) => setHubCode(e.target.value)}
                    />
                  </Box>
                </FormControl>
              </Box>
            </Stack>

            {/* Centered "Add +" Button */}
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mt={4}
            >
              <Button
                className={"addContainer"}
                borderRadius={"20px"}
                bg={"#6cc358"}
                width={"80%"}
                color={"white"}
                onClick={linkHubToUser}
              >
                Add +
              </Button>
            </Box>

            {/* Error Message */}
            {error && (
              <Text color="red.500" textAlign="center" mt={2}>
                {error}
              </Text>
            )}
          </Stack>
        </Stack>
      </Box>
    </div>
  );
};

export default AddHome;