import { Heading, HStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { MdArrowDropDown } from "react-icons/md";

interface DropdownpinnedProps {
  initialShow: string; // Initial selected option ("All", "Rooms", or "Devices")
  onChange: (value: string) => void; // Callback for when the selected option changes
}

const Dropdownpinned: React.FC<DropdownpinnedProps> = ({ initialShow, onChange }) => {
  const [selectedItem, setSelectedItem] = useState<string>(initialShow);

  return (
    <div style={{ background: 'transparent', width: '100%' }}>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            color={'gray.300'}
            borderRadius={20}
            width="80%" // Adjust width as needed
            px={3} // Padding for better spacing
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} // Prevent text overflow
          >
            <HStack width="100%" spacing={2}>
              <Heading fontSize={{ base: '80%', sm: '90%', md: '100%' }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {selectedItem}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent color={'#454545'} width="100%" maxWidth="200px">
          {/* Static options: All, Rooms, and Devices */}
          <MenuItem
            value="All"
            color={'inherit'}
            onClick={() => {
              setSelectedItem('All');
              onChange('All');
            }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            All
          </MenuItem>
          <MenuItem
            value="Rooms"
            color={'inherit'}
            onClick={() => {
              setSelectedItem('Rooms');
              onChange('Rooms');
            }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Rooms
          </MenuItem>
          <MenuItem
            value="Devices"
            color={'inherit'}
            onClick={() => {
              setSelectedItem('Devices');
              onChange('Devices');
            }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Devices
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </div>
  );
};

export default Dropdownpinned;