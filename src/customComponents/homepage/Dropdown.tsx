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
    <div style={{ background: 'transparent' }}>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            color={'gray.300'}
            borderRadius={20}
            minWidth="120px"  
            maxWidth="200px"  
            px={3}  
          >
            <HStack>
              <Heading fontSize="sm" whiteSpace="nowrap">
                {selectedItem}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent color={'#454545'}>
          {Object.entries(Homes).map(([key, value]) => (
            <MenuItem
              key={key}
              value={key}
              color={'inherit'}
              onClick={() => setSelectedItem(value)}
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