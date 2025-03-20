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
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import "./Homepage.css";
import Dropdown from "./Dropdown.tsx";
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
  FiZap 
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

interface MiniDisplaysProps {
  Icon: React.ElementType;
  title: string;
  value: string;
}

const MiniDisplays = ({ Icon, title, value }: MiniDisplaysProps) => (
  <Box
    className="statsCard"
    display="flex"
    alignItems="center"
    gap={4}
    p={6}
    width="full"
    maxW="320px"
  >
    <Icon size={24} color="var(--primary-green)" />
    <Box>
      <Text color="gray.600" fontSize="sm" fontWeight="medium">
        {title}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="var(--primary-dark)">
        {value}
      </Text>
    </Box>
  </Box>
);

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

        // Get selected home from localStorage if exists
        const storedHome = localStorage.getItem("selectedHome");
        if (storedHome) {
          const parsedHome = JSON.parse(storedHome);
          setSelectedHome(parsedHome);
          onSelectHome(parsedHome);
        }
      } else {
        setUsername("guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchActiveDevicesCount = async (hubCode: string) => {
    const db = getFirestore();
    const devicesRef = collection(db, "devices");
    const q = query(
      devicesRef,
      where("hubCode", "==", hubCode),
      where("on", "==", true)
    );

    try {
      const querySnapshot = await getDocs(q);
      setActiveDevicesCount(querySnapshot.size); // Set the count of active devices
    } catch (error) {
      console.error("Error fetching active devices:", error);
    }
  };

  // Update active devices count when selectedHome changes
  useEffect(() => {
    if (selectedHome) {
      fetchActiveDevicesCount(selectedHome.hubCode);
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
    <Box bg="var(--background-light)" minH="100vh">
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

      <Stack className="homepageContainer">
        <Box className="homepageHeader">
          <Heading className="introHomepage">
            Ya Halla, <span className="guestIntro">{username}</span>
          </Heading>
        </Box>

        {/* Homes Selector */}
        <HStack 
          gap={4} 
          p={6} 
          bg="white" 
          borderRadius="xl" 
          boxShadow="var(--shadow-sm)"
          m={6}
        >
          <Heading size="md" color="var(--primary-dark)">Homes:</Heading>
          <Dropdown
            homes={homes}
            onSelect={handleSelectHome}
            initialShow={selectedHome?.homeName || "Choose Home..."}
          />
          <Button
            className="navButton"
            onClick={toggleAddHome}
            variant="ghost"
            colorScheme="green"
          >
            <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
              <TbCirclePlusFilled size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
            </Stack>
          </Button>
          <Button
            className="navButton"
            onClick={toggleEditHomes}
            variant="ghost"
          >
            <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
              <MdOutlineEdit size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
            </Stack>
          </Button>
        </HStack>

        {/* Stats Cards */}
        <Box px={[4, 6]}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={[4, 6]}
            width="100%"
          >
            <MiniDisplays
              Icon={FiMonitor}
              title="Active devices"
              value={activeDevicesCount.toString()}
            />
            <MiniDisplays
              Icon={FiHome}
              title="Home Status"
              value="Good"
            />
            <MiniDisplays
              Icon={FiZap}
              title="Energy Generation"
              value="50KW/h"
            />
          </Grid>
        </Box>

        {/* Energy Pulse Animation */}
        <Box position="relative" width="100%">
          <Flex className="pulseBoxContainer">
            <Lottie
              loop
              animationData={selectedHome?.homeType === "admin" ? PulseAnimationBlue : PulseAnimationGreen}
              play
              className="pulseAnimation"
            />
            <Flex
              className="pulseBox"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap={2}
            >
              <Text className="totalConsShow">50.1KW/h</Text>
              <Text 
                fontSize={["xs", "sm"]} 
                color="white" 
                opacity={0.9}
                textAlign="center"
              >
                Total Consumption
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Pinned Items Section */}
        <Box className="pinnedSection">
          <Flex justify="space-between" align="center" mb={6}>
            <Heading className="pinnedHeader">Pinned Items</Heading>
            <HStack p={2} gap={2}>
              <ButtonGroup size="sm" attached variant="outline">
                <Button
                  className="navButton"
                  onClick={() => setPinnedMenuVisible(true)}
                >
                  <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <TbCirclePlusFilled size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
                  </Stack>
                </Button>
                <Button
                  className="navButton"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                    <MdOutlineEdit size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
                  </Stack>
                </Button>
              </ButtonGroup>
              <Button
                className="navButton"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Stack spaceY={-3} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                  {isExpanded ? 
                    <AiOutlineShrink size={'70%'} style={{ background: 'transparent' }} color="#21334a" /> :
                    <FaExpandAlt size={'70%'} style={{ background: 'transparent' }} color="#21334a" />
                  }
                </Stack>
              </Button>
            </HStack>
          </Flex>

          {/* Pinned Items Grid */}
          <Grid className="pinnedGrid">
            {pinnedItems.map((item) => (
              <Box
                key={item.id}
                borderRadius="16px"
                overflow="hidden"
                bg="white"
                p={4}
                cursor="pointer"
                transition="all 0.3s ease-in-out"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
                border="1px solid rgba(0, 0, 0, 0.08)"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
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
                  height="140px"
                />
                <Box mt={3}>
                  <Text fontWeight="600" fontSize="md" color="#2C3E50">
                    {item.type === "room"
                      ? (item as Room).roomName
                      : item.type === "device"
                      ? (item as Device).deviceName
                      : (item as Unit).unitName}
                  </Text>
                  <Text color="gray.600" fontSize="sm" mt={1}>
                    {item.type === "room"
                      ? `${(item as Room).devices.length} devices`
                      : item.type === "device"
                      ? (item as Device).deviceType
                      : "Unit"}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
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
    </Box>
  );
};

export default Homepage;
