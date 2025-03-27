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
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./Stats.css";

// Add TypeScript interfaces
interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface ChartData {
  name: string;
  energy: number;
  hubCode: string;
}

interface TenantHubData {
  hub_id: string;
  energy_value: number;
  unit: string;
}

interface TimeData {
  total_energy: number;
  unit: string;
  date?: string;
  week?: string;
  month?: string;
  year?: string;
  tenant_hubs: Record<string, TenantHubData>;
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

const StatsAdmin = () => {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState("monthly"); // Default filter
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For individual API calls
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>("");
  const timerRef = useRef<number | null>(null);

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

  // Fetch hub data from API
  useEffect(() => {
    const fetchHubData = async () => {
      if (selectedHome && selectedHome.hubCode) {
        setLoading(true);
        setIsLoading(true);

        try {
          const apiUrl = `https://testing.sukoonhome.me/admin-hub/${selectedHome.hubCode}/energy`;

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
  }, [selectedHome]); // Only fetch when selectedHome changes

  // Refresh data function
  const refreshData = async () => {
    if (selectedHome && selectedHome.hubCode) {
      setIsLoading(true);

      try {
        const apiUrl = `https://testing.sukoonhome.me/admin-hub/${selectedHome.hubCode}/energy`;

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
    if (
      !hubData ||
      !hubData.energy_data ||
      !hubData.energy_data[timeFilter as keyof EnergyData]
    ) {
      setEnergyData([]);
      return;
    }

    const timeData = hubData.energy_data[timeFilter as keyof EnergyData];
    const tenantHubsData = timeData.tenant_hubs;

    if (!tenantHubsData) {
      setEnergyData([]);
      return;
    }

    // Transform tenant_hubs data into the format expected by the chart
    const formattedData = Object.entries(tenantHubsData).map(
      ([tenantName, tenantData]) => {
        return {
          name: tenantName,
          energy: tenantData.energy_value,
          hubCode: tenantData.hub_id,
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
    const headers = ["Unit", "Energy (kWh)", "Hub Code"];
    const csvRows = [
      headers.join(","),
      ...energyData.map((item) =>
        [item.name, item.energy, item.hubCode].join(",")
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

  // Get total energy value for the current time period
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

  // Get energy unit
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
          px="20px"
          py="20px"
        >
          <Heading
            bg="transparent"
            fontWeight="extrabold"
            className="introHomepage"
            color="#4A5568"
          >
            Building Statistics
          </Heading>
          <IconButton
            aria-label="Download report"
            onClick={downloadReport}
            size="md"
            variant="ghost"
            colorScheme="blue"
          >
            <FiDownload color="#0b13b0" />
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
          <Spinner color="#0b13b0" size="xl" margin="0 0 16px 0" />
          <Text>Loading energy data...</Text>
        </Flex>
      ) : errorMessage ? (
        <Box textAlign="center" py={10} color="red.500">
          <Text>{errorMessage}</Text>
          <Button
            mt={4}
            colorScheme="blue"
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
                <Spinner color="#0b13b0" size="xl" />
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
                    <Text color="#0b13b0" fontWeight="medium">
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
                      colorScheme="blue"
                    >
                      <FiRefreshCcw color="#0b13b0" size={"190%"} />
                    </IconButton>
                  </Flex>
                </Flex>
                <Box width="100%" overflow="auto" pb={3}>
                  <ButtonGroup
                    size="sm"
                    variant="outline"
                    alignSelf="flex-start"
                    spacing={3}
                  >
                    <Button
                      bg={timeFilter === "daily" ? "#0b13b0" : "transparent"}
                      color={timeFilter === "daily" ? "white" : "#21334a"}
                      onClick={() => setTimeFilter("daily")}
                      className="admin-filter-btn"
                      px={4}
                      py={2}
                      borderWidth={1}
                      borderColor={
                        timeFilter === "daily" ? "#0b13b0" : "#E2E8F0"
                      }
                      _hover={{
                        bg: timeFilter === "daily" ? "#0b13b0" : "#e6e9ff",
                        color: timeFilter === "daily" ? "white" : "#0b13b0",
                      }}
                    >
                      Daily
                    </Button>
                    <Button
                      bg={timeFilter === "weekly" ? "#0b13b0" : "transparent"}
                      color={timeFilter === "weekly" ? "white" : "#21334a"}
                      onClick={() => setTimeFilter("weekly")}
                      className="admin-filter-btn"
                      px={4}
                      py={2}
                      borderWidth={1}
                      borderColor={
                        timeFilter === "weekly" ? "#0b13b0" : "#E2E8F0"
                      }
                      _hover={{
                        bg: timeFilter === "weekly" ? "#0b13b0" : "#e6e9ff",
                        color: timeFilter === "weekly" ? "white" : "#0b13b0",
                      }}
                    >
                      Weekly
                    </Button>
                    <Button
                      bg={timeFilter === "monthly" ? "#0b13b0" : "transparent"}
                      color={timeFilter === "monthly" ? "white" : "#21334a"}
                      onClick={() => setTimeFilter("monthly")}
                      className="admin-filter-btn"
                      px={4}
                      py={2}
                      borderWidth={1}
                      borderColor={
                        timeFilter === "monthly" ? "#0b13b0" : "#E2E8F0"
                      }
                      _hover={{
                        bg: timeFilter === "monthly" ? "#0b13b0" : "#e6e9ff",
                        color: timeFilter === "monthly" ? "white" : "#0b13b0",
                      }}
                    >
                      Monthly
                    </Button>
                    <Button
                      bg={timeFilter === "yearly" ? "#0b13b0" : "transparent"}
                      color={timeFilter === "yearly" ? "white" : "#21334a"}
                      onClick={() => setTimeFilter("yearly")}
                      className="admin-filter-btn"
                      px={4}
                      py={2}
                      borderWidth={1}
                      borderColor={
                        timeFilter === "yearly" ? "#0b13b0" : "#E2E8F0"
                      }
                      _hover={{
                        bg: timeFilter === "yearly" ? "#0b13b0" : "#e6e9ff",
                        color: timeFilter === "yearly" ? "white" : "#0b13b0",
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
                      margin={{ top: 20, right: 20, left: 40, bottom: 5 }}
                      barGap={5}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#21334a", fontSize: 10 }}
                        height={60}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        scale="point"
                        interval={0}
                        padding={{ left: 30, right: 30 }}
                      />
                      <YAxis
                        tick={{ fill: "#21334a", fontSize: 12 }}
                        width={40}
                        axisLine={{ strokeWidth: 1 }}
                        tickLine={{ strokeWidth: 1 }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "energy") {
                            return [`${value} ${getEnergyUnit()}`, "Energy"];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="energy"
                        fill="#0b13b0"
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

          {/* Units Energy Consumption */}
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
                Energy by Unit
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
                    >
                      <Box>
                        <Text fontWeight="medium" color="#21334a">
                          {item.name}
                        </Text>
                        <Text fontSize="sm" color="#666">
                          Hub Code: {item.hubCode}
                        </Text>
                      </Box>
                      <Text
                        bg="#5764f7"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        color="white"
                      >
                        {item.energy} {getEnergyUnit()}
                      </Text>
                    </Flex>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex justifyContent="center" alignItems="center" py={5}>
                  <Text color="#666">
                    No unit data available for this time period
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

export default StatsAdmin;
