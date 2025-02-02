import { Box, Text, Button, HStack } from '@chakra-ui/react';

const AddDeviceButton = () => {
  return (
    <Box
      w="300px" // Reduced width
      h="70px"  // Reduced height
      border="2px dashed gray"
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center" // Center content horizontally
      cursor="pointer"
      _hover={{ bg: 'gray.100' }}
    >
      {/* HStack without spacing property */}
      <HStack>
        {/* Button with "+" icon */}
        <Button size="lg" colorScheme="gray" variant="ghost" fontSize="4xl" p={0}>
          +
        </Button>
        {/* Text for "Add New Device" with margin left */}
        <Text fontSize="lg" color="gray.500" fontWeight="semibold" ml={2}>
          Add New Device
        </Text>
      </HStack>
    </Box>
  );
};

export default AddDeviceButton; 

