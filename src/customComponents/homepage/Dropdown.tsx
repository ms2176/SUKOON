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

interface DropdownProps {
  initialShow: string;
}

const Homes = {
  Home1: 'Myhome1',
  Home2: 'Myhome2',
  Home3: 'Myhome3',
  Home4: 'Myhome4',
  Home5: 'Myhome5',
  Home6: 'Myhome6',
};

const Dropdown: React.FC<DropdownProps> = ({ initialShow }) => {
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
            width="80%" // Full width of the parent container
            px={3} // Padding for better spacing
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} // Prevent text overflow
          >
            <HStack width="100%" spaceX={2}>
              <Heading fontSize={{ base: '80%', sm: '90%', md: '100%' }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {selectedItem}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent color={'#454545'} width="100%" maxWidth="200px">
          {Object.entries(Homes).map(([key, value]) => (
            <MenuItem
              key={key}
              value={key}
              color={'inherit'}
              onClick={() => setSelectedItem(value)}
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} // Prevent text overflow
            >
              {value}
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </div>
  );
};

export default Dropdown;