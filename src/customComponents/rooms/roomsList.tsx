import { useState } from 'react';
import { Button, Box, Text, Image, Grid, Heading, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import AddRoom from './addRooms'; 

// Import room images
import LivingRoomImg from '@/images/roomsImage/livingRoom.jpeg';
import BedroomImg from '@/images/roomsImage/bedroom.jpg';
import KidsRoomImg from '@/images/roomsImage/kids.jpg';
import KitchenImg from '@/images/roomsImage/kitchen.jpg';
import BathroomImg from '@/images/roomsImage/bathroom.webp';
import OfficeImg from '@/images/roomsImage/office.jpg';
import DiningImg from '@/images/roomsImage/Dining.webp';
import LaundryImg from '@/images/roomsImage/laundry.jpg';

// Placeholder user image
import PlaceholderUserImage from '@/images/roomsImage/userCircle.png';

const RoomList = () => {
  const navigate = useNavigate(); 

  const [rooms, setRooms] = useState([
    { id: 1, name: 'Living Room', image: LivingRoomImg, devices: 5 },
    { id: 2, name: 'Master Bedroom', image: BedroomImg, devices: 12 },
    { id: 3, name: 'Kids Bedroom', image: KidsRoomImg, devices: 4 },
    { id: 4, name: 'Kitchen', image: KitchenImg, devices: 10 },
    { id: 5, name: 'Bathroom', image: BathroomImg, devices: 7 },
    { id: 6, name: 'Office', image: OfficeImg, devices: 5 },
    { id: 7, name: 'Dining Room', image: DiningImg, devices: 3 },
    { id: 8, name: 'Laundry Room', image: LaundryImg, devices: 2 },
  ]);

  const [showAddRoom, setShowAddRoom] = useState(false);

  const handleAddRoom = (newRoom: any) => {
    const newRoomId = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
    setRooms([...rooms, { ...newRoom, id: newRoomId }]);
    setShowAddRoom(false);
  };

  return (
    <Box p={6} bg="white" minHeight="100vh" pb="90px">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading as="h1" size="lg" fontWeight="bold" color="#464646" fontSize="50px">
          Hi, User
        </Heading>
        <Image src={PlaceholderUserImage} alt="User" boxSize="50px" borderRadius="full" />
      </Flex>

      {/* "Your Rooms" Section */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h2" fontSize="32px" color="#464646">
          <Text as="span" fontWeight="normal">Your </Text>
          <Text as="span" fontWeight="bold">Rooms</Text>
        </Heading>
        <Button
          bg="#6cce58"
          color="white"
          px={6}
          py={2}
          borderRadius="full"
          fontSize="md"
          boxShadow="md"
          _hover={{ bg: "#5bb046" }}
          onClick={() => setShowAddRoom(true)}
        >
          + Add Room
        </Button>
      </Flex>

      {/* Room Grid */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {rooms.map((room) => (
          <Box
            key={room.id}
            borderRadius="20px"
            overflow="hidden"
            bg="white"
            p={4}
            cursor="pointer"
            transition="all 0.3s ease-in-out"
            boxShadow="0px 5px 10px rgba(0, 0, 0, 0.05)" // Soft elevation
            border="1px solid rgba(0, 0, 0, 0.08)" // Light border for depth
            _hover={{
              transform: "translateY(-5px)", // Slight lift
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)", // Stronger shadow on hover
              backgroundColor: "#f5f5f5", // Light grey highlight on hover
            }}
            onClick={() => navigate(`/devices/${room.id}`)}
          >
            <Image
              src={room.image}
              alt={room.name}
              borderRadius="12px"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Text fontWeight="bold" fontSize="lg" mt={4} color="#6cce58">
              {room.name}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {room.devices} devices
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Add Room Modal */}
      {showAddRoom && <AddRoom onClose={() => setShowAddRoom(false)} onAddRoom={handleAddRoom} />}
    </Box>
  );
};

export default RoomList;


