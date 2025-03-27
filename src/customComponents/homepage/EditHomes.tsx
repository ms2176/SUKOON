import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { FormControl } from '@chakra-ui/form-control';
import './AddHome.css';
import { FaCamera } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import ListboxComp from './ListboxComp';
import './EditHomes.css';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface EditHomesProps {
  closeEditHomes: () => void;
  onHomeDeleted: () => void; // Callback to notify parent component of a deleted home
  onHomeRenamed: (renamedHomes: Home[]) => void;
  homes: Home[]; // Add the homes prop

}

const EditHomes: React.FC<EditHomesProps> = ({ closeEditHomes, onHomeDeleted, onHomeRenamed, homes }) => {
  const [selectedHome, setSelectedHome] = useState<string | null>(null); // State for selected home name
  const [newHomeName, setNewHomeName] = useState(""); // State for new home name input
  const [error, setError] = useState(""); // State for error messages
  const modalRef = useRef<HTMLDivElement | null>(null);
// close the modal 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeEditHomes();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeEditHomes]);


  // Handle selecting a home from the Listbox
  const handleSelectHome = (homeName: string) => {
    setSelectedHome(homeName); // Update the selected home name
  };

  // Handle deleting the selected home
  const handleDeleteHome = async () => {
    if (!selectedHome) {
      setError("No home selected.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("User not logged in.");
      return;
    }

    const db = getFirestore();

    try {
      // Find the hub document with the selected home name and user ID
      const hubsRef = collection(db, "userHubs");
      const q = query(hubsRef, where("homeName", "==", selectedHome), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Home not found.");
        return;
      }

      // Get the hub document reference
      const hubDoc = querySnapshot.docs[0];
      const hubRef = hubDoc.ref;

      // Detach the user ID from the hub
      await updateDoc(hubRef, {
        userId: "", // Remove the user ID
      });

      // Clear the selected home and reset the state
      setSelectedHome(null);
      setError("");

      onHomeDeleted(); // This now triggers App's refresh
      closeEditHomes();

      alert("Home deleted successfully.");
    } catch (error) {
      console.error("Error deleting home:", error);
      setError("An error occurred. Please try again.");
    }
  };

  // Handle renaming the selected home
  const handleRenameHome = async () => {
    if (!selectedHome || !newHomeName) {
      setError("Please select a home and enter a new name.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("User not logged in.");
      return;
    }

    const db = getFirestore();

    try {
      // Find the hub document with the selected home name and user ID
      const hubsRef = collection(db, "userHubs");
      const q = query(hubsRef, where("homeName", "==", selectedHome), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Home not found.");
        return;
      }

      // Get the hub document reference
      const hubDoc = querySnapshot.docs[0];
      const hubRef = hubDoc.ref;

      try {
        // Update home name in Firestore
        await updateDoc(hubRef, { homeName: newHomeName });
    
        // Fetch updated homes list
        const updatedHomesQuery = query(
          collection(db, "userHubs"), 
          where("userId", "==", user.uid)
        );
        const updatedSnapshot = await getDocs(updatedHomesQuery);
        const updatedHomes = updatedSnapshot.docs.map(doc => ({
          homeName: doc.data().homeName,
          homeType: doc.data().homeType,
          hubCode: doc.data().hubCode,
        }));
    
        // Pass updated homes to parent
        onHomeRenamed(updatedHomes);
    
        // Reset state and close
        setSelectedHome(null);
        setNewHomeName("");
        setError("");
        closeEditHomes();
        
      } catch (error) {
        // ... error handling ...
      }
    } catch (error) {
      console.error("Error renaming home:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
<Box
  ref={modalRef}
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
  borderRadius={"15px"}
  padding={"3%"}
  boxShadow={"0 4px 10px rgba(0, 0, 0, 0.1)"}
>
  <Stack spacing={6} width={"100%"}>
    <Button
      position={"absolute"}
      top={"2%"}
      right={"2%"}
      width={"auto"}
      height={"auto"}
      onClick={closeEditHomes}
      bg={"transparent"}
    >
      <IoCloseCircleSharp style={{ background: "transparent" }} size={"25px"} color='black'/>
    </Button>

    <Heading textAlign={"center"} color={"black"} fontSize={"xl"} mb={4}>
      Edit Homes
    </Heading>

    <Stack spacing={4} alignItems={"center"} >
      <ListboxComp onSelectHome={handleSelectHome} homes={homes} />
      
      <Stack spacing={2} width={"80%"} textAlign={"left"}>
        <Text fontSize={"sm"} fontWeight={"bold"}>Your home:</Text>
        <Text
          bg={"gray.100"}
          padding={2}
          borderRadius={"10px"}
          fontSize={"sm"}
        >
          {selectedHome || "No home selected"}
        </Text>
      </Stack>

      <Stack spacing={2} width={"80%"}>
        <Text fontSize={"sm"} fontWeight={"bold"}>Change home name:</Text>
        <Input
          placeholder="New home name..."
          value={newHomeName}
          onChange={(e) => setNewHomeName(e.target.value)}
          bg={"gray.100"}
          borderRadius={"10px"}
          boxShadow={"inset 0 0 3px rgba(0, 0, 0, 0.1)"}
          padding={2}
        />
      </Stack>

      <HStack spacing={4} mt={4} width={"80%"} justifyContent={"space-between"}>
        <Button
          width={"45%"}
          bg={"red.500"}
          color={"white"}
          _hover={{ bg: "red.600" }}
          onClick={handleDeleteHome}
        >
          Delete
        </Button>

        <Button
          width={"45%"}
          bg={"#6cc358"}
          color={"white"}
          _hover={{ bg: "green.600" }}
          onClick={handleRenameHome}
        >
          Apply
        </Button>
      </HStack>

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

export default EditHomes;


