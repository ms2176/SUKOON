// components/ConfirmationDialogue.tsx
import { ReactNode } from 'react';
import { Box, Text, Button, Flex, HStack, Stack } from '@chakra-ui/react';

interface ConfirmationDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: ReactNode;
}

const ConfirmationDialogue = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationDialogueProps) => {
  if (!isOpen) return null;

  return (
    
    <Box
    bg="white"
    borderRadius="20px"
    width="90%"
    position={'absolute'}
    top={'30%'}
    left={'50%'}
    transform={'translateX(-50%)'}
    boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)"
    p={6}

    display={'flex'}
    justifyContent={'center'}
    alignContent={'center'}
    alignItems={'center'}

    >
        <Stack bg={'transparent'}>

            <Text fontSize="lg" mb={4} textAlign={'center'}>
                {message}
            </Text>

            <HStack bg={'transparent'} display={'flex'}
    justifyContent={'center'}
    alignContent={'center'}
    alignItems={'center'}
    spaceX={3}>
                <Button color={'black'} onClick={onClose}>
                    Cancel
                </Button>

                <Button 
                p={4}
                bg={'#6cc358'}
                borderRadius={20}
                color={'white'} onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    Confirm
                </Button>
            </HStack>
            
        </Stack>
        

    </Box>
    
  );
};

export default ConfirmationDialogue;