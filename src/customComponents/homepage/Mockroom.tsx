import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import './pinnedMenu.css'
import { FaCircleMinus } from "react-icons/fa6";

interface MockroomProps {
  roomNum: string;
  onClick?: () => void; // Optional click handler
  isEditing?: boolean;
  onRemove?: () => void; // Function to remove room
  style?: React.CSSProperties; // Optional style object
}



const Mockroom: React.FC<MockroomProps> = ({ roomNum, onClick, style, onRemove, isEditing= false }) => {

  return (
    <div>
        <Box className='mockRoom' onClick={onClick} height={'150px'} width="calc(45%)" style={style}>
            {roomNum}
            {isEditing && (
              <FaCircleMinus
                style={{
                  background: 'transparent',
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  cursor: 'pointer'
                }}
                size={'20%'}
                onClick={onRemove}
              />
            )}
        </Box>
    </div>
  )
}

export default Mockroom
