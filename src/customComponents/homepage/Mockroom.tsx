import { Box, Heading, Stack } from '@chakra-ui/react';
import React from 'react';
import './pinnedMenu.css';
import './MockRoom.css';
import { FaCircleMinus } from 'react-icons/fa6';

interface MockroomProps {
  roomNum?: string;
  onClick?: () => void; // Optional click handler
  isEditing?: boolean;
  onRemove?: () => void; // Function to remove room
  style?: React.CSSProperties; // Optional style object
  roomName?: string;
  numDevices?: number;
  image?: string | React.ReactElement;
}

const Mockroom: React.FC<MockroomProps> = ({roomNum, onClick, style, onRemove, isEditing = false, roomName, numDevices, image}) => {
  return (
    <Box
      className="mockRoomComp"
      onClick={onClick}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="150px"
      width="calc(45%)"
      style={style}
      p={4}
      position="relative"
      borderWidth={'1px'}
      borderColor={'#21334a'}
   
    >
      {isEditing && (
        <FaCircleMinus
          style={{
            background: 'transparent',
            position: 'absolute',
            top: '5px',
            right: '5px',
            cursor: 'pointer',
            zIndex: '1000'
          }}
          size={'20%'}
          onClick={onRemove}
          color='#21334a'
          
        />
      )}

      <Stack
        bg="transparent"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        gap={0} 
      >
        <Box
          width="90%"
          position="relative"
          paddingTop="56.25%" 
          borderRadius="20px"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className='imageboxpin'
          >
            {typeof image === 'string' ? (
              <img
                src={image}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', 
                  borderRadius: '20px',
                }}
              />
            ) : (
              image
            )}
          </Box>
        </Box>

        <Stack
          bg="transparent"
          spaceY={'-10%'}
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          width="100%" 
        >
          <Heading bg="transparent" whiteSpace="nowrap" fontSize="md" color={'#6cce58'}>
            {roomName}
          </Heading>
          <Heading bg="transparent" whiteSpace="nowrap" fontSize="sm" color={'gray.400'}>
            {numDevices} devices
          </Heading>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Mockroom;