import { useState, useEffect } from 'react';
import { Button, Box, Text, Image, Grid, Heading, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AddRoom from './addRooms';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Import room images (if you want to use default images for rooms)
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

// Define the Room type
interface Room {
  id: string;
  roomName: string;
  hubCode: string;
  pinned: boolean;
  devices: string[];
  image?: string; // Optional field for room image
}

interface RoomListProps {
  selectedHome: {
    hubCode: string;
  } | null;
}

const RoomList: React.FC<RoomListProps> = () => {

  const selectedHome = localStorage.getItem('selectedHome') ? JSON.parse(localStorage.getItem('selectedHome') as string) : null;
  const navigate = useNavigate();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Fetch rooms when selectedHome changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHome) {
        const db = getFirestore();
        const roomsRef = collection(db, 'rooms');
        const roomsQuery = query(roomsRef, where('hubCode', '==', selectedHome.hubCode));

        try {
          const querySnapshot = await getDocs(roomsQuery);
          const roomsData: Room[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            roomsData.push({
              id: doc.id,
              roomName: data.roomName,
              hubCode: data.hubCode,
              pinned: data.pinned || false,
              devices: data.devices || [],
              image: data.image || LivingRoomImg, // Use a default image if no image is provided
            });
          });
          setRooms(roomsData);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      }
    };

    fetchRooms();
  }, [selectedHome]);

  const handleAddRoom = (newRoom: any) => {
    const newRoomId = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
    setRooms([...rooms, { ...newRoom, id: newRoomId }]);
    setShowAddRoom(false);
  };

  return (
    <Box p={6} bg="white" minHeight="100vh" pb="90px">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading as="h1" size="lg" fontWeight="bold" color="#464646" fontSize="50px" className='roomshd'>
          Hi, User
        </Heading>
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
          _hover={{ bg: '#5bb046' }}
          onClick={() => setShowAddRoom(true)}
        >
          + Create Room
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
              transform: 'translateY(-5px)', // Slight lift
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Stronger shadow on hover
              backgroundColor: '#f5f5f5', // Light grey highlight on hover
            }}
            onClick={() => navigate(`/devices/${room.id}`)}
          >
            <Image
              src={room.image || LivingRoomImg} // Use the room's image or a default image
              alt={room.roomName}
              borderRadius="12px"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Text fontWeight="bold" fontSize="lg" mt={4} color="#6cce58">
              {room.roomName}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {room.devices.length} devices
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