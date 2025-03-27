import { Heading, HStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
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
  hubCode: string;
}

interface DropdownProps {
  homes: Home[];
  onSelect: (home: Home) => void;
  initialShow?: string;
  autoSelectFirstHome?: boolean; // New prop to enable auto-selection
}

const Dropdown: React.FC<DropdownProps> = ({
  homes,
  onSelect,
  initialShow,
  autoSelectFirstHome = true, // Default to true
}) => {
  const [selectedHome, setSelectedHome] = useState(initialShow || "");

  useEffect(() => {
    // Auto-select logic
    if (autoSelectFirstHome && homes.length > 0 && !selectedHome) {
      // First, try to select a tenant hub
      const tenantHub = homes.find((home) => home.homeType === "tenant");

      // If no tenant hub, then select the first admin hub
      const homeToSelect = tenantHub || homes[0];

      if (homeToSelect) {
        setSelectedHome(homeToSelect.homeName);
        onSelect(homeToSelect);
      }
    }
  }, [homes, selectedHome, autoSelectFirstHome, onSelect]);

  useEffect(() => {
    // Update selected home when homes change
    if (initialShow) {
      setSelectedHome(initialShow);
    }
  }, [homes, initialShow]);

  const handleSelect = (home: Home) => {
    setSelectedHome(home.homeName);
    onSelect(home);
  };

  return (
    <div
      key={homes.length}
      style={{ background: "transparent", width: "100%" }}
    >
      <MenuRoot>
        <MenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            color={"gray.300"}
            borderRadius={20}
            width="80%"
            px={3}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <HStack width="100%" spaceX={2}>
              <Heading
                fontSize={{ base: "80%", sm: "90%", md: "100%" }}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {selectedHome ||
                  (homes.length > 0 ? "Select a home" : "No homes available")}
              </Heading>
              <MdArrowDropDown />
            </HStack>
          </Button>
        </MenuTrigger>

        <MenuContent
          color={"#454545"}
          width="100%"
          maxWidth="200px"
          p={3}
          borderRadius={"20px"}
          spaceY={2}
        >
          {homes.map((home) => (
            <MenuItem
              key={home.homeName}
              value={home.homeName}
              color={"inherit"}
              onClick={() => {
                setSelectedHome(home.homeName);
                onSelect(home);
              }}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
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
