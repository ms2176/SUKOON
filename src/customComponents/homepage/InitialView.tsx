import { Box, Button, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import "./Homepage.css";
import { useEffect } from "react";
import "@/customComponents/login/register.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import AddHome from "./AddHome";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Carousel from "./carousel/CarouselComponent";

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

const InitialView: React.FC<{
  onSelectHome: (home: Home) => void;
  selectedHome: Home | null;
  onHomeAdded: (newHomes: Home[]) => void;
}> = ({ onSelectHome, selectedHome, onHomeAdded }) => {
  const username = sessionStorage.getItem("username");
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [showCarousel, setShowCarousel] = useState(true);
  const [homes, setHomes] = useState<Home[]>([]);
  const navigate = useNavigate();

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible);
  };

  const handleHomeAdded = (newHomes: Home[]) => {
    onHomeAdded(newHomes); // Update App's state
    navigate("/home"); // Navigate after state update
  };

  const handleCloseCarousel = () => {
    setShowCarousel(false);
  };

  return (
    <div
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      {showCarousel && (
        <Box
          position="absolute"
          w="100%"
          h="100%"
          zIndex={100000}
          bg={"black"}
          top={"0"}
          left={"0"}
        >
          <Carousel onClose={handleCloseCarousel} />
        </Box>
      )}

      {isAddHomeVisible && (
        <AddHome onHomeAdded={handleHomeAdded} closeAddHome={toggleAddHome} />
      )}

      <Stack
        className="homepageContainer"
        position={"relative"}
        display={"flex"}
        height={"auto"}
      >
        <Box className="homepageHeader">
          <Heading
            bg={"transparent"}
            fontSize={"110%"}
            ml={"5px"}
            mt={"20px"}
            mb={"20px"}
            fontWeight={"extrabold"}
            className="introHomepage"
          >
            Ya Halla,{" "}
            <span style={{ color: "white" }} className="guestIntro">
              {username || "guest"}
            </span>
          </Heading>
        </Box>

        <Stack
          justify={"center"}
          align={"center"}
          height={"100vh"}
          width={"100%"}
          position={"absolute"}
          bg={"transparent"}
        >
          <Heading
            bg={"transparent"}
            textAlign={"center"}
            color={"lightgray"}
            width={"60%"}
          >
            Get started by adding your first home!
          </Heading>

          <Button
            bg={"#6cce58"}
            width={"40%"}
            color={"white"}
            borderRadius={"20px"}
            onClick={toggleAddHome}
          >
            Add Home
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default InitialView;
