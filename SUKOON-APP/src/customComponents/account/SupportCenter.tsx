import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  Icon,
  Button,
  Textarea,
  Text,
} from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/accordion'; // Correct import
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { IoChevronBack } from "react-icons/io5";

const SupportCenter = () => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the Accounts page and click 'Forgot Password'. Follow the instructions sent to your email."
    },
    {
      question: "Can I change my email address?",
      answer: "Yes, navigate to Account Information and update your email in the email field."
    },
    {
      question: "How do I contact support?",
      answer: "Use this support center page or email us directly at support@example.com"
    }
  ];

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', feedback);
    // Add your submission logic here
    setIsFeedbackOpen(false);
    setFeedback('');
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
              <IoChevronBack color="balck" />
            </Button>
            <Heading size="lg" flex="1" color="black">
              Support Center
            </Heading>
            <Box width="30px" /> {/* Spacer for alignment */}
          </HStack>

          {/* Feedback Section */}
          <Box 
            mt={8}
            mx={4}
            p={6}
            bg="white"
            borderRadius="xl"
            boxShadow="md"
            cursor="pointer"
            _hover={{ transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            onClick={() => setIsFeedbackOpen(true)}
          >
            <Flex align="center">
              <Icon as={FiMessageSquare} boxSize={8} color="green.500" mr={4} />
              <Text fontSize="xl" fontWeight="semibold" color={'black'}>Send Feedback</Text>
            </Flex>
          </Box>

          {/* Feedback Modal */}
          {isFeedbackOpen && (
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="xl"
              width="90%"
              maxW="500px"
              zIndex={2}
            >
              <Heading size="md" mb={4} color={'black'} >Your Feedback</Heading>
              <Textarea
                value={feedback}
                color={'black'}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us how we can improve..."
                height="150px"
                mb={4}
              />
              <Flex justify="flex-end">
                <Button
                  mr={3}
                  pl={4}
                  pr={4}
                  variant="outline"
                  onClick={() => setIsFeedbackOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  pl={4}
                  pr={4}               
                  bg="#43eb7f"
                  color="white"
                  _hover={{ bg: '#3ad073' }}
                  onClick={handleSubmitFeedback}                  
                >
                  Send
                </Button>
              </Flex>
            </Box>
          )}

          {/* FAQ Section */}
          <Box mt={8} mx={4} flex={1}>
            <Heading size="lg" mb={6} color="gray.700">Frequently Asked Questions</Heading>
            <Accordion allowToggle>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} mb={4} border="none" bg="green" borderRadius="xl">
                  <AccordionButton _hover={{ bg: 'gray.50' }} p={4}>
                    <Box flex="1" textAlign="left">
                      <Text color={'black'} fontWeight="semibold">{faq.question}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={4} color={'black'}>
                    {faq.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportCenter;