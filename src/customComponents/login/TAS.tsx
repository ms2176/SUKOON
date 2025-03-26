import { Box, Heading, Stack, Text, List } from '@chakra-ui/react';
import React from 'react';
import { IoMdClose } from "react-icons/io";

type ContentType = string | (string | string[])[];
interface TASProps {
    onClose: () => void;
  }

const TAS = ({ onClose }: TASProps) => {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By creating an account, accessing, or using the Sukoon App, you confirm that you have read, understood, and agree to these Terms and Conditions."
    },
    {
      title: "2. Use of the Application",
      content: [
        "The Sukoon App is designed for:",
        [
          "Monitoring and managing energy consumption of smart devices in a household.",
          "Providing insights and suggestions for energy conservation.",
          "Enabling communication between residents and home admins.",
          "Offering customizable features for enhanced user experience."
        ],
        "You agree to use the App only for its intended purposes and comply with all applicable laws."
      ]
    },
    {
      title: "3. User Accounts",
      content: [
        "Account Creation:",
        "To access the App, you must register by providing: Full name, Email address, Password, Mobile number.",
        "Account Responsibilities:",
        [
          "Maintain confidentiality of login credentials",
          "Notify us immediately of unauthorized use",
          "Keep information accurate and up to date"
        ],
        "Account Termination:",
        "We reserve the right to suspend or terminate accounts for violations, fraudulent activity, or security compromises."
      ]
    },
    // Add remaining sections following the same pattern
    {
      title: "4. Privacy and Data Protection",
      content: [
        "Your privacy is important. We comply with:",
        [
          "GDPR",
          "UAE Personal Data Protection Law (2021)"
        ],
        "We provide:",
        [
          "Secure storage and encryption",
          "Data deletion/access requests"
        ]
      ]
    },
    {
      title: "5. Use of Smart Devices",
      content: [
        "Device Connectivity:",
        "Link devices via QR code or hub ID with role-based access",
        "Third-Party APIs:",
        "Functionality limited to approved APIs"
      ]
    },
    {
      title: "6. User Responsibilities",
      content: [
        "You agree to:",
        [
          "Use lawfully and ethically",
          "Protect account details",
          "Avoid reverse engineering",
          "Report bugs/issues"
        ]
      ]
    },
    {
      title: "7. Prohibited Activities",
      content: [
        "Prohibited from:",
        [
          "Illegal activities",
          "Security breaches",
          "Infringing others' rights"
        ]
      ]
    },
    {
      title: "8. Service Availability",
      content: [
        "Uptime: 99.9% goal but no guarantees",
        "Updates: Regular improvements and bug fixes"
      ]
    },
    {
      title: "9. Limitation of Liability",
      content: [
        "Provided 'as is' - no warranties",
        "Not liable for:",
        [
          "Data loss",
          "Device incompatibility",
          "Unauthorized access from negligence"
        ]
      ]
    },
    {
      title: "10. Changes to Terms",
      content: "We may update terms with notification. Continued use = acceptance."
    },
    {
      title: "11. Contact Us",
      content: "sukoon.services8@gmail.com"
    }
  ];

  const renderContent = (content: ContentType) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <React.Fragment key={index}>
          {Array.isArray(item) ? (
            <List.Root ps="5" bg="transparent">
              {item.map((point, i) => (
                <List.Item key={i} color="gray.300" fontSize="md" mb={2} bg="transparent">
                  {point}
                </List.Item>
              ))}
            </List.Root>
          ) : (
            <Text color="gray.300" fontSize="md" mb={2} bg="transparent">
              {item}
            </Text>
          )}
        </React.Fragment>
      ));
    }
    return (
      <Text color="gray.300" fontSize="md" mb={4} bg="transparent">
        {content}
      </Text>
    );
  };

  return (
    <Box
      bg="black"
      width={{ base: "90%", md: "80%" }}
      height="80vh"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="xl"
      zIndex={1000}
    >
      {/* Close Button positioned absolutely in top-right corner */}
      <IoMdClose
        aria-label="Close terms and conditions"
        style={{position: 'absolute', top: '1%', right: '5%', zIndex: 1001, background: 'transparent'}}
        color="gray"
        onClick={onClose} // Use the passed onClose function
        size={'8%'}
      />
      
      <Stack spaceY={4} p={6} height="100%" bg="black" mt={'10%'}>
        <Heading color="white" textAlign="center" fontSize="2xl" bg="black" className='bold'>
          Our Terms & Services
        </Heading>
        <Box bg="white" height="1px" width="100%" />
        
        <Box overflowY="auto" pr={4} height="100%" bg="black">
          <Text color="gray.300" mb={6} textAlign="justify" bg="black">
            Welcome to Sukoon! These Terms and Conditions govern your use of the Sukoon application. 
            By accessing or using the App, you agree to comply with these terms. If you do not agree, 
            please refrain from using the App.
          </Text>

          {terms.map((term, index) => (
            <Box key={index} mb={6} bg="black">
              <Heading color="white" fontSize="xl" mb={2} bg="black">
                {term.title}
              </Heading>
              {renderContent(term.content)}
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default TAS;