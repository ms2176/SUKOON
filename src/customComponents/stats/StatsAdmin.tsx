import { useState, useEffect } from 'react';
import { Text, Flex, Heading, Box, SimpleGrid, Button, ButtonGroup } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './Stats.css';
import DownloadButton from './DownloadButton';

// Import the JSON data
import energyStatsData from './hub-rooms-main-view.json';

const StatsAdmin = () => {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState([]);
  const [selectedHome, setSelectedHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly'); // Default filter
  const [hubData, setHubData] = useState(null);

  // Load selected home from localStorage
  useEffect(() => {
    const storedSelectedHome = localStorage.getItem('selectedHome');
    if (storedSelectedHome) {
      const homeData = JSON.parse(storedSelectedHome);
      setSelectedHome(homeData);
    }
  }, []);

  // Fetch hub data and validate with Firebase
  useEffect(() => {
    const fetchHubData = async () => {
      if (selectedHome && selectedHome.hubCode) {
        setLoading(true);
        
        // First check if the hubCode matches any hub_id in the JSON data
        const matchingHub = energyStatsData.hub_id === selectedHome.hubCode;
        
        if (matchingHub) {
          // If matched, set the hub data
          setHubData(energyStatsData);
          processEnergyData(energyStatsData, timeFilter);
        } else {
          // If not matched in JSON, check Firebase
          const db = getFirestore();
          const roomsRef = collection(db, 'rooms');
          const roomsQuery = query(roomsRef, where('hubCode', '==', selectedHome.hubCode));

          try {
            const querySnapshot = await getDocs(roomsQuery);
            const roomsData = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              roomsData.push({
                id: doc.id,
                roomName: data.roomName,
                devices: data.devices || []
              });
            });
            
            // Use Firebase data if available
            if (roomsData.length > 0) {
              // Process Firebase data (keeping your existing logic)
              const roomEnergyData = roomsData.map(room => {
                return {
                  name: room.roomName,
                  energy: 0, // You'll need to modify this based on your needs
                  devices: room.devices.length
                };
              });
              setEnergyData(roomEnergyData);
            } else {
              // No data found in either source
              setEnergyData([]);
            }
          } catch (error) {
            console.error('Error fetching rooms:', error);
            setEnergyData([]);
          }
        }
        
        setLoading(false);
      }
    };

    fetchHubData();
  }, [selectedHome, timeFilter]);

  // Process energy data based on the time filter
  const processEnergyData = (hubData, timeFilter) => {
    if (!hubData || !hubData.energy_data || !hubData.energy_data[timeFilter]) {
      setEnergyData([]);
      return;
    }

    const timeData = hubData.energy_data[timeFilter];
    const roomsData = timeData.rooms;
    
    if (!roomsData) {
      setEnergyData([]);
      return;
    }

    // Transform rooms data into the format expected by the chart
    const formattedData = Object.entries(roomsData).map(([roomName, roomData]) => {
      return {
        name: roomName,
        energy: roomData.energy_value,
        devices: roomData.device_count
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
        return `Date: ${timeData.date}`;
      case 'weekly':
        return `Week ${timeData.week}, ${timeData.year}`;
      case 'monthly':
        return `Month ${timeData.month}, ${timeData.year}`;
      case 'yearly':
        return `Year ${timeData.year}`;
      default:
        return '';
    }
  };

  return (
    <div className="homepageContainer" style={{ overflowX: 'hidden' }}>
      {/* Header */}
      <Box className="homepageHeader" bg='#0b13b0'>
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
      ) : (
        <>
          {/* Energy Consumption Chart */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white">
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
                <Text color="#0b13b0" fontWeight="medium" mb="15px">{getTimePeriodLabel()}</Text>
                <ButtonGroup size="sm" isAttached variant="outline" alignSelf="flex-start">
                  <Button 
                    colorScheme={timeFilter === 'daily' ? 'blue' : 'gray'} 
                    onClick={() => setTimeFilter('daily')}
                    color="#21334a"
                    className="admin-filter-btn"
                  >
                    Daily
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'weekly' ? 'blue' : 'gray'} 
                    onClick={() => setTimeFilter('weekly')}
                    color="#21334a"
                    className="admin-filter-btn"
                  >
                    Weekly
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'monthly' ? 'blue' : 'gray'} 
                    onClick={() => setTimeFilter('monthly')}
                    color="#21334a"
                    className="admin-filter-btn"
                  >
                    Monthly
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'yearly' ? 'blue' : 'gray'} 
                    onClick={() => setTimeFilter('yearly')}
                    color="#21334a"
                    className="admin-filter-btn"
                  >
                    Yearly
                  </Button>
                </ButtonGroup>
              </Flex>
              <Box height="300px" width="100%">
                {energyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#21334a', fontSize: 10 }} 
                        height={60}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        scale="point"
                        interval={0}
                      />
                      <YAxis tick={{ fill: '#21334a', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="energy" fill='#0b13b0' name="Energy (kWh)" />
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
                    >
                      <Box>
                        <Text fontWeight="medium" color="#21334a">{item.name}</Text>
                        <Text fontSize="sm" color="#666">{item.devices} devices</Text>
                      </Box>
                      <Text 
                        bg='#5764f7'
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        fontSize="sm"
                        color="white"
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

export default StatsAdmin;