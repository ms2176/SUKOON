import { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Heading,
  Box,
  SimpleGrid,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Add this import
import "./Stats.css";
import DownloadButton from "./DownloadButton";

// Import the JSON data
import energyStatsData from "./demoData.json";

const StatsTenant = () => {
  // Add this array with your demo user IDs
  const demoUserIds = [
    "rPms1L8WRYgeSDGV59I30J6ZaGp1",
    "A4RUSi3FNTT8mR9kOhx0HJCCvXN2",
    "eA30YbSS12M7oL19w2i9zSjZbmo1",
    "3rq9m8Oew9XJ44WbTvNsJhtHLv73",
    // Add all your demo account IDs here
  ];

  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("monthly"); // Default filter
  const [hubData, setHubData] = useState(null);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Check if current user is a demo user
  useEffect(() => {
    const checkIfDemoUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && demoUserIds.includes(currentUser.uid)) {
        setIsDemoUser(true);
      } else {
        setIsDemoUser(false);
        // Force loading to false since we won't be loading any data
        setLoading(false);
      }
    };

    checkIfDemoUser();
  }, []);

  // Load selected home from localStorage
  useEffect(() => {
    const storedSelectedHome = localStorage.getItem("selectedHome");
    if (storedSelectedHome) {
      const homeData = JSON.parse(storedSelectedHome);
      setSelectedHome(homeData);
    }
  }, []);

  // Fetch hub data and validate with Firebase
  // Fetch hub data and validate with Firebase
  useEffect(() => {
    const fetchHubData = async () => {
      // Skip data fetching for non-demo users
      if (!isDemoUser) {
        setEnergyData([]);
        setLoading(false);
        return;
      }

      if (selectedHome) {
        setLoading(true);

        // For demo users, we'll always use the energyStatsData JSON
        // No need to check if the hubCode matches
        setHubData(energyStatsData);
        processEnergyData(energyStatsData, timeFilter);

        setLoading(false);
      }
    };

    fetchHubData();
  }, [selectedHome, timeFilter, isDemoUser]); // Add isDemoUser as a dependency

  // Process energy data based on the time filter
  const processEnergyData = (hubData: HubData | null, timeFilter: string) => {
    if (!hubData || !hubData.energy_data) {
      setEnergyData([]);
      return;
    }

    // Handle the case where the specific timeFilter data doesn't exist yet
    if (!hubData.energy_data[timeFilter as keyof EnergyData]) {
      console.error(`No ${timeFilter} data available in the hub data`);
      setEnergyData([]);
      return;
    }

    const timeData = hubData.energy_data[timeFilter as keyof EnergyData];
    const roomsData = timeData.rooms;

    if (!roomsData) {
      console.error(`No rooms data for ${timeFilter}`);
      setEnergyData([]);
      return;
    }

    // Transform rooms data into the format expected by the chart
    const formattedData = Object.entries(roomsData).map(
      ([roomName, roomData]) => {
        return {
          name: roomName,
          energy: roomData.energy_value,
          devices: roomData.device_count,
        };
      }
    );

    // Sort by energy consumption (descending)
    formattedData.sort((a, b) => b.energy - a.energy);

    setEnergyData(formattedData);
  };

  // When time filter changes, update the energy data
  useEffect(() => {
    if (hubData) {
      processEnergyData(hubData, timeFilter);
    }
  }, [hubData, timeFilter]);

  const goToHome = () => {
    navigate("/homepage");
  };

  // Function to download report as CSV
  const downloadReport = () => {
    if (energyData.length === 0) {
      toaster.create({
        description: "No data available to download",
        type: "error",
      });
      return;
    }

    // Create CSV content
    const headers = ["Room", "Energy (kWh)", "Devices"];
    const csvRows = [
      headers.join(","),
      ...energyData.map((item) =>
        [item.name, item.energy, item.devices].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `energy_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toaster.create({
      description: "Report downloaded successfully",
      type: "success",
    });
  };

  // Function to get the current time period label
  const getTimePeriodLabel = () => {
    if (!hubData || !hubData.energy_data || !hubData.energy_data[timeFilter]) {
      return "";
    }

    const timeData = hubData.energy_data[timeFilter];

    switch (timeFilter) {
      case "daily":
        return `Date: ${timeData.date}`;
      case "weekly":
        return `Week ${timeData.week}, ${timeData.year}`;
      case "monthly":
        return `Month ${timeData.month}, ${timeData.year}`;
      case "yearly":
        return `Year ${timeData.year}`;
      default:
        return "";
    }
  };

  return (
    <div className="homepageContainer" style={{ overflowX: "hidden" }}>
      {/* Header */}
      <Box className="homepageHeader" bg="#6cce58">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          px="20px"
          py="20px"
        >
          <Heading
            bg="transparent"
            fontWeight="extrabold"
            className="introHomepage"
            color="black"
          >
            Your Statistics
          </Heading>
          {isDemoUser && <DownloadButton onClick={downloadReport} />}
        </Flex>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box textAlign="center" py={10}>
          <Text>Loading energy data...</Text>
        </Box>
      ) : error ? (
        <Box textAlign="center" py={10} color="red.500">
          <Text>{error}</Text>
          <Button
            mt={4}
            colorScheme="green"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          {/* Energy Consumption Chart */}
          <Box
            className="shadowPinned"
            mt="20px"
            mx="20px"
            borderRadius="10px"
            bg="white"
          >
            <Flex direction="column" width="100%" p="15px">
              <Flex direction="column" mb="15px">
                <Heading
                  textAlign="left"
                  fontSize="xl"
                  className="pinnedHeader"
                  color="#21334a"
                  mb="10px"
                >
                  Energy Consumed:
                </Heading>
                {isDemoUser && (
                  <Text color="#6cce58" fontWeight="medium" mb="15px">
                    {getTimePeriodLabel()}
                  </Text>
                )}
                {isDemoUser && (
                  <ButtonGroup
                    size="sm"
                    isAttached
                    variant="outline"
                    alignSelf="flex-start"
                  >
                    <Button
                      colorScheme={timeFilter === "daily" ? "green" : "gray"}
                      onClick={() => setTimeFilter("daily")}
                      color="#21334a"
                      className="tenant-filter-btn"
                    >
                      Daily
                    </Button>
                    <Button
                      colorScheme={timeFilter === "weekly" ? "green" : "gray"}
                      onClick={() => setTimeFilter("weekly")}
                      color="#21334a"
                      className="tenant-filter-btn"
                    >
                      Weekly
                    </Button>
                    <Button
                      colorScheme={timeFilter === "monthly" ? "green" : "gray"}
                      onClick={() => setTimeFilter("monthly")}
                      color="#21334a"
                      className="tenant-filter-btn"
                    >
                      Monthly
                    </Button>
                    <Button
                      colorScheme={timeFilter === "yearly" ? "green" : "gray"}
                      onClick={() => setTimeFilter("yearly")}
                      color="#21334a"
                      className="tenant-filter-btn"
                    >
                      Yearly
                    </Button>
                  </ButtonGroup>
                )}
              </Flex>
              <Box height="300px" width="100%">
                {!isDemoUser ? (
                  <Flex
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Text color="#666" fontSize="lg" mb={4}>
                      No energy data available for this account
                    </Text>
                    <Text color="#888" fontSize="sm">
                      Energy data will appear here after your smart devices
                      collect usage information.
                    </Text>
                  </Flex>
                ) : energyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={energyData}
                      barSize={20}
                      margin={{ top: 20, right: 20, left: 5, bottom: 5 }}
                      barGap={5} // Small gap between bars within the same category
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#21334a", fontSize: 12 }}
                        height={60}
                        tickLine={false}
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fill: "#21334a", fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="energy"
                        fill="#6cce58"
                        name="Energy (kWh)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Flex
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="#666">
                      No energy data available for this time period
                    </Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </Box>

          {/* Devices Per Room */}
          <Box
            className="shadowPinned"
            mt="20px"
            mx="20px"
            borderRadius="10px"
            bg="white"
            mb="30px"
          >
            <Flex direction="column" width="100%" p="15px">
              <Heading
                textAlign="left"
                fontSize="xl"
                className="pinnedHeader"
                color="#21334a"
                mb="15px"
              >
                Devices by Room
              </Heading>
              {!isDemoUser ? (
                <Flex justifyContent="center" alignItems="center" py={5}>
                  <Text color="#666">
                    No device data available for this account
                  </Text>
                </Flex>
              ) : energyData.length > 0 ? (
                <SimpleGrid columns={1} gap={3}>
                  {energyData.map((item, index) => (
                    <Flex
                      key={index}
                      bg="white"
                      p={3}
                      borderRadius="md"
                      justifyContent="space-between"
                      alignItems="center"
                      boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
                      onClick={() => {
                        // Find room_id from the hubData structure
                        const roomId =
                          hubData?.energy_data[timeFilter]?.rooms[item.name]
                            ?.room_id;
                        if (roomId) {
                          fetchRoomDetails(roomId);
                        }
                      }}
                      cursor="pointer"
                      _hover={{ bg: "#f9f9f9" }}
                    >
                      <Box>
                        <Text fontWeight="medium" color="#21334a">
                          {item.name}
                        </Text>
                        <Text fontSize="sm" color="#666">
                          {item.devices} devices
                        </Text>
                      </Box>
                      <Text
                        bg="#43eb7f"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        color={item.energy > 0 ? "white" : "#666"}
                      >
                        {item.energy} kWh
                      </Text>
                    </Flex>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex justifyContent="center" alignItems="center" py={5}>
                  <Text color="#666">
                    No device data available for this time period
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </>
      )}
    </div>
  );
};

export default StatsTenant;
