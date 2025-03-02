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

interface Home {
  homeName: string;
  homeType: string;
}

interface DropdownProps {
  initialShow: string;
  homes: Home[];
  onSelect: (home: Home) => void; // Callback for when a hub is selected
}

const Dropdown: React.FC<DropdownProps> = ({ initialShow, homes, onSelect }) => {
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
            width="80%"
            px={3}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            <HStack width="100%" spaceX={2}>
              <Heading fontSize={{ base: '80%', sm: '90%', md: '100%' }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {selectedItem}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent color={'#454545'} width="100%" maxWidth="200px" p={3} borderRadius={'20px'} spaceY={2}>
          {homes.map((home) => (
            <MenuItem
              key={home.homeName}
              value={home.homeName}
              color={'inherit'}
              onClick={() => {
                setSelectedItem(home.homeName);
                onSelect(home); // Call the onSelect callback with the selected home
              }}
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {home.homeName}
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </div>
  );
};

export default Dropdown;