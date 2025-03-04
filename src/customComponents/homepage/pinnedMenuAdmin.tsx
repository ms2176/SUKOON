import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './pinnedMenu.css';
import { VscClose } from 'react-icons/vsc';
import MockUnits from './MockUnits.tsx'; // Ensure this component is compatible with units
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface PinnedMenuAdminProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Unit) => void; // Accepts a Unit object
  selectedHubCode: string;
  refreshPinnedMenu: () => void;
}

interface Unit {
  type: 'unit';
  id: string; // Map to unitId
  unitName: string;
  unitId: string; // Keep this if needed for other purposes
  hubCode: string;
  pinned: boolean;
}

const PinnedMenuAdmin: React.FC<PinnedMenuAdminProps> = ({ isVisible, onClose, onPinItem, selectedHubCode, refreshPinnedMenu }) => {
  const [units, setUnits] = useState<Unit[]>([]); // State to store units

  const fetchUnpinnedUnits = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const user = auth.currentUser;
    if (user && selectedHubCode) {
      try {
        // Fetch units associated with the selected hub
        const unitsRef = collection(db, "units");
        const unitsQuery = query(
          unitsRef,
          where("hubCode", "==", selectedHubCode),
          where("pinned", "==", false) // Only fetch unpinned items
        );
        const unitsSnapshot = await getDocs(unitsQuery);

        const unitsData: Unit[] = [];
        unitsSnapshot.forEach((doc) => {
          const data = doc.data();
          unitsData.push({
            type: 'unit',
            id: doc.id, // Use Firestore document ID
            unitId: data.unitId, // Include unitId
            unitName: data.unitName,
            hubCode: data.hubCode,
            pinned: data.pinned,
          });
        });
        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching unpinned units:", error);
      }
    }
  };

  const handleItemClick = async (unit: Unit) => {
    const db = getFirestore();
  
    try {
      if (!unit.id) {
        throw new Error("Unit ID is missing.");
      }
  
      const unitRef = doc(db, "units", unit.id);
      await updateDoc(unitRef, { pinned: true });
  
      // Notify the parent component that a unit has been pinned
      onPinItem({
        ...unit,
        id: unit.id,
      });
  
      // Remove the pinned unit from the local state
      setUnits((prevUnits) => prevUnits.filter((u) => u.id !== unit.id));
  
      // Do not call refreshPinnedMenu here to avoid re-fetching
    } catch (error) {
      console.error("Error pinning unit:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchUnpinnedUnits(); // Fetch unpinned units when the menu is opened
    }
  }, [isVisible, selectedHubCode]);

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
                <Flex wrap="wrap" justify="start" display={'flex'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} gapX={'10px'}>
                  {units.map((unit, index) => (
                    <Box key={`unit-${index}`} width={'calc(45%)'}>
                      <MockUnits
                        style={{ width: 'calc(100%)' }}
                        onClick={() => handleItemClick(unit)} // Pass the unit object
                        image={unit.unitImage} // Ensure MockUnits accepts unitImage
                        unitName={unit.unitName} // Ensure MockUnits accepts unitName
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default PinnedMenuAdmin;