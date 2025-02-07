import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import './pinnedMenu.css';
import { VscClose } from 'react-icons/vsc';
import MockUnits from './MockUnits.tsx'; // Ensure this component is compatible with units
import unitsdata from '@/JSONFiles/unitsdata.json'; // Import the units data

interface PinnedMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onPinItem: (item: Unit) => void; // Update the type to Unit
}

interface Unit {
  type: 'unit'; // Add a type discriminator
  unitName: string;
  unitImage: string;
}

const PinnedMenuAdmin: React.FC<PinnedMenuProps> = ({ isVisible, onClose, onPinItem }) => {
  if (!isVisible) return null;

  const handleItemClick = (index: number) => {
    const unit = unitsdata[index]; // Get the full unit object
    onPinItem({ type: 'unit', ...unit }); // Pass the unit object to the Homepage
  };

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
                {unitsdata.map((unit, index) => (
                <Box key={`unit-${index}`} width={'calc(45%)'}>
                    <MockUnits
                    style={{ width: 'calc(100%)' }}
                    onClick={() => handleItemClick(index)}
                    image={unit.unitImage}
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