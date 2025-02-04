import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiArrowLeft } from 'react-icons/fi';
import { IoChevronBack } from "react-icons/io5";

const Rate = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const handleSubmit = () => {
    console.log('Submitted rating:', rating);
    // Add your submission logic here
    sessionStorage.setItem('userRating', rating.toString());
    navigate('/accountspage'); // Navigate back after submission
  };

  return (
    <Box minH="100vh" bg="gray.100">
      <Box p={0} m={0}>
        <Box 
          as="header" 
          bgColor="white"
          p={4}
          textAlign="center"
          position="relative"
          minH="100vh"
        >
          {/* Header */}
          <HStack justify="space-between" px={2}>
            <Button
              borderRadius="full"
              width="30px"
              height="40px"
              bg="#43eb7f"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
              aria-label="Back"
              onClick={() => navigate('/accountspage')}
            >
              <IoChevronBack color="white" />
            </Button>
            <Heading size="lg" flex="1" color="black">
              Rate Us
            </Heading>
            <Box width="30px" /> {/* Spacer for alignment */}
          </HStack>

          {/* Rating Section */}
          <Flex align="center" direction="column" mt={20}>
            <HStack p={4}>
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <Button
                    key={index}
                    variant="plain"
                    onMouseEnter={() => setHoverRating(currentRating)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleStarClick(currentRating)}
                    aria-label={`Rate ${currentRating} stars`}
                  >
                    <Icon
                      as={FiStar}
                      boxSize={12}
                      color={
                        currentRating <= (hoverRating || rating)
                          ? "yellow.400"
                          : "gray.300"
                      }
                      transition="color 0.2s"
                    />
                  </Button>
                );
              })}
            </HStack>

            {/* Submit Button */}
            <Button
              mt={12}
              bg="#43eb7f"
              color="white"
              borderRadius="xl"
              width="200px"
              height="50px"
              _hover={{ bg: '#3ad073' }}
              onClick={handleSubmit}
            >
              Submit Rating
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Rate;