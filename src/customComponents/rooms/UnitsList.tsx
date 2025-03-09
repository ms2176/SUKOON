import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Grid, Heading, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import NoImage from '@/images/noImage.png';

// Define the Unit type
interface Unit {
  id: string;
  unitName: string;
  hubCode: string;
  image?: string; // Optional field for unit image
}

const UnitsList: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the selected home from localStorage
  const selectedHome = localStorage.getItem('selectedHome')
    ? JSON.parse(localStorage.getItem('selectedHome') as string)
    : null;

  // Fetch units when the component mounts
  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedHome || !selectedHome.hubCode) {
        console.error('No selected home or hubCode found');
        setLoading(false);
        return;
      }

      const db = getFirestore();

      try {
        // Fetch the current hub document from the userHubs collection
        const currentHubRef = doc(db, 'userHubs', selectedHome.hubCode);
        const currentHubSnap = await getDoc(currentHubRef);

        if (currentHubSnap.exists()) {
          const currentHubData = currentHubSnap.data();
          const unitHubCodes = currentHubData.units || []; // Array of hubCodes for managed units

          // Fetch details for each unit hub
          const unitsData: Unit[] = [];
          for (const hubCode of unitHubCodes) {
            const unitHubRef = doc(db, 'userHubs', hubCode);
            const unitHubSnap = await getDoc(unitHubRef);

            if (unitHubSnap.exists()) {
              const unitHubData = unitHubSnap.data();
              unitsData.push({
                id: hubCode,
                unitName: unitHubData.unitName || 'Unnamed Unit',
                hubCode: hubCode,
                image: unitHubData.image || NoImage, // Use NoImage if no image is provided
              });
            } else {
              console.error(`Unit hub with hubCode ${hubCode} not found`);
            }
          }

          setUnits(unitsData);
        } else {
          console.error('Current hub not found');
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [selectedHome]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" minHeight="100vh" pb="90px">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading as="h1" size="lg" fontWeight="bold" color="#464646" fontSize="50px" className='unitshd'>
          Hi, Admin
        </Heading>
      </Flex>

      {/* "Your Units" Section */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h2" fontSize="32px" color="#464646">
          <Text as="span" fontWeight="normal">Your </Text>
          <Text as="span" fontWeight="bold">Units</Text>
        </Heading>
      </Flex>

      {/* Units Grid */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {units.map((unit) => (
          <Box
            key={unit.id}
            borderRadius="20px"
            overflow="hidden"
            bg="white"
            p={4}
            cursor="pointer"
            transition="all 0.3s ease-in-out"
            boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
            border="1px solid rgba(0, 0, 0, 0.08)"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f5f5f5',
            }}
            onClick={() => navigate(`/units/${unit.id}`)} // Navigate to unit details page
          >
            <Image
              src={unit.image || NoImage} // Use the image URL from Firestore or fallback
              alt={unit.unitName}
              borderRadius="12px"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Text fontWeight="bold" fontSize="lg" mt={4} color="#6cce58">
              {unit.unitName}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Hub Code: {unit.hubCode}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default UnitsList;