import { Box, Flex, Heading, HStack, Stack, Image, Text, Grid } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './pinnedMenu.css';
import { VscClose } from 'react-icons/vsc';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NoImage from '@/images/noImage.png'; // Default image for units

interface PinnedMenuAdminProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Unit) => void; // Accepts a Unit object
  selectedHubCode: string;
  refreshPinnedMenu: () => void;
}

interface Unit {
  type: 'unit';
  id: string;
  unitName: string;
  hubCode: string;
  pinned: boolean;
  image?: string; // Optional field for unit image
}

const PinnedMenuAdmin: React.FC<PinnedMenuAdminProps> = ({ isVisible, onClose, onPinItem, selectedHubCode, refreshPinnedMenu }) => {
  const [units, setUnits] = useState<Unit[]>([]); // State to store units 

  

  // Fetch all units attached to the selected admin hub
  const fetchUnits = async () => {
    const auth = getAuth();
    const db = getFirestore();
  
    if (!selectedHubCode) return;
  
    try {
      // Get admin hub document
      const adminHubRef = doc(db, 'userHubs', selectedHubCode);
      const adminHubDoc = await getDoc(adminHubRef);
  
      if (!adminHubDoc.exists() || adminHubDoc.data()?.homeType !== 'admin') {
        setUnits([]);
        return;
      }
      
      const unitHubCodes = adminHubDoc.data().units || [];
      
      // Exit if no units available
      if (unitHubCodes.length === 0) {
        setUnits([]);
        return;
      }
  
      // Fetch tenant hubs using hubCodes
      const userHubsRef = collection(db, 'userHubs');
      const pinnedUnitsQuery = query(
        collection(db, 'userHubs'),
        where('hubCode', 'in', unitHubCodes),
        where('pinned', '==', false)
      );
  
      const unitsSnapshot = await getDocs(pinnedUnitsQuery);
      
      const unitsData = unitsSnapshot.docs.map(doc => ({
        type: 'unit' as const, // Explicitly set the type
        id: doc.id,
        unitName: doc.data().homeName,
        hubCode: doc.data().hubCode,
        pinned: doc.data().pinned || false,
        image: doc.data().image || NoImage,
      }));
  
      setUnits(unitsData);
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [selectedHubCode]);
  

  // Handle pinning a unit
  const handleItemClick = async (unit: Unit) => {
    const db = getFirestore();
  
    await updateDoc(doc(db, 'userHubs', unit.id), { 
      pinned: true 
    });
    
    // Add to pinned items
    onPinItem({
      type: 'unit',
      id: unit.id,
      unitName: unit.unitName,
      hubCode: unit.hubCode,
      pinned: true,
      image: unit.image
    });
  };

  if (!isVisible) return null;

  return (
    <div style={{ overflow: 'hidden' }}>
      <Flex
        position="fixed"
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        zIndex={10}
        display={'flex'}
      >
        <Box
          width="95%"
          height="50vh"
          borderColor="#21334a"
          borderRadius={20}
          position="fixed"
          left="50%"
          top="50%"
          transform={'translate(-50%, -50%)'}
          className="pinBox"
          zIndex={10}
        >
          <Stack bg={'transparent'} className="editStack" spaceY={'20px'}>
            <HStack bg={'transparent'} spaceX={'50%'}>
              <Heading className="addPinnedItem" whiteSpace={'nowrap'}>Pin Units</Heading>
              <Box bg={'transparent'}>
                <VscClose color="#21334a" style={{ background: 'transparent' }} onClick={onClose} />
              </Box>
            </HStack>

            <Box
              bg={'white'}
              width="95%"
              height="30vh"
              borderColor="#21334a"
              borderRadius={20}
              borderWidth={2}
              position="absolute"
              top="60%"
              left="50%"
              transform="translate(-50%, -50%)"
              overflow={'hidden'}
            >
              <Box width={'100%'} height={'100%'} overflow={'scroll'}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
                  {units.map((unit) => (
                    <Box
                      key={unit.id}
                      borderRadius="20px"
                      overflow="hidden"
                      bg="white"
                      p={3} // Reduced padding
                      cursor="pointer"
                      transition="all 0.3s ease-in-out"
                      boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
                      border="1px solid rgba(0, 0, 0, 0.08)"
                      _hover={{
                        transform: 'translateY(-5px)',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f5f5f5',
                      }}
                      onClick={() => handleItemClick(unit)}
                      height="180px" // Slightly reduced height
                    >
                      <Image
                        src={unit.image || NoImage}
                        alt={unit.unitName}
                        borderRadius="12px"
                        objectFit="cover"
                        width="100%"
                        height="90px" // Reduced image height
                      />
                      <Text fontWeight="bold" fontSize="md" mt={2} color="#6cce58"> {/* Reduced font size */}
                        {unit.unitName}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Unit
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenuAdmin;