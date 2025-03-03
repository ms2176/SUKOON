import React, { useState } from 'react';
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { FormControl } from '@chakra-ui/form-control';
import './AddHome.css';
import { FaCamera } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import ListboxComp from './ListboxComp';
import './EditHomes.css';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

interface EditHomesProps {
  closeEditHomes: () => void;
  onHomeDeleted: () => void; // Callback to notify parent component of a deleted home
}

const EditHomes: React.FC<EditHomesProps> = ({ closeEditHomes, onHomeDeleted }) => {
  const [selectedHome, setSelectedHome] = useState<string | null>(null); // State for selected home name
  const [newHomeName, setNewHomeName] = useState(""); // State for new home name input
  const [error, setError] = useState(""); // State for error messages

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

      // Notify the parent component that a home has been deleted
      onHomeDeleted();

      // Close the EditHomes modal
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

      // Update the home name
      await updateDoc(hubRef, {
        homeName: newHomeName, // Set the new home name
      });

      // Clear the selected home and reset the state
      setSelectedHome(null);
      setNewHomeName("");
      setError("");
      alert("Home renamed successfully.");
    } catch (error) {
      console.error("Error renaming home:", error);
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
      >
        <Stack margin={"5% 5% 5% 5%"}>
          <Button
            position={"absolute"}
            top={"5%"}
            right={"5%"}
            width={"auto"}
            height={"auto"}
            onClick={closeEditHomes}
          >
            <IoCloseCircleSharp style={{ background: "transparent" }} size={"20%"} />
          </Button>

          <Heading bg={"transparent"} textAlign={"center"} color={"black"} className="edithomes">
            Edit Homes
          </Heading>

          <HStack bg={"transparent"} spaceX={"20%"}>
            {/* Listbox to select a home */}
            <ListboxComp onSelectHome={handleSelectHome} />

            <Stack bg={"transparent"}>
              {/* Display the selected home */}
              <Stack spaceY={"-3%"} bg={"transparent"}>
                <Heading color={"black"} bg={"transparent"} className="yourhome">
                  Your home:
                </Heading>
                <Heading color={"black"} fontSize={"80%"} bg={"transparent"} lineHeight={1}>
                  {selectedHome || "No home selected"}
                </Heading>
              </Stack>

              {/* Input for renaming the home */}
              <Stack bg={"transparent"} spaceY={"-3%"}>
                <Heading color={"black"} fontSize={"80%"} lineHeight={1}>
                  Change home name:
                </Heading>
                <Input
                  color={"black"}
                  width={"80%"}
                  height={"150%"}
                  placeholder="New home name..."
                  value={newHomeName}
                  onChange={(e) => setNewHomeName(e.target.value)}
                />
              </Stack>

              {/* Delete and Apply buttons */}
              <HStack>
                <Button
                  borderRadius={"8px"}
                  width={"50%"}
                  height={"auto"}
                  bg={"#ba0707"}
                  textAlign={"center"}
                  color={"white"}
                  className="editButton"
                  onClick={handleDeleteHome}
                >
                  Delete
                </Button>

                <Button
                  borderRadius={"8px"}
                  width={"50%"}
                  height={"auto"}
                  bg={"#6cc358"}
                  textAlign={"center"}
                  color={"white"}
                  className="editButton"
                  onClick={handleRenameHome}
                >
                  Apply
                </Button>
              </HStack>

              {/* Error message */}
              {error && (
                <Text color="red.500" textAlign="center" mt={2}>
                  {error}
                </Text>
              )}
            </Stack>
          </HStack>
        </Stack>
      </Box>
    </div>
  );
};

export default EditHomes;