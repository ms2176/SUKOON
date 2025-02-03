
import { Box, Button } from '@chakra-ui/react';

const ToggleButton = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => {
  return (
    <Button
      onClick={onToggle}
      bg={isOn ? 'green.400' : 'gray.300'}
      _hover={{ bg: isOn ? 'green.500' : 'gray.400' }}
      borderRadius="full"
      width="50px"
      height="24px"
      padding="0"
      position="relative"
    >
      <Box
        width="20px"
        height="20px"
        bg="white"
        borderRadius="full"
        position="absolute"
        top="2px"
        left={isOn ? '26px' : '2px'}
        transition="left 0.3s"
      />
    </Button>
  );
};

export default ToggleButton;
