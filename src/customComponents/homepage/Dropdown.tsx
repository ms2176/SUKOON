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
            minWidth="120px"  // Set minimum width to prevent shrinking
            maxWidth="200px"  // Limit maximum width
            px={3}  // Add horizontal padding to prevent a squeezed look
          >
            <HStack >
              <Heading fontSize="sm" whiteSpace="nowrap">
                {selectedItem}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent color={'#454545'}>
          <MenuItem value="new-txt" color={'inherit'} onClick={() => setSelectedItem("New Text File")}>
            New Text File
          </MenuItem>
          <MenuItem value="new-file" color={'inherit'} onClick={() => setSelectedItem("New File...")}>
            New File...
          </MenuItem>
          <MenuItem value="new-win" color={'inherit'} onClick={() => setSelectedItem("New Window")}>
            New Window
          </MenuItem>
          <MenuItem value="open-file" color={'inherit'} onClick={() => setSelectedItem("Open File...")}>
            Open File...
          </MenuItem>
          <MenuItem value="export" color={'inherit'} onClick={() => setSelectedItem("Export")}>
            Export
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </div>
  );
};

export default Dropdown;
