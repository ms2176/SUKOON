import { useState, useEffect } from 'react';
import { Text, Flex, HStack, Heading, SimpleGrid, Box, Button,  } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import {
  StatHelpText,
  StatLabel,
  StatRoot,
  StatUpTrend,
  StatValueText,
} from "@/components/ui/stat";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './stats_mainpage.css'; // Import the CSS file


interface DemoProps {
  label: string;
  value: number;
  trend: string;
  helpText: string;
}

const Demo = ({ label, value, trend, helpText }: DemoProps) => {
  return (
    <StatRoot>
      <StatLabel>{label}</StatLabel>
      <HStack>
        <StatValueText
          value={value}
          formatOptions={{ style: "currency", currency: "USD" }}
        />
        <StatUpTrend>{trend}</StatUpTrend>
      </HStack>
      <StatHelpText>{helpText}</StatHelpText>
    </StatRoot>
  );
};

const Statistics = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [value, setValue] = useState(8456.4); // Initial value

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the value here. For example, incrementing by a random number.
      setValue(prevValue => prevValue + Math.random() * 10000);}, 120000); // 120000 milliseconds = 2 minutes
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const goToAuth = () => {
    navigate('/'); // Navigate to Auth page
  };

  return (
    <div style={{ overflowX: 'hidden' }}> {/* Prevent horizontal scrolling */}      
      <Button
            borderRadius={200}
            width="30px"
            height="40px"
            display={'flex'}
            bg={'#43eb7f'}
            position="relative"
            left="-15%"
            boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'
            onClick={goToAuth} // Add onClick to navigate back
          >
            <Text color={'black'}>&lt;</Text>

          </Button>
          
          <Flex justifyContent="space-between" alignItems="center" padding={5}>
        <Heading textAlign="left" color={'black'}>
          Your Usage
        </Heading>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toaster.create({
              description: "File saved successfully",
              type: "info",
            })
          }
        >
          Download Report
        </Button>
      </Flex>

      <SimpleGrid columns={2} gap={4} padding={5}>
        <Box className="statisticsBox">
          <Demo label="Unique Users" value={value} trend="12%" helpText="since last month" />
        </Box>
        <Box className="statisticsBox">
          <Demo label="Page Views" value={value} trend="-5%" helpText="since last month" />
        </Box>
        <Box className="statisticsBox">
          <Demo label="New Signups" value={value} trend="12.45%" helpText="since last month" />
        </Box>
        <Box className="statisticsBox">
          <Demo label="Revenue" value={value} trend="8.99%" helpText="since last month" />
        </Box>
      </SimpleGrid>

      <Flex> 
          <Heading textAlign="center" width="100%" color={'black'}>
            Device By Room
          </Heading>
        </Flex>

      <SimpleGrid columns={1} gap={1} padding={5}>
        <Box className="usagePerRoomBox">
        <Text textStyle="md">Living Room</Text>
        <Text textStyle="xs">5 devices</Text>
        </Box>
        <Box className="usagePerRoomBox">
        <Text textStyle="md">Kitchen</Text>
        <Text textStyle="xs">10 devices</Text>
        </Box>
        <Box className="usagePerRoomBox">
        <Text textStyle="md">Master Bedroom</Text>
        <Text textStyle="xs">5 devices</Text>
        </Box>
        <Box className="usagePerRoomBox">
        <Text textStyle="md">Kids Bathroom</Text>
        <Text textStyle="xs">5 devices</Text>
        </Box>
        <Box className="usagePerRoomBox">
        <Text textStyle="md">Kids Bedroom</Text>
        <Text textStyle="xs">9 devices</Text>
        </Box>
      </SimpleGrid>
    </div>
  );
};

export default Statistics;