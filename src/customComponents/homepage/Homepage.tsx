import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Image,
  Text,
  Grid,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import "./Homepage.css";
import Dropdown from "./Dropdown.tsx";
import MiniDisplays from "./miniDisplays.tsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Lottie from "react-lottie-player";
import PulseAnimationGreen from "@/images/animatedIcons/Animation - 1737092091343.json";
import PulseAnimationBlue from "@/images/animatedIcons/Animation - 1738960096286.json";
import { TbCirclePlusFilled } from "react-icons/tb";
import PinnedMenu from "./pinnedMenu.tsx";
import { FaExpandAlt } from "react-icons/fa";
import { AiOutlineShrink } from "react-icons/ai";
import AddHome from "./AddHome.tsx";
import EditHomes from "./EditHomes.tsx";
import PinnedMenuAdmin from "./pinnedMenuAdmin.tsx";
import { MdOutlineEdit } from "react-icons/md";
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
import { FaRegBuilding } from "react-icons/fa";
import NoImage from "@/images/noImage.png";
// Import device images
import LightImg from "@/images/devicesIcons/lamp.png";
import TvImg from "@/images/devicesIcons/tv.png";
import AcImg from "@/images/devicesIcons/ac.png";
import FanImg from "@/images/devicesIcons/fan.png";
import WasherImg from "@/images/devicesIcons/washing-machine.png";
import SpeakerImg from "@/images/devicesIcons/speaker.png";
import ThermostatImg from "@/images/devicesIcons/thermostat.png";
import DoorbellImg from "@/images/devicesIcons/smart-door.png";
import HeatconvectorImg from "@/images/devicesIcons/heater-convector.png";
import Dishwasher from "@/images/devicesIcons/dishwasher.png";
import { auth } from "@/config/firebase_conf.ts";
import {
  FiMonitor,
  FiHome,
  FiCheck,
  FiAlertCircle,
  FiZap,
} from "react-icons/fi";

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

// Define the Room type
interface Room {
  type: "room";
  id: string;
  roomName: string;
  hubCode: string;
  pinned: boolean;
  devices: string[];
  image?: string; // Optional field for room image
}

// Define the Device type
interface Device {
  type: "device";
  id: string;
  deviceName: string;
  deviceType: string;
  hubCode: string;
  pinned: boolean;
}

// Define the Unit type
interface Unit {
  type: "unit";
  id: string;
  unitName: string;
  hubCode: string;
  pinned: boolean;
  image?: string;
}

// Define the PinnedItem type as a union of Room, Device, and Unit
type PinnedItem = Room | Device | Unit;

// Define device types and their corresponding images
type DeviceType =
  | "light"
  | "tv"
  | "ac"
  | "fan"
  | "washingMachine"
  | "speaker"
  | "thermostat"
  | "door"
  | "heatconvector"
  | "dishwasher";

const deviceTypeToImage: Record<DeviceType, string> = {
  light: LightImg,
  tv: TvImg,
  ac: AcImg,
  fan: FanImg,
  washingMachine: WasherImg,
  speaker: SpeakerImg,
  thermostat: ThermostatImg,
  door: DoorbellImg,
  heatconvector: HeatconvectorImg,
  dishwasher: Dishwasher,
};

const normalizeDeviceType = (deviceType: string): DeviceType => {
  const normalizedType = deviceType.toLowerCase().replace(/\s+/g, ""); // Remove spaces and convert to lowercase
  switch (normalizedType) {
    case "light":
      return "light";
    case "tv":
      return "tv";
    case "ac":
      return "ac";
    case "fan":
      return "fan";
    case "washingmachine":
      return "washingMachine";
    case "speaker":
      return "speaker";
    case "thermostat":
      return "thermostat";
    case "door":
      return "door";
    case "heatconvector":
      return "heatconvector";
    case "dishwasher":
      return "dishwasher";
    default:
      return "light"; // Default to 'light' if the type is unknown
  }
};

const Homepage: React.FC<{
  selectedHomePass: Home | null;
  onHomeDelete: () => void;
  onHomeRename: (newHomes: Home[]) => void;
  onSelectHome: (home: Home) => void;
  onHomeAdded: (newHomes: Home[]) => void;
  homes: Home[];
}> = ({
  selectedHomePass,
  onSelectHome,
  onHomeAdded,
  homes,
  onHomeDelete,
  onHomeRename,
}) => {
  const [username, setUsername] = useState<string>("guest");
  const [, setHomes] = useState<Home[]>([]);
  const [isPinnedMenuVisible, setPinnedMenuVisible] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddHomeVisible, setIsAddHomeVisible] = useState(false);
  const [isEditHomesVisible, setIsEditHomesVisible] = useState(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDevicesCount, setActiveDevicesCount] = useState<number>(0); // State for active devices count
  const navigate = useNavigate();
  const [energyGeneration, setEnergyGeneration] = useState<string>("0KW/h");
  const [totalConsumption, setTotalConsumption] = useState<string>("0KW/h");

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get username from Firestore user document
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || user.email || "User");
        } else {
          setUsername(user.email || "User");
        }

        // Fetch user's homes
        const hubsRef = collection(db, "userHubs");
        const q = query(hubsRef, where("userId", "==", user.uid));

        try {
          const querySnapshot = await getDocs(q);
          const homesData: Home[] = [];

          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            homesData.push({
              homeName: data.homeName,
              homeType: data.homeType,
              hubCode: data.hubCode,
            });
          });

          // Auto-select logic
          let homeToSelect = null;

          // First, try to find a tenant hub
          homeToSelect = homesData.find((home) => home.homeType === "tenant");

          // If no tenant hub, select the first available home
          if (!homeToSelect && homesData.length > 0) {
            homeToSelect = homesData[0];
          }

          // If a home is found, set it as selected
          if (homeToSelect) {
            setSelectedHome(homeToSelect);
            onSelectHome(homeToSelect);
            localStorage.setItem("selectedHome", JSON.stringify(homeToSelect));
          }
        } catch (error) {
          console.error("Error fetching user hubs:", error);
        }
      } else {
        setUsername("guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchActiveDevicesAndEnergy = async (hubCode: string) => {
    const db = getFirestore();
    const devicesRef = collection(db, "devices");
    const q = query(
      devicesRef,
      where("hubCode", "==", hubCode),
      where("on", "==", true)
    );

    try {
      // Fetch active devices count
      const querySnapshot = await getDocs(q);
      setActiveDevicesCount(querySnapshot.size);

      // Fetch energy data from API
      const liveEnergyResponse = await fetch(
        `https://api.sukoonhome.me/hubs/${hubCode}/live-energy`
      );
      if (liveEnergyResponse.ok) {
        const liveEnergyData = await liveEnergyResponse.json();
        setTotalConsumption(`${liveEnergyData.total_consumption}KW`);
      }

      // Fetch real energy data for generation
      const realEnergyResponse = await fetch(
        `https://api.sukoonhome.me/hub/${hubCode}/real-energy`
      );
      if (realEnergyResponse.ok) {
        const realEnergyData = await realEnergyResponse.json();
        setEnergyGeneration(
          `${realEnergyData.energy_data.daily.total_energy}KW/h`
        );
      }
    } catch (error) {
      console.error("Error fetching active devices and energy:", error);
    }
  };

  // Update active devices count when selectedHome changes
  useEffect(() => {
    if (selectedHome) {
      fetchActiveDevicesAndEnergy(selectedHome.hubCode);
    }
  }, [selectedHome]);

  const handleSelectHome = (home: Home) => {
    setSelectedHome(home);
    setPinnedItems([]);
    localStorage.setItem("selectedHome", JSON.stringify(home));
  };

  const handleHomeRenamed = (renamedHomes: Home[]) => {
    onHomeRename(renamedHomes);
    fetchHomes();
  };
  const fetchPinnedItems = async () => {
    const db = getFirestore();
    try {
      // Get the current user's ID
      const user = auth.currentUser;
      if (!user) {
        console.log("No authenticated user found");
        return [];
      }

      // Fetch the user's pinned item IDs from their profile document
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log("User document not found");
        return [];
      }

      const userData = userDoc.data();
      const pinnedIds = userData?.pinnedItems || [];

      // Check if there are any pinned items before executing the query
      if (pinnedIds.length === 0) {
        console.log("User has no pinned items");
        return [];
      }

      // Now it's safe to use the 'in' operator since we know pinnedIds is not empty
      const pinnedItemsQuery = query(
        collection(db, "items"), // Assuming your collection is named "items"
        where("id", "in", pinnedIds)
      );

      const querySnapshot = await getDocs(pinnedItemsQuery);

      // Transform the query results into a more usable format
      const pinnedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`Successfully fetched ${pinnedItems.length} pinned items`);
      return pinnedItems;
    } catch (error) {
      console.error("Error fetching pinned items:", error);
      // Return empty array on error for consistent behavior
      return [];
    }
  };

  // const fetchPinnedItems = async () => {
  //   const db = getFirestore();

  //   if (selectedHome) {
  //     try {
  //       // Fetch pinned rooms
  //       const roomsRef = collection(db, 'rooms');
  //       const roomsQuery = query(roomsRef, where('hubCode', '==', selectedHome.hubCode), where('pinned', '==', true));
  //       const roomsSnapshot = await getDocs(roomsQuery);
  //       const pinnedRooms: Room[] = roomsSnapshot.docs.map((doc) => ({
  //         type: 'room',
  //         id: doc.id,
  //         roomName: doc.data().roomName,
  //         hubCode: doc.data().hubCode,
  //         pinned: doc.data().pinned,
  //         devices: doc.data().devices || [],
  //         image: doc.data().image || NoImage,
  //       }));

  //       // Fetch pinned devices
  //       const devicesRef = collection(db, 'devices');
  //       const devicesQuery = query(devicesRef, where('hubCode', '==', selectedHome.hubCode), where('pinned', '==', true));
  //       const devicesSnapshot = await getDocs(devicesQuery);
  //       const pinnedDevices: Device[] = devicesSnapshot.docs.map((doc) => ({
  //         type: 'device',
  //         id: doc.id,
  //         deviceName: doc.data().deviceName,
  //         deviceType: doc.data().deviceType,
  //         hubCode: doc.data().hubCode,
  //         pinned: doc.data().pinned,
  //       }));

  //       // Fetch pinned units (tenant hubs) for admin hubs
  //       let pinnedUnits: Unit[] = [];
  //       // In Homepage component's fetchPinnedItems
  //       if (selectedHome.homeType === 'admin') {
  //         // Fetch pinned tenant hubs
  //         const adminHubRef = doc(db, 'userHubs', selectedHome.hubCode);
  //         const adminHubDoc = await getDoc(adminHubRef);
  //         const unitHubCodes = adminHubDoc.data()?.units || []; // Add optional chaining

  //         // Fetch pinned tenant hubs
  //         const pinnedUnitsQuery = query(
  //           collection(db, 'userHubs'),
  //           where('hubCode', 'in', unitHubCodes),
  //           where('pinned', '==', true)
  //         );

  //         const pinnedUnitsSnapshot = await getDocs(pinnedUnitsQuery);
  //         pinnedUnits = pinnedUnitsSnapshot.docs.map(doc => ({
  //           type: 'unit',
  //           id: doc.id,
  //           unitName: doc.data().homeName,
  //           hubCode: doc.data().hubCode,
  //           pinned: true,
  //           image: doc.data().image || NoImage,
  //         }));
  //       }

  //       // Combine all pinned items
  //       const pinnedItems = [...pinnedRooms, ...pinnedDevices, ...pinnedUnits];
  //       setPinnedItems(pinnedItems);
  //     } catch (error) {
  //       console.error('Error fetching pinned items:', error);
  //     }
  //   }
  // };

  useEffect(() => {
    console.log("Pinned Items:", pinnedItems);
  }, [pinnedItems]);

  const handlePinItem = (item: PinnedItem) => {
    setPinnedItems((prev) => [...prev, item]); // Immediately add the new pinned item to the state
    fetchPinnedItems(); // Fetch the latest pinned items from Firestore to ensure consistency
  };

  const refreshPinnedMenu = () => {
    fetchPinnedItems();
  };

  useEffect(() => {
    fetchPinnedItems();
  }, [selectedHome]);

  const handleUnpinItem = async (item: PinnedItem) => {
    const db = getFirestore();

    try {
      let collectionName: string;
      switch (item.type) {
        case "room":
          collectionName = "rooms";
          break;
        case "device":
          collectionName = "devices";
          break;
        case "unit":
          collectionName = "userHubs"; // Correct collection name for units
          break;
        default:
          throw new Error("Invalid item type.");
      }

      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, { pinned: false }); // Set pinned to false

      // Remove the unpinned item from the local state
      setPinnedItems((prev) => prev.filter((i) => i.id !== item.id));

      // Refresh the pinned items from Firestore
      refreshPinnedMenu();
    } catch (error) {
      console.error("Error unpinning item:", error);
    }
  };

  const toggleAddHome = () => {
    setIsAddHomeVisible(!isAddHomeVisible);
  };

  const toggleEditHomes = () => {
    setIsEditHomesVisible(!isEditHomesVisible);
  };

  useEffect(() => {
    if (pinnedItems.length === 0) {
      setIsEditing(false);
    }
  }, [pinnedItems]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (isPinnedMenuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isPinnedMenuVisible]);

  const fetchHomes = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      const hubsRef = collection(db, "userHubs");
      const q = query(hubsRef, where("userId", "==", userId));

      try {
        const querySnapshot = await getDocs(q);
        const homesData: Home[] = [];

        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          homesData.push({
            homeName: data.homeName,
            homeType: data.homeType,
            hubCode: data.hubCode,
          });
        });

        setHomes(homesData);
      } catch (error) {
        console.error("Error fetching user hubs:", error);
      }
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleHomeAdded = (newHomes: Home[]) => {
    onHomeAdded(newHomes); // Update parent state
    fetchHomes(); // Refresh local data if needed
  };

  return (
    <div style={{ overflow: "hidden" }}>
      {isAddHomeVisible && (
        <AddHome
          closeAddHome={() => setIsAddHomeVisible(false)}
          onHomeAdded={handleHomeAdded}
        />
      )}

      {isEditHomesVisible && (
        <EditHomes
          closeEditHomes={toggleEditHomes}
          onHomeDeleted={onHomeDelete}
          onHomeRenamed={handleHomeRenamed}
          homes={homes}
        />
      )}

      <Stack
        className="homepageContainer"
        position={"relative"}
        display={"flex"}
        overflow={"hidden"}
      >
        <Box
          className="homepageHeader"
          margin={0}
          bg={selectedHome?.homeType === "admin" ? "#0b13b0" : "#6cce58"}
        >
          <Heading
            bg={"transparent"}
            ml={"5px"}
            mt={"20px"}
            mb={"20px"}
            className="introHomepage"
            fontSize={"110%"}
          >
            Ya Halla,{" "}
            <span style={{ color: "white" }} className="guestIntro">
              {username}
            </span>
          </Heading>
        </Box>

        <HStack
          align="center"
          ml="20px"
          mt={"10px"}
          zIndex={1}
          bg={"transparent"}
          width={"90%"}
        >
          <Heading color={"#454545"} bg={"transparent"}>
            Homes:
          </Heading>
          <Dropdown
            homes={homes}
            onSelect={(home) => {
              handleSelectHome(home);
              onSelectHome(home);
            }}
            initialShow={selectedHome?.homeName || "Choose Home..."}
          />
          <Button
            bg={"transparent"}
            width={"auto"}
            height={"auto"}
            onClick={toggleAddHome}
          >
            <TbCirclePlusFilled color="#21334a" size={"50%"} />
          </Button>

          <Box
            bg={"white"}
            width={"50%"}
            height={"25px"}
            justifyContent={"center"}
            alignItems={"center"}
            alignContent={"center"}
            display={"flex"}
            borderRadius={20}
            onClick={toggleEditHomes}
          >
            <MdOutlineEdit
              color="#21334a"
              size={"100%"}
              style={{ background: "transparent" }}
            />
          </Box>
        </HStack>

        <Flex
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          alignContent={"center"}
          mt={"2%"}
          zIndex={1}
          bg={"transparent"}
        >
          {selectedHome?.homeType === "admin" ? (
            <MiniDisplays
              Icon={FaRegBuilding}
              title="Connected Units:"
              value="0" // Static value for now
            />
          ) : (
            <MiniDisplays
              Icon={FiMonitor}
              title="Active devices:"
              value={activeDevicesCount.toString()}
            />
          )}
        </Flex>

        <Flex className="pulseBoxContainer" mt={"2%"}>
          <Lottie
            loop
            animationData={
              selectedHome?.homeType === "admin"
                ? PulseAnimationBlue
                : PulseAnimationGreen
            }
            play
            className="pulseAnimation"
            style={{
              background: "transparent",
              height: "450px",
              width: "450px",
            }}
          />
          <Box
            className="pulseBox"
            bg={selectedHome?.homeType === "admin" ? "#0b13b0" : "#05FF02"}
          >
            <Heading
              bg={"transparent"}
              color={"white"}
              fontWeight={"bold"}
              className="totalConsShow"
              fontSize={"120%"}
            >
              {totalConsumption}/h
            </Heading>
          </Box>
        </Flex>

        <Flex
          zIndex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Heading
            color={selectedHome?.homeType === "admin" ? "#0b13b0" : "#05FF02"}
            textDecor={"underline"}
            className="totConsHeading"
          >
            Total Consumption
          </Heading>
        </Flex>

        <Flex className="shadowPinned">
          <HStack
            ml="20px"
            zIndex={1}
            spaceX={"20%"}
            display={"flex"}
            mt={"20px"}
            className="pinnedinfoContainer"
          >
            <Heading fontSize={"220%"} className="pinnedHeader">
              Pinned
            </Heading>

            <HStack
              display={"flex"}
              bg={"transparent"}
              transform={"translateX(-5%)"}
            >
              <Flex
                bg={selectedHome?.homeType === "admin" ? "#0b13b0" : "#6cce58"} // Change background color based on homeType
                borderRadius="full"
                overflow="hidden"
                alignItems="center"
                height={"3vh"}
              >
                <Button
                  bg="transparent"
                  color="white"
                  px={6}
                  py={2}
                  fontSize="md"
                  _hover={{
                    bg:
                      selectedHome?.homeType === "admin"
                        ? "#0a0f8f"
                        : "#5bb046",
                  }} // Change hover color based on homeType
                  onClick={() => setPinnedMenuVisible(true)}
                >
                  +
                </Button>
                <Button
                  bg="transparent"
                  color="white"
                  px={6}
                  py={2}
                  fontSize="md"
                  _hover={{
                    bg:
                      selectedHome?.homeType === "admin"
                        ? "#0a0f8f"
                        : "#5bb046",
                  }} // Change hover color based on homeType
                  onClick={() => setIsEditing(!isEditing)}
                >
                  -
                </Button>
              </Flex>

              <FaExpandAlt
                color="#21334a"
                size={"15%"}
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: "pointer" }}
              />
            </HStack>
          </HStack>
        </Flex>

        <Flex
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          alignContent={"center"}
          zIndex={1}
        >
          <Box
            bg={"white"}
            width={isExpanded ? "100vw" : "95%"}
            height={isExpanded ? "100vh" : "300px"}
            overflow={"scroll"}
            position={isExpanded ? "fixed" : "static"}
            top={isExpanded ? "0" : "auto"}
            left={isExpanded ? "0" : "auto"}
            zIndex={isExpanded ? 1000 : "auto"}
            mb={"20%"}
          >
            {isExpanded && (
              <Box
                position="absolute"
                top="20px"
                right="20px"
                zIndex={1001}
                cursor="pointer"
                onClick={() => setIsExpanded(false)}
                bg={"transparent"}
              >
                <AiOutlineShrink size={24} color="#21334a" />
              </Box>
            )}

            {isExpanded && (
              <Box
                textAlign="center"
                mb={4}
                position="sticky" // Makes the heading stick at the top while scrolling
                top={0} // Sticks to the very top of the scrollable area
                zIndex={1} // Keeps it above the images when scrolling
                bg="white" // Background color to avoid overlap visibility issues
                py={2} // Adds some padding for better aesthetics
              >
                <Heading fontSize="2xl" color="#21334a" bg={"transparent"}>
                  Pinned Items
                </Heading>
              </Box>
            )}

            <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
              {pinnedItems.map((item) => (
                <Box
                  key={item.id}
                  borderRadius="20px"
                  overflow="hidden"
                  bg="white"
                  p={3}
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                  border={`1px solid ${
                    isEditing ? "red" : "rgba(0, 0, 0, 0.08)"
                  }`}
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f5f5f5",
                  }}
                  onClick={() => {
                    if (isEditing) {
                      handleUnpinItem(item);
                    } else {
                      if (item.type === "room") {
                        navigate(`/devices/${item.id}`);
                      } else if (item.type === "device") {
                        navigate(`/device/${item.id}`);
                      } else if (item.type === "unit") {
                        navigate(`/unit/${item.id}`);
                      }
                    }
                  }}
                  height="180px"
                >
                  <Image
                    src={
                      item.type === "room"
                        ? (item as Room).image || NoImage
                        : item.type === "device"
                        ? deviceTypeToImage[
                            normalizeDeviceType((item as Device).deviceType)
                          ] || LightImg
                        : (item as Unit).image || NoImage // Handle units
                    }
                    alt={
                      item.type === "room"
                        ? (item as Room).roomName
                        : item.type === "device"
                        ? (item as Device).deviceName
                        : (item as Unit).unitName
                    }
                    borderRadius="12px"
                    objectFit="cover"
                    width="100%"
                    height="90px"
                  />
                  <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58">
                    {item.type === "room"
                      ? (item as Room).roomName
                      : item.type === "device"
                      ? (item as Device).deviceName
                      : (item as Unit).unitName}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {item.type === "room"
                      ? `${(item as Room).devices.length} devices`
                      : item.type === "device"
                      ? (item as Device).deviceType
                      : "Unit"}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Stack>

      {selectedHome?.homeType === "admin" ? (
        <PinnedMenuAdmin
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem} // Pass the handlePinItem function
          selectedHubCode={selectedHome?.hubCode || ""}
          refreshPinnedMenu={refreshPinnedMenu}
        />
      ) : (
        <PinnedMenu
          isVisible={isPinnedMenuVisible}
          onClose={() => setPinnedMenuVisible(false)}
          onPinItem={handlePinItem}
          selectedHubCode={selectedHome?.hubCode || ""}
          refreshPinnedMenu={refreshPinnedMenu}
        />
      )}
    </div>
  );
};

export default Homepage;
