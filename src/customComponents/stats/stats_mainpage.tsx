import { useState, useEffect } from 'react';
import { Text, Flex, Heading, Box, SimpleGrid, Button, ButtonGroup } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEnergySimulator } from './simulator.tsx';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './stats_mainpage.css';
import styled from 'styled-components';
import DownloadButton from './DownloadButton';


const Statistics = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(8456.4); // Initial value for stats
  const [energyData, setEnergyData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin
  const [rooms, setRooms] = useState([]);
  const [selectedHome, setSelectedHome] = useState(null);
  const { totalEnergy, deviceEnergies, loading } = useEnergySimulator();
  const [timeFilter, setTimeFilter] = useState('monthly'); // Default filter

  // Mock data for different time periods
  const mockData = {
    daily: [
      { name: 'Living Room', energy: 4.5, devices: 5 },
      { name: 'Bedroom', energy: 3.2, devices: 3 },
      { name: 'Kitchen', energy: 6.8, devices: 7 },
      { name: 'Bathroom', energy: 1.3, devices: 2 },
      { name: 'Office', energy: 5.2, devices: 4 },
    ],
    monthly: [
      { name: 'Living Room', energy: 135.0, devices: 5 },
      { name: 'Bedroom', energy: 96.0, devices: 3 },
      { name: 'Kitchen', energy: 204.0, devices: 7 },
      { name: 'Bathroom', energy: 39.0, devices: 2 },
      { name: 'Office', energy: 156.0, devices: 4 },
    ],
    yearly: [
      { name: 'Living Room', energy: 1642.5, devices: 5 },
      { name: 'Bedroom', energy: 1168.0, devices: 3 },
      { name: 'Kitchen', energy: 2482.0, devices: 7 },
      { name: 'Bathroom', energy: 474.5, devices: 2 },
      { name: 'Office', energy: 1898.0, devices: 4 },
    ]
  };

  // Load selected home from localStorage
  useEffect(() => {
    const storedSelectedHome = localStorage.getItem('selectedHome');
    if (storedSelectedHome) {
      const homeData = JSON.parse(storedSelectedHome);
      setSelectedHome(homeData);
      setIsAdmin(homeData.homeType === 'admin');
    }
  }, []);

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHome && selectedHome.hubCode) {
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
          setRooms(roomsData);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      }
    };

    fetchRooms();
  }, [selectedHome]);

  // Calculate energy data by room using device energies and room assignments
  useEffect(() => {
    // If hubCode is 'usecase1', use mock data based on time filter
    if (selectedHome && selectedHome.hubCode === 'usecase1') {
      setEnergyData(mockData[timeFilter]);
      return;
    }
    
    if (rooms.length > 0 && deviceEnergies && Object.keys(deviceEnergies).length > 0) {
      // Calculate energy for each room based on its devices
      const roomEnergyData = rooms.map(room => {
        // Sum up energy for all devices in this room
        const roomEnergy = room.devices.reduce((total, deviceId) => {
          return total + (deviceEnergies[deviceId] || 0);
        }, 0);

        return {
          name: room.roomName,
          energy: parseFloat(roomEnergy.toFixed(2)),
          devices: room.devices.length
        };
      });

      // Add "Other" category for devices not assigned to rooms
      const allRoomDevices = rooms.flatMap(room => room.devices);
      const otherDevicesEnergy = Object.entries(deviceEnergies).reduce((total, [deviceId, energy]) => {
        if (!allRoomDevices.includes(deviceId)) {
          return total + energy;
        }
        return total;
      }, 0);

      if (otherDevicesEnergy > 0) {
        roomEnergyData.push({
          name: 'Unassigned',
          energy: parseFloat(otherDevicesEnergy.toFixed(2)),
          devices: Object.keys(deviceEnergies).length - allRoomDevices.length
        });
      }

      // Sort by energy consumption (descending)
      roomEnergyData.sort((a, b) => b.energy - a.energy);
      
      setEnergyData(roomEnergyData);
    }
  }, [rooms, deviceEnergies, selectedHome, timeFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => prevValue + Math.random() * 10);
    }, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="homepageContainer" style={{ overflowX: 'hidden' }}>
      {/* Header */}
      <Box className="homepageHeader" bg={isAdmin ? '#0b13b0' : '#6cce58'}>
  <Flex justifyContent="space-between" alignItems="center" px="20px" py="20px">
    <Heading bg="transparent" fontWeight="extrabold" className="introHomepage" color= 'black'>
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
          {/* Energy Generation Chart */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white">
            <Flex direction="column" width="100%" p="15px">
              <Flex justifyContent="space-between" alignItems="center" mb="15px">
                <Heading 
                  textAlign="left" 
                  fontSize="xl" 
                  className="pinnedHeader" 
                  color="#21334a"
                >
                  Energy Consumed
                </Heading>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button 
                    colorScheme={timeFilter === 'daily' ? (isAdmin ? 'blue' : 'green') : 'gray'} 
                    onClick={() => setTimeFilter('daily')}
                  >
                    Daily
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'monthly' ? (isAdmin ? 'blue' : 'green') : 'gray'} 
                    onClick={() => setTimeFilter('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button 
                    colorScheme={timeFilter === 'yearly' ? (isAdmin ? 'blue' : 'green') : 'gray'} 
                    onClick={() => setTimeFilter('yearly')}
                  >
                    Yearly
                  </Button>
                </ButtonGroup>
              </Flex>
              <Box height="300px" width="100%">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fill: '#21334a', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#21334a', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energy" fill={isAdmin ? '#0b13b0' : '#6cce58'} name="Energy (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
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
              <SimpleGrid columns={1} gap={3}>
                {energyData.map((item, index) => (
                  <Flex 
                    key={index} 
                    bg="#f5f5f5" 
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
                      bg={isAdmin ? '#5764f7' : '#43eb7f'} 
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
            </Flex>
          </Box>
        </>
      )}
    </div>
  );
};

export default Statistics;