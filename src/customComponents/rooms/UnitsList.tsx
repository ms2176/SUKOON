import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Grid, Heading, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import NoImage from '@/images/noImage.png';
import AddUnit from './AddUnit';

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
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false); // State to track delete mode

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
        // Query the userHubs collection to find the document with the matching hubCode
        const userHubsRef = collection(db, 'userHubs');
        const q = query(userHubsRef, where('hubCode', '==', selectedHome.hubCode));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const currentHubDoc = querySnapshot.docs[0];
          const currentHubData = currentHubDoc.data();
    
          // Ensure the selected hub is an admin hub
          if (currentHubData.homeType !== 'admin') {
            console.error('Selected hub is not an admin hub.');
            setLoading(false);
            return;
          }
    
          const unitHubCodes = currentHubData.units || []; // Array of hubCodes for managed units
    
          // Fetch details for each unit hub
          const unitsData: Unit[] = [];
          for (const hubCode of unitHubCodes) {
            const unitQuery = query(userHubsRef, where('hubCode', '==', hubCode));
            const unitSnapshot = await getDocs(unitQuery);
    
            if (!unitSnapshot.empty) {
              const unitDoc = unitSnapshot.docs[0];
              const unitData = unitDoc.data();
              unitsData.push({
                id: unitDoc.id,
                unitName: unitData.unitName || 'Unnamed Unit',
                hubCode: hubCode,
                image: unitData.image || NoImage, // Use NoImage if no image is provided
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

  // Function to delete a unit
  const handleDeleteUnit = async (unitId: string) => {
    const db = getFirestore();
  
    try {
      // Step 1: Get the selected home from localStorage
      const selectedHome = localStorage.getItem('selectedHome')
        ? JSON.parse(localStorage.getItem('selectedHome') as string)
        : null;
  
      if (!selectedHome || !selectedHome.hubCode) {
        alert('No admin hub selected. Please select an admin hub first.');
        return;
      }
  
      console.log('Selected Home:', selectedHome); // Debugging
  
      // Step 2: Query the userHubs collection to find the admin hub document with the matching hubCode
      const userHubsRef = collection(db, 'userHubs');
      const q = query(userHubsRef, where('hubCode', '==', selectedHome.hubCode));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        alert('Admin hub not found. Please try again.');
        return;
      }
  
      // Step 3: Get the admin hub document
      const adminHubDoc = querySnapshot.docs[0]; // There should only be one document with this hubCode
      const adminHubData = adminHubDoc.data();
  
      // Ensure the selected hub is an admin hub
      if (adminHubData.homeType !== 'admin') {
        alert('Selected hub is not an admin hub.');
        return;
      }
  
      // Step 4: Get the current units array
      const currentUnits = adminHubData.units || [];
  
      // Step 5: Remove the unit's hubCode from the units array
      const updatedUnits = currentUnits.filter((hubCode: string) => hubCode !== unitId);
  
      // Step 6: Update the admin hub document
      await updateDoc(adminHubDoc.ref, {
        units: updatedUnits,
      });
  
      // Step 7: Update the local state to reflect the change
      setUnits((prevUnits) => prevUnits.filter((unit) => unit.hubCode !== unitId));
  
      alert('Unit removed successfully.');
    } catch (error) {
      console.error('Error removing unit:', error);
      alert('Failed to remove unit. Please try again.');
    }
  };

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
        {/* Rounded Box with + and - Buttons */}
        <Flex
          bg='#0b13b0'
          borderRadius="full"
          boxShadow="md"
          overflow="hidden"
          alignItems="center"
        >
          <Button
            bg="transparent"
            color="white"
            px={6}
            py={2}
            fontSize="md"
            _hover={{ bg: '#4a6fe3' }}
            onClick={() => setShowAddUnit(true)}
          >
            +
          </Button>
          <Button
            bg="transparent"
            color="white"
            px={6}
            py={2}
            fontSize="md"
            _hover={{ bg: '#4a6fe3' }}
            onClick={() => setDeleteMode(!deleteMode)}
          >
            -
          </Button>
        </Flex>
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
            border={`1px solid ${deleteMode ? 'red' : 'rgba(0, 0, 0, 0.08)'}`}
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
              //backgroundColor: '#f5f5f5',
            }}
            onClick={() => {
              if (deleteMode) {
                handleDeleteUnit(unit.hubCode); // Pass the hubCode to delete
              } else {
                navigate(`/units/${unit.id}`);
              }
            }}
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

      {showAddUnit && (
        <AddUnit
          onClose={() => setShowAddUnit(false)}
        />
      )}
    </Box>
  );
};

export default UnitsList;