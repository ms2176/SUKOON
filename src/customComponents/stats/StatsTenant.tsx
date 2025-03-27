import { useState, useEffect, useRef } from "react";
import {
  Text,
  Flex,
  Heading,
  Box,
  SimpleGrid,
  Button,
  ButtonGroup,
  Spinner,
  IconButton,
  Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import { FiRefreshCcw, FiDownload } from "react-icons/fi";
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
import "./Stats.css";
import DownloadButton from "./DownloadButton";

// Add TypeScript interfaces
interface ChartData {
  name: string;
  energy: number;
  devices: number;
  roomId: string;
}

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface RoomData {
  energy_value: number;
  unit: string;
  device_count: number;
  room_id: string;
  devices: Array<{ device_type: string }>;
}

interface TimeData {
  total_energy: number;
  unit: string;
  date?: string;
  week?: string;
  month?: string;
  year?: string;
  rooms: Record<string, RoomData>;
}

interface EnergyData {
  daily: TimeData;
  weekly: TimeData;
  monthly: TimeData;
  yearly: TimeData;
}

interface HubData {
  hub_id: string;
  hub_name: string;
  hub_type: string;
  energy_data: EnergyData;
}

const StatsTenant = () => {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState("monthly"); // Default filter
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For individual API calls
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  // Consistent green color throughout the component
  const primaryGreen = "#43eb7f";

  // Update relative time every minute
  useEffect(() => {
    const updateRelativeTime = () => {
      if (!lastUpdated) return;

      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);

      if (diffSecs < 10) {
        setLastUpdatedText("just now");
      } else if (diffSecs < 60) {
        setLastUpdatedText(`${diffSecs}s ago`);
      } else if (diffMins < 60) {
        setLastUpdatedText(`${diffMins}m ago`);
      } else {
        setLastUpdatedText(`${diffHours}h ${diffMins % 60}m ago`);
      }
    };

    // Initial update
    updateRelativeTime();

    // Set interval to update every 10 seconds
    const intervalId = window.setInterval(updateRelativeTime, 10000);
    timerRef.current = intervalId;

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [lastUpdated]);

  // Load selected home from localStorage
  useEffect(() => {
    const storedSelectedHome = localStorage.getItem("selectedHome");
    if (storedSelectedHome) {
      const homeData = JSON.parse(storedSelectedHome);
      setSelectedHome(homeData);
    } else {
      setErrorMessage("No home selected. Please select a home first.");
      setLoading(false);
    }
  }, []);

  // Fetch hub data from API - only when selectedHome changes, not on timeFilter change
  useEffect(() => {
    const fetchHubData = async () => {
      if (selectedHome && selectedHome.hubCode) {
        setLoading(true);
        setIsLoading(true);

        try {
          const apiUrl = `https://api.sukoonhome.me/hub/${selectedHome.hubCode}/energy`;

          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch hub data: ${response.statusText}`);
          }

          const data = await response.json();
          setHubData(data as HubData);
          processEnergyData(data as HubData, timeFilter);
          setLastUpdated(new Date());
        } catch (error) {
          console.error("Error fetching hub data:", error);
          setErrorMessage(
            "Failed to load energy data. Please try again later."
          );
        } finally {
          setLoading(false);
          setIsLoading(false);
        }
      }
    };

    fetchHubData();
  }, [selectedHome]); // Remove timeFilter dependency

  // Refresh data function
  const refreshData = async () => {
    if (selectedHome && selectedHome.hubCode) {
      setIsLoading(true);

      try {
        const apiUrl = `https://api.sukoonhome.me/hub/${selectedHome.hubCode}/energy`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch hub data: ${response.statusText}`);
        }

        const data = await response.json();
        setHubData(data as HubData);
        processEnergyData(data as HubData, timeFilter);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error refreshing hub data:", error);
        toaster.create({
          description: "Failed to refresh data. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          roomId: roomData.room_id,
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

  // Handle room click - will be used later for navigation to room stats
  const handleRoomClick = (roomId: string, roomName: string) => {
    navigate(`/room-stats/${roomId}`, { state: { roomName } });
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
    const headers = ["Room", "Energy (kWh)", "Devices", "Room ID"];
    const csvRows = [
      headers.join(","),
      ...energyData.map((item) =>
        [item.name, item.energy, item.devices, item.roomId].join(",")
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
    if (
      !hubData ||
      !hubData.energy_data ||
      !hubData.energy_data[timeFilter as keyof EnergyData]
    ) {
      return "";
    }

    const timeData = hubData.energy_data[timeFilter as keyof EnergyData];

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

  // Function to get total energy for the selected time period
  const getTotalEnergy = () => {
    if (
      !hubData ||
      !hubData.energy_data ||
      !hubData.energy_data[timeFilter as keyof EnergyData]
    ) {
      return 0;
    }

    const timeData = hubData.energy_data[timeFilter as keyof EnergyData];
    return timeData ? timeData.total_energy : 0;
  };

  // Function to get energy unit
  const getEnergyUnit = () => {
    if (
      !hubData ||
      !hubData.energy_data ||
      !hubData.energy_data[timeFilter as keyof EnergyData]
    ) {
      return "kWh";
    }

    const timeData = hubData.energy_data[timeFilter as keyof EnergyData];
    return timeData ? timeData.unit : "kWh";
  };

  // Determine if we're on desktop based on window width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Check for desktop view on mount and window resize
  useEffect(() => {
    const checkForDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkForDesktop();

    // Add event listener for window resize
    window.addEventListener("resize", checkForDesktop);

    // Cleanup
    return () => window.removeEventListener("resize", checkForDesktop);
  }, []);

  return (
    <div className="homepageContainer" style={{ overflowX: "hidden" }}>
      {/* Header */}
      <Box
        className="homepageHeader"
        bg="white"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          px={isDesktop ? "40px" : "20px"}
          py="20px"
        >
          <Heading
            bg="transparent"
            fontWeight="extrabold"
            className="introHomepage"
            color="#4A5568"
            fontSize={isDesktop ? "24px" : "20px"}
          >
            Your Statistics
          </Heading>
          <IconButton
            aria-label="Download report"
            onClick={downloadReport}
            size={isDesktop ? "lg" : "md"}
            variant="ghost"
            colorScheme="green"
          >
            <FiDownload color={primaryGreen} />
          </IconButton>
        </Flex>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          height="200px"
        >
          <Spinner color={primaryGreen} size="xl" margin="0 0 16px 0" />
          <Text>Loading energy data...</Text>
        </Flex>
      ) : errorMessage ? (
        <Box textAlign="center" py={10} color="red.500">
          <Text>{errorMessage}</Text>
          <Button
            mt={4}
            colorScheme="green"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <Box
          maxWidth={isDesktop ? "1400px" : "100%"}
          margin={isDesktop ? "0 auto" : "0"}
          px={isDesktop ? "40px" : "0"}
        >
          {/* Desktop Layout - Side-by-side when in desktop mode */}
          {isDesktop ? (
            <Flex gap="30px" mt="30px" mb="100px">
              {/* Left Column - Chart */}
              <Box flex="3" position="relative">
                <Box className="shadowPinned" borderRadius="10px" bg="white">
                  {isLoading && (
                    <Flex
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      alignItems="center"
                      justifyContent="center"
                      bg="rgba(255, 255, 255, 0.7)"
                      zIndex="1"
                      borderRadius="10px"
                    >
                      <Spinner color={primaryGreen} size="xl" />
                    </Flex>
                  )}
                  <Flex direction="column" width="100%" p="25px">
                    <Flex direction="column" mb="20px">
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb="20px"
                        flexWrap="wrap"
                        gap={2}
                      >
                        <Box>
                          <Heading
                            textAlign="left"
                            fontSize="2xl"
                            className="pinnedHeader"
                            color="#21334a"
                            mb="10px"
                          >
                            Energy Consumed: {getTotalEnergy()}{" "}
                            {getEnergyUnit()}
                          </Heading>
                          <Text
                            color={primaryGreen}
                            fontWeight="medium"
                            fontSize="16px"
                          >
                            {getTimePeriodLabel()}
                          </Text>
                        </Box>
                        <Flex alignItems="center" alignSelf="flex-start">
                          {lastUpdated && (
                            <Text fontSize="sm" color="gray.500" mr={3}>
                              Last updated: {lastUpdatedText}
                            </Text>
                          )}
                          <IconButton
                            aria-label="Refresh data"
                            onClick={refreshData}
                            isLoading={isLoading}
                            size="md"
                            variant="ghost"
                            colorScheme="green"
                          >
                            <FiRefreshCcw color={primaryGreen} />
                          </IconButton>
                        </Flex>
                      </Flex>
                      <Box width="100%" overflow="auto" pb={3}>
                        <ButtonGroup
                          size="md"
                          variant="outline"
                          style={{ alignSelf: "flex-start" }}
                          spacing={4}
                        >
                          <Button
                            bg={
                              timeFilter === "daily"
                                ? primaryGreen
                                : "transparent"
                            }
                            color={timeFilter === "daily" ? "white" : "#21334a"}
                            onClick={() => setTimeFilter("daily")}
                            className="tenant-filter-btn"
                            px={5}
                            py={2}
                            borderWidth={1}
                            borderColor={
                              timeFilter === "daily" ? primaryGreen : "#E2E8F0"
                            }
                            _hover={{
                              bg:
                                timeFilter === "daily"
                                  ? primaryGreen
                                  : "#e6ffe6",
                              color:
                                timeFilter === "daily" ? "white" : primaryGreen,
                            }}
                          >
                            Daily
                          </Button>
                          <Button
                            bg={
                              timeFilter === "weekly"
                                ? primaryGreen
                                : "transparent"
                            }
                            color={
                              timeFilter === "weekly" ? "white" : "#21334a"
                            }
                            onClick={() => setTimeFilter("weekly")}
                            className="tenant-filter-btn"
                            px={5}
                            py={2}
                            borderWidth={1}
                            borderColor={
                              timeFilter === "weekly" ? primaryGreen : "#E2E8F0"
                            }
                            _hover={{
                              bg:
                                timeFilter === "weekly"
                                  ? primaryGreen
                                  : "#e6ffe6",
                              color:
                                timeFilter === "weekly"
                                  ? "white"
                                  : primaryGreen,
                            }}
                          >
                            Weekly
                          </Button>
                          <Button
                            bg={
                              timeFilter === "monthly"
                                ? primaryGreen
                                : "transparent"
                            }
                            color={
                              timeFilter === "monthly" ? "white" : "#21334a"
                            }
                            onClick={() => setTimeFilter("monthly")}
                            className="tenant-filter-btn"
                            px={5}
                            py={2}
                            borderWidth={1}
                            borderColor={
                              timeFilter === "monthly"
                                ? primaryGreen
                                : "#E2E8F0"
                            }
                            _hover={{
                              bg:
                                timeFilter === "monthly"
                                  ? primaryGreen
                                  : "#e6ffe6",
                              color:
                                timeFilter === "monthly"
                                  ? "white"
                                  : primaryGreen,
                            }}
                          >
                            Monthly
                          </Button>
                          <Button
                            bg={
                              timeFilter === "yearly"
                                ? primaryGreen
                                : "transparent"
                            }
                            color={
                              timeFilter === "yearly" ? "white" : "#21334a"
                            }
                            onClick={() => setTimeFilter("yearly")}
                            className="tenant-filter-btn"
                            px={5}
                            py={2}
                            borderWidth={1}
                            borderColor={
                              timeFilter === "yearly" ? primaryGreen : "#E2E8F0"
                            }
                            _hover={{
                              bg:
                                timeFilter === "yearly"
                                  ? primaryGreen
                                  : "#e6ffe6",
                              color:
                                timeFilter === "yearly"
                                  ? "white"
                                  : primaryGreen,
                            }}
                          >
                            Yearly
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Flex>
                    <Box width="100%" height="500px">
                      {energyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={energyData}
                            barSize={30}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 20,
                            }}
                            barGap={8}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.3}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: "#21334a", fontSize: 14 }}
                              height={70}
                              tickLine={false}
                              angle={-30}
                              textAnchor="end"
                              interval={0}
                              padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                              tick={{ fill: "#21334a", fontSize: 14 }}
                              width={60}
                            />
                            <Tooltip
                              formatter={(value, name) => {
                                if (name === "energy") {
                                  return [
                                    `${value} ${getEnergyUnit()}`,
                                    "Energy",
                                  ];
                                }
                                return [value, name];
                              }}
                              contentStyle={{ fontSize: "14px" }}
                            />
                            <Legend wrapperStyle={{ fontSize: "14px" }} />
                            <Bar
                              dataKey="energy"
                              fill={primaryGreen}
                              name="Energy"
                              radius={[5, 5, 0, 0]} // Rounded top corners of bars
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Flex
                          height="100%"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text color="#666" fontSize="16px">
                            No energy data available for this time period
                          </Text>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Box>

              {/* Right Column - Room List */}
              <Box flex="1" maxHeight="80vh">
                <Box
                  className="shadowPinned"
                  borderRadius="10px"
                  bg="white"
                  position="sticky"
                  top="20px"
                  maxHeight="80vh"
                  overflowY="auto"
                >
                  <Flex direction="column" width="100%" p="25px">
                    <Heading
                      textAlign="left"
                      fontSize="2xl"
                      className="pinnedHeader"
                      color="#21334a"
                      mb="20px"
                    >
                      Devices by Room
                    </Heading>
                    {energyData.length > 0 ? (
                      <SimpleGrid columns={1} gap={4}>
                        {energyData.map((item, index) => (
                          <Flex
                            key={index}
                            bg="white"
                            p={4}
                            borderRadius="md"
                            justifyContent="space-between"
                            alignItems="center"
                            boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
                            onClick={() =>
                              handleRoomClick(item.roomId, item.name)
                            }
                            cursor="pointer"
                            _hover={{
                              bg: "#f9f9f9",
                              transform: "translateY(-2px)",
                              transition: "all 0.2s ease",
                            }}
                            data-room-id={item.roomId}
                            transition="all 0.2s ease"
                          >
                            <Box>
                              <Text
                                fontWeight="medium"
                                color="#21334a"
                                fontSize="16px"
                              >
                                {item.name}
                              </Text>
                              <Text fontSize="14px" color="#666">
                                {item.devices} devices
                              </Text>
                            </Box>
                            <Text
                              bg={primaryGreen}
                              px={4}
                              py={2}
                              borderRadius="full"
                              fontSize="14px"
                              fontWeight="medium"
                              color={item.energy > 0 ? "white" : "#666"}
                            >
                              {item.energy} {getEnergyUnit()}
                            </Text>
                          </Flex>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Flex justifyContent="center" alignItems="center" py={8}>
                        <Text color="#666" fontSize="16px">
                          No device data available for this time period
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          ) : (
            // Mobile Layout - Original stacked layout
            <>
              {/* Energy Consumption Chart */}
              <Box
                className="shadowPinned"
                mt="20px"
                mx="20px"
                borderRadius="10px"
                bg="white"
                position="relative"
              >
                {isLoading && (
                  <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    alignItems="center"
                    justifyContent="center"
                    bg="rgba(255, 255, 255, 0.7)"
                    zIndex="1"
                    borderRadius="10px"
                  >
                    <Spinner color={primaryGreen} size="xl" />
                  </Flex>
                )}
                <Flex direction="column" width="100%" p="15px">
                  <Flex direction="column" mb="15px">
                    <Flex
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb="15px"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Box>
                        <Heading
                          textAlign="left"
                          fontSize="xl"
                          className="pinnedHeader"
                          color="#21334a"
                          mb="10px"
                        >
                          Energy Consumed: {getTotalEnergy()} {getEnergyUnit()}
                        </Heading>
                        <Text color={primaryGreen} fontWeight="medium">
                          {getTimePeriodLabel()}
                        </Text>
                      </Box>
                      <Flex alignItems="center" alignSelf="flex-start" mt={1}>
                        {lastUpdated && (
                          <Text fontSize="sm" color="gray.500" mr={3}>
                            Last updated: {lastUpdatedText}
                          </Text>
                        )}
                        <IconButton
                          aria-label="Refresh data"
                          onClick={refreshData}
                          isLoading={isLoading}
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                        >
                          <FiRefreshCcw color={primaryGreen} />
                        </IconButton>
                      </Flex>
                    </Flex>
                    <Box width="100%" overflow="auto" pb={3}>
                      <ButtonGroup
                        size="sm"
                        variant="outline"
                        style={{ alignSelf: "flex-start" }}
                        spacing={3}
                      >
                        <Button
                          bg={
                            timeFilter === "daily"
                              ? primaryGreen
                              : "transparent"
                          }
                          color={timeFilter === "daily" ? "white" : "#21334a"}
                          onClick={() => setTimeFilter("daily")}
                          className="tenant-filter-btn"
                          px={4}
                          py={2}
                          borderWidth={1}
                          borderColor={
                            timeFilter === "daily" ? primaryGreen : "#E2E8F0"
                          }
                          _hover={{
                            bg:
                              timeFilter === "daily" ? primaryGreen : "#e6ffe6",
                            color:
                              timeFilter === "daily" ? "white" : primaryGreen,
                          }}
                        >
                          Daily
                        </Button>
                        <Button
                          bg={
                            timeFilter === "weekly"
                              ? primaryGreen
                              : "transparent"
                          }
                          color={timeFilter === "weekly" ? "white" : "#21334a"}
                          onClick={() => setTimeFilter("weekly")}
                          className="tenant-filter-btn"
                          px={4}
                          py={2}
                          borderWidth={1}
                          borderColor={
                            timeFilter === "weekly" ? primaryGreen : "#E2E8F0"
                          }
                          _hover={{
                            bg:
                              timeFilter === "weekly"
                                ? primaryGreen
                                : "#e6ffe6",
                            color:
                              timeFilter === "weekly" ? "white" : primaryGreen,
                          }}
                        >
                          Weekly
                        </Button>
                        <Button
                          bg={
                            timeFilter === "monthly"
                              ? primaryGreen
                              : "transparent"
                          }
                          color={timeFilter === "monthly" ? "white" : "#21334a"}
                          onClick={() => setTimeFilter("monthly")}
                          className="tenant-filter-btn"
                          px={4}
                          py={2}
                          borderWidth={1}
                          borderColor={
                            timeFilter === "monthly" ? primaryGreen : "#E2E8F0"
                          }
                          _hover={{
                            bg:
                              timeFilter === "monthly"
                                ? primaryGreen
                                : "#e6ffe6",
                            color:
                              timeFilter === "monthly" ? "white" : primaryGreen,
                          }}
                        >
                          Monthly
                        </Button>
                        <Button
                          bg={
                            timeFilter === "yearly"
                              ? primaryGreen
                              : "transparent"
                          }
                          color={timeFilter === "yearly" ? "white" : "#21334a"}
                          onClick={() => setTimeFilter("yearly")}
                          className="tenant-filter-btn"
                          px={4}
                          py={2}
                          borderWidth={1}
                          borderColor={
                            timeFilter === "yearly" ? primaryGreen : "#E2E8F0"
                          }
                          _hover={{
                            bg:
                              timeFilter === "yearly"
                                ? primaryGreen
                                : "#e6ffe6",
                            color:
                              timeFilter === "yearly" ? "white" : primaryGreen,
                          }}
                        >
                          Yearly
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Flex>
                  <Box height="300px" width="100%">
                    {energyData.length > 0 ? (
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
                          <Tooltip
                            formatter={(value, name) => {
                              if (name === "energy") {
                                return [
                                  `${value} ${getEnergyUnit()}`,
                                  "Energy",
                                ];
                              }
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="energy"
                            fill={primaryGreen}
                            name="Energy"
                            radius={[5, 5, 0, 0]} // Rounded top corners of bars
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
                mb="100px" // Increased bottom margin to prevent cutoff due to navbar
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
                  {energyData.length > 0 ? (
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
                          onClick={() =>
                            handleRoomClick(item.roomId, item.name)
                          }
                          cursor="pointer"
                          _hover={{ bg: "#f9f9f9" }}
                          data-room-id={item.roomId}
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
                            bg={primaryGreen}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                            color={item.energy > 0 ? "white" : "#666"}
                          >
                            {item.energy} {getEnergyUnit()}
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
        </Box>
      )}
    </div>
  );
};

export default StatsTenant;
