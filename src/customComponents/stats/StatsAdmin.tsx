import { useState, useEffect } from 'react';
import { Text, Flex, Heading, Box, SimpleGrid, Button, ButtonGroup } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Stats.css';
import DownloadButton from './DownloadButton';

// Enhanced JSON data with fake data for all time periods
const hubData = {
  "hub_id": "GFM4Y",
  "hub_name": "Central Admin Hub",
  "hub_type": "admin",
  "energy_data": {
    "daily": {
      "total_energy": 11.6,
      "unit": "kWh",
      "date": "2025-03-18",
      "tenant_hubs": {
        "Apartment Building C": {
          "hub_id": "222iii",
          "energy_value": 11.6,
          "unit": "kWh"
        }
      }
    },
    "weekly": {
      "total_energy": 74.2,
      "unit": "kWh",
      "week": "11",
      "year": "2025",
      "tenant_hubs": {
        "Apartment Building A": {
          "hub_id": "111aaa",
          "energy_value": 28.7,
          "unit": "kWh"
        },
        "Apartment Building B": {
          "hub_id": "333ccc",
          "energy_value": 14.5,
          "unit": "kWh"
        },
        "Apartment Building C": {
          "hub_id": "222iii",
          "energy_value": 31.0,
          "unit": "kWh"
        }
      }
    },
    "monthly": {
      "total_energy": 284.3,
      "unit": "kWh",
      "month": "03",
      "year": "2025",
      "tenant_hubs": {
        "Apartment Building A": {
          "hub_id": "111aaa",
          "energy_value": 98.2,
          "unit": "kWh"
        },
        "Apartment Building B": {
          "hub_id": "333ccc",
          "energy_value": 56.4,
          "unit": "kWh"
        },
        "Apartment Building C": {
          "hub_id": "222iii",
          "energy_value": 87.6,
          "unit": "kWh"
        },
        "Commercial Building D": {
          "hub_id": "444ddd",
          "energy_value": 42.1,
          "unit": "kWh"
        }
      }
    },
    "yearly": {
      "total_energy": 3275.8,
      "unit": "kWh",
      "year": "2025",
      "tenant_hubs": {
        "Apartment Building A": {
          "hub_id": "111aaa",
          "energy_value": 876.3,
          "unit": "kWh"
        },
        "Apartment Building B": {
          "hub_id": "333ccc",
          "energy_value": 654.2,
          "unit": "kWh"
        },
        "Apartment Building C": {
          "hub_id": "222iii",
          "energy_value": 924.7,
          "unit": "kWh"
        },
        "Commercial Building D": {
          "hub_id": "444ddd",
          "energy_value": 478.9,
          "unit": "kWh"
        },
        "Office Complex E": {
          "hub_id": "555eee",
          "energy_value": 341.7,
          "unit": "kWh"
        }
      }
    }
  }
};

const StatsAdmin = () => {
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('daily'); // Default to daily since that's where we have data

  // Process energy data based on the time filter when component mounts or timeFilter changes
  useEffect(() => {
    setLoading(true);
    
    const processEnergyData = () => {
      const timeData = hubData.energy_data[timeFilter];
      
      if (timeData && timeData.tenant_hubs) {
        // Transform tenant_hubs data into the format expected by the chart
        const formattedData = Object.entries(timeData.tenant_hubs).map(([tenantName, tenantData]) => {
          return {
            name: tenantName,
            energy: tenantData.energy_value,
            hub_id: tenantData.hub_id
          };
        });

        // Sort by energy consumption (descending)
        formattedData.sort((a, b) => b.energy - a.energy);
        
        setEnergyData(formattedData);
      } else {
        setEnergyData([]);
      }
      
      setLoading(false);
    };

    processEnergyData();
  }, [timeFilter]);

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
    const headers = ['Tenant', 'Energy (kWh)', 'Hub ID'];
    const csvRows = [
      headers.join(','),
      ...energyData.map(item => [
        item.name,
        item.energy,
        item.hub_id
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
    const timeData = hubData.energy_data[timeFilter];
    
    if (!timeData) return '';
    
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

  // Get total energy value for the current time period
  const getTotalEnergy = () => {
    const timeData = hubData.energy_data[timeFilter];
    return timeData ? timeData.total_energy : 0;
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
          {/* Hub Information */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white">
            <Flex direction="column" width="100%" p="15px">
              <Heading 
                textAlign="left" 
                fontSize="xl" 
                className="pinnedHeader" 
                color="#21334a"
                mb="10px"
              >
                Hub Information
              </Heading>
              <Text color="#21334a" mb="5px">
                <strong>Hub ID:</strong> {hubData.hub_id}
              </Text>
              <Text color="#21334a" mb="5px">
                <strong>Hub Name:</strong> {hubData.hub_name}
              </Text>
              <Text color="#21334a" mb="15px">
                <strong>Hub Type:</strong> {hubData.hub_type}
              </Text>
            </Flex>
          </Box>

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
                  Energy Consumed: {getTotalEnergy()} {hubData.energy_data[timeFilter]?.unit || 'kWh'}
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

          {/* Tenant Hubs List */}
          <Box className="shadowPinned" mt="20px" mx="20px" borderRadius="10px" bg="white" mb="30px">
            <Flex direction="column" width="100%" p="15px">
              <Heading 
                textAlign="left" 
                fontSize="xl" 
                className="pinnedHeader" 
                color="#21334a" 
                mb="15px"
              >
                Tenant Hubs
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
                        <Text fontSize="sm" color="#666">Hub ID: {item.hub_id}</Text>
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
                  <Text color="#666">No tenant data available for this time period</Text>
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