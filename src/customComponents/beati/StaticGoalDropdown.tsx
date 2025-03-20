import React, { useState, useEffect } from 'react';
import { Button, HStack, Heading } from '@chakra-ui/react';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from '@/components/ui/menu';
import { MdArrowDropDown } from 'react-icons/md';

interface StaticGoalDropdownProps {
  totalEnergySavingGoal: number;
  totalCostGoal: number;
  totalCarbonSavingGoal: number;
  initialOption?: string;
  onSelect?: (selectedOption: string) => void;
}

const StaticGoalDropdown: React.FC<StaticGoalDropdownProps> = ({
  totalEnergySavingGoal,
  totalCostGoal,
  totalCarbonSavingGoal,
  initialOption,
  onSelect,
}) => {
  const options = [
    { label: 'Total Energy Conservation Goal', value: `${totalEnergySavingGoal} kW` },
    { label: 'Total Cost Goal', value: `$${totalCostGoal}` },
    { label: 'Total Carbon Savings Goal', value: `${totalCarbonSavingGoal} kg` },
  ];

  const defaultOption =
    options.find((opt) => opt.label === initialOption) || options[0];
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option.label);
    }
  };

  useEffect(() => {
    // Update selected option when props change
    const newOptions = [
      { label: 'Total Energy Conservation Goal', value: `${totalEnergySavingGoal} kW` },
      { label: 'Total Cost Goal', value: `$${totalCostGoal}` },
      { label: 'Total Carbon Savings Goal', value: `${totalCarbonSavingGoal} kg` },
    ];
    setSelectedOption(newOptions.find(opt => opt.label === initialOption) || newOptions[0]);
  }, [totalEnergySavingGoal, totalCostGoal, totalCarbonSavingGoal, initialOption]);

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="unstyled"
          size="xs"
          borderRadius={20}
          width="100%"
          px={3}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#3627ba',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)',
            border: 'none',
          }}
        >
          <HStack width="100%" spaceX={2}>
            <Heading
              as="h4"
              size="sm"
              color="#3627ba"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              bg="transparent"
            >
              {selectedOption.label}: {selectedOption.value}
            </Heading>
            <MdArrowDropDown color="#3627ba" />
          </HStack>
        </Button>
      </MenuTrigger>

      <MenuContent
        color="#3627ba"
        width="100%"
        maxWidth="350px"
        p={3}
        bg="white"
        style={{ borderRadius: '20px' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            value={option.label}
            borderRadius="20px"
            whiteSpace="normal"
            overflow="hidden"
            onClick={() => handleSelect(option)}
            style={{
              color: '#3627ba',
              padding: '8px 12px',
              background: 'transparent',
            }}
          >
            {option.label}: {option.value}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
};

export default StaticGoalDropdown;