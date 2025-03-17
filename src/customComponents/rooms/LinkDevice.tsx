import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { FormControl } from '@chakra-ui/form-control';
import { IoCloseCircleSharp } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

interface LinkDeviceProps {
  closeLinkDevice: () => void;
  onDeviceLinked: () => void;
  currentHubCode: string;
}

const LinkDevice: React.FC<LinkDeviceProps> = ({ closeLinkDevice, onDeviceLinked, currentHubCode }) => {
  const [deviceLinkCode, setDeviceLinkCode] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeLinkDevice();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const linkDeviceToHub = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("User not logged in.");
      return;
    }

    if (!deviceLinkCode) {
      setError("Device link code is required.");
      return;
    }

    const db = getFirestore();

    try {
      // Check if device exists
      const devicesRef = collection(db, "devices");
      const q = query(devicesRef, where("deviceId", "==", deviceLinkCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid device link code.");
        return;
      }

      // Get the device document
      const deviceDoc = querySnapshot.docs[0];
      const deviceData = deviceDoc.data();

      // Check if the device already has a hubCode
      if (deviceData.hubCode) {
        setError("This device is already linked to another hub.");
        return;
      }

      // Update device's hubCode
      await updateDoc(deviceDoc.ref, {
        hubCode: currentHubCode,
      });

      onDeviceLinked(); // Trigger refresh in AllDevices
      closeLinkDevice();
    } catch (error) {
      console.error("Error linking device:", error);
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
        ref={modalRef}
      >
        <Stack margin={"5% 5% 5% 5%"} width={"100%"}>
          <Button
            position={"absolute"}
            top={"5%"}
            right={"5%"}
            width={"auto"}
            height={"auto"}
            onClick={closeLinkDevice}
          >
            <IoCloseCircleSharp style={{ background: "transparent" }} size={"20%"} />
          </Button>

          <Heading bg={"transparent"} textAlign={"center"} color={"black"}>
            Link Device
          </Heading>

          <Text bg={"transparent"} textAlign={"center"} color={"gray.600"} fontSize={"sm"} mt={2}>
            Enter the device link code found on the device or its packaging.
          </Text>

          <Stack width={"100%"} bg={"transparent"} height={"auto"} mt={"8%"}>
            <Stack>
              <Heading bg={"transparent"} fontSize={"80%"} color={"black"} whiteSpace={"nowrap"}>
                Device Link Code:
              </Heading>

              <Box width="100%" display="flex" flexDirection="column" p={0} m={0}>
                <FormControl width={"100%"}>
                  <Box className="OuterInputBox">
                    <Input
                      placeholder="..."
                      className="InputData"
                      color={"black"}
                      value={deviceLinkCode}
                      onChange={(e) => setDeviceLinkCode(e.target.value)}
                    />
                  </Box>
                </FormControl>
              </Box>
            </Stack>

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
                onClick={linkDeviceToHub}
              >
                Add +
              </Button>
            </Box>

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

export default LinkDevice;