import { useState, useEffect } from 'react';
import { Text, Flex, Heading, Box, SimpleGrid, Button, ButtonGroup } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Stats.css';
import DownloadButton from './DownloadButton';

const API_BASE_URL = 'https://api.sukoonhome.me'; // Base API URL

// Helper method to get week number
  // This is needed for the mockData creation
  declare global {
    interface Date {
      getWeek(): number;
    }
  }

// Define proper interfaces for all data structures
interface Device {
  device_type: string;
  device_id?: string;
  status?: boolean;
  energy_value?: number;
  unit?: string;
  usage_hours?: number;
}

interface RoomData {
  energy_value: number;
  unit: string;
  device_count: number;
  room_id?: string;
  devices: Device[];
}

interface TimeData {
  total_energy: number;
  unit: string;
  date?: string;
  month?: string;
  year?: string;
  week?: string;
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

interface Home {
  hubCode: string;
  [key: string]: any; // Add other properties as needed
}

interface ChartData {
  name: string;
  energy: number;
  devices: number;
}

interface LiveEnergyData {
  hub_id: string;
  hub_name: string;
  total_consumption: number;
  unit: string;
  active_devices: number;
  total_devices: number;
}

interface NewEndpointResponse {
  hub_code: string;
  date: string;
  total_energy: number;
  unit: string;
  rooms: Record<string, RoomData>;
}

const StatsTenant = () => {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly'); // Default filter
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load selected home from localStorage
  useEffect(() => {
    const storedSelectedHome = localStorage.getItem('selectedHome');
    if (storedSelectedHome) {
      const homeData = JSON.parse(storedSelectedHome);
      setSelectedHome(homeData);
    }
  }, []);

  // Fetch hub data from the API
  useEffect(() => {
    const fetchHubData = async () => {
      if (selectedHome && selectedHome.hubCode) {
        setLoading(true);
        setError(null);
        
        try {
          // First try the new endpoint format
          const response = await fetch(`${API_BASE_URL}/hubs/${selectedHome.hubCode}/energy/${timeFilter}`);
          
          if (response.ok) {
            // New endpoint format worked
            const data = await response.json() as NewEndpointResponse;
            
            // Map the new endpoint format to the expected format
            const formattedData: HubData = {
              hub_id: data.hub_code,
              hub_name: `Hub ${data.hub_code}`,
              hub_type: "tenant",
              energy_data: {
                [timeFilter]: {
                  total_energy: data.total_energy,
                  unit: data.unit,
                  date: data.date,
                  month: timeFilter === 'monthly' ? data.date?.split('-')[1] : undefined,
                  year: timeFilter === 'yearly' || timeFilter === 'monthly' ? data.date?.split('-')[0] : undefined,
                  week: timeFilter === 'weekly' ? data.date?.split('-')[1] : undefined,
                  rooms: data.rooms
                }
              } as unknown as EnergyData
            };
            
            setHubData(formattedData);
            processEnergyData(formattedData, timeFilter);
          } else {
            // Try the fallback endpoints - original format
            const fallbackEndpoint = `${API_BASE_URL}/hub/${selectedHome.hubCode}/energy`;
            const fallbackResponse = await fetch(fallbackEndpoint);
            
            if (!fallbackResponse.ok) {
              throw new Error(`API error: ${fallbackResponse.status}`);
            }
            
            const fallbackData = await fallbackResponse.json() as HubData;
            setHubData(fallbackData);
            processEnergyData(fallbackData, timeFilter);
          }
        } catch (error) {
          console.error('Error fetching hub data:', error);
          setError('Failed to load energy data. Please try again later.');
          
          // Try to load room data to show device information even if energy data fails
          try {
            const roomsResponse = await fetch(`${API_BASE_URL}/hubs/${selectedHome.hubCode}/rooms`);
            if (roomsResponse.ok) {
              const roomsData = await roomsResponse.json();
              const formattedRooms: Record<string, RoomData> = {};
              
              roomsData.forEach((room: { roomName: string | number; device_count: any; roomId: any; device_details: any; }) => {
                formattedRooms[room.roomName] = {
                  energy_value: 0, // Default to 0 since we couldn't get energy data
                  unit: "kWh",
                  device_count: room.device_count || 0,
                  room_id: room.roomId,
                  devices: room.device_details || []
                };
              });
              
              const mockData: HubData = {
                hub_id: selectedHome.hubCode,
                hub_name: `Hub ${selectedHome.hubCode}`,
                hub_type: "tenant",
                energy_data: {
                  daily: {
                    total_energy: 0,
                    unit: "kWh",
                    date: new Date().toISOString().split('T')[0],
                    rooms: formattedRooms
                  },
                  weekly: {
                    total_energy: 0,
                    unit: "kWh",
                    date: new Date().toISOString().split('T')[0],
                    week: new Date().getWeek().toString(),
                    rooms: formattedRooms
                  },
                  monthly: {
                    total_energy: 0,
                    unit: "kWh",
                    date: new Date().toISOString().split('T')[0],
                    month: (new Date().getMonth() + 1).toString(),
                    year: new Date().getFullYear().toString(),
                    rooms: formattedRooms
                  },
                  yearly: {
                    total_energy: 0,
                    unit: "kWh",
                    date: new Date().toISOString().split('T')[0],
                    year: new Date().getFullYear().toString(),
                    rooms: formattedRooms
                  }
                }
              };
              
              setHubData(mockData);
              processEnergyData(mockData, timeFilter);
            } else {
              setEnergyData([]);
            }
          } catch (roomError) {
            console.error('Error fetching room data:', roomError);
            setEnergyData([]);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHubData();
  }, [selectedHome, timeFilter]);

  
  
  Date.prototype.getWeek = function(): number {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
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
    const formattedData: ChartData[] = Object.entries(roomsData).map(([roomName, roomData]) => {
      return {
        name: roomName,
        energy: roomData.energy_value || 0,
        devices: roomData.device_count || 0
      };
    });

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
    navigate('/homepage');
  };

  // Function to get detailed room data
  const fetchRoomDetails = async (roomId: string) => {
    if (!roomId) return;
    
    try {
      // Try new endpoint format first
      const response = await fetch(`${API_BASE_URL}/room/${roomId}/energy`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Room details:', data);
      
      // Show room details in a toast notification
      toaster.create({
        description: `Room: ${data.room_name} - Energy: ${data.energy_data[timeFilter]?.total_energy || 0} kWh`,
        type: "info",
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching room details:', error);
      toaster.create({
        description: "Failed to load room details",
        type: "error",
      });
    }
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
    const headers = ['Room', 'Energy (kWh)', 'Devices'];
    const csvRows = [
      headers.join(','),
      ...energyData.map(item => [
        item.name,
        item.energy,
        item.devices
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `energy_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      return '';
    }

    const timeData = hubData.energy_data[timeFilter];
    
    switch (timeFilter) {
      case 'daily':
        return `Date: ${timeData.date || new Date().toISOString().split('T')[0]}`;
      case 'weekly':
        return `Week ${timeData.week || '1'}, ${timeData.year || new Date().getFullYear()}`;
      case 'monthly':
        return `Month ${timeData.month || new Date().getMonth() + 1}, ${timeData.year || new Date().getFullYear()}`;
      case 'yearly':
        return `Year ${timeData.year || new Date().getFullYear()}`;
      default:
        return '';
    }
  };

  // Function to get the total energy for the current period
  const getTotalEnergy = () => {
    if (!hubData || !hubData.energy_data || !hubData.energy_data[timeFilter]) {
      return '0';
    }
    
    return hubData.energy_data[timeFilter].total_energy;
  };

  // Function to get live energy data
  const fetchLiveEnergyData = async () => {
    if (!selectedHome || !selectedHome.hubCode) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/hubs/${selectedHome.hubCode}/live-energy`);
      if (response.ok) {
        const data = await response.json() as LiveEnergyData;
        toaster.create({
          description: `Current power consumption: ${data.total_consumption} ${data.unit} - Active devices: ${data.active_devices}/${data.total_devices}`,
          type: "info",
        });
      }
    } catch (error) {
      console.error('Error fetching live energy data:', error);
    }
  };

  return (
    <div className="homepageContainer" style={{ overflowX: 'hidden' }}>
      {/* Header */}
      <Box className="homepageHeader" bg='#6cce58'>
        <Flex justifyContent="space-between" alignItems="center" px="20px" py="20px">
          <Heading bg="transparent" fontWeight="extrabold" className="introHomepage" color="black">
            Your Statistics
          </Heading>
          <DownloadButton onClick={downloadReport} />
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
          <Button mt={4} colorScheme="green" onClick={() => window.location.reload()}>Retry</Button>
        </Box>
      ) : (
        <>
          {/* Energy Consumption Chart */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white">
            <Flex direction="column" width="100%" p="15px">
              <Flex direction="column" mb="15px">
                <Flex justifyContent="space-between" alignItems="center" mb="10px">
                  <Heading 
                    textAlign="left" 
                    fontSize="xl" 
                    className="pinnedHeader" 
                    color="#21334a"
                  >
                    Energy Consumed:
                  </Heading>
                  <Button 
                    size="sm" 
                    colorScheme="green" 
                    onClick={fetchLiveEnergyData}
                  >
                    Live Usage
                  </Button>
                </Flex>
                <Text color="#6cce58" fontWeight="medium" mb="15px">{getTimePeriodLabel()}</Text>
                <ButtonGroup size="sm" isAttached variant="outline" alignSelf="flex-start">
                  <Button 
                    colorScheme={timeFilter === 'daily' ? 'green' : 'gray'} 
                    onClick={() => setTimeFilter('daily')}
                    color="#21334a"
                    className="tenant-filter-btn"
                  >
                     Daily 
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'weekly' ? 'green' : 'gray'} 
                    onClick={() => setTimeFilter('weekly')}
                    color="#21334a"
                    className="tenant-filter-btn"
                  >
                    Weekly
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'monthly' ? 'green' : 'gray'} 
                    onClick={() => setTimeFilter('monthly')}
                    color="#21334a"
                    className="tenant-filter-btn"
                  >
                    Monthly
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'yearly' ? 'green' : 'gray'} 
                    onClick={() => setTimeFilter('yearly')}
                    color="#21334a"
                    className="tenant-filter-btn"
                  >
                    Yearly
                  </Button>
                </ButtonGroup>
              </Flex>
              <Box height="300px" width="100%">
                {energyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={energyData} 
                    barSize={20} 
                    margin={{ top: 20, right: 20, left: 5, bottom: 5 }}
                    barGap={5}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#21334a', fontSize: 12 }} 
                      height={60}
                      tickLine={false}
                      angle={-30}
                      textAnchor="end"
                      interval={0} 
                    />
                    <YAxis tick={{ fill: '#21334a', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energy" fill='#6cce58' name="Energy (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
                ) : (
                  <Flex height="100%" justifyContent="center" alignItems="center">
                    <Text color="#666">No energy data available for this time period</Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </Box>

          {/* Devices Per Room */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white" mb="30px">
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
                      onClick={() => {
                        // Find room_id from the hubData structure
                        const roomId = hubData?.energy_data[timeFilter]?.rooms[item.name]?.room_id;
                        if (roomId) {
                          fetchRoomDetails(roomId);
                        }
                      }}
                      cursor="pointer"
                      _hover={{ bg: "#f9f9f9" }}
                    >
                      <Box>
                        <Text fontWeight="medium" color="#21334a">{item.name}</Text>
                        <Text fontSize="sm" color="#666">{item.devices} devices</Text>
                      </Box>
                      <Text 
                        bg={item.energy > 0 ? '#43eb7f' : '#e0e0e0'}
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        fontSize="sm"
                        color={item.energy > 0 ? 'white' : '#666'}
                      >
                        {item.energy} kWh
                      </Text>
                    </Flex>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex justifyContent="center" alignItems="center" py={5}>
                  <Text color="#666">No device data available for this time period</Text>
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