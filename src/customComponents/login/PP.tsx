import { Box, Heading, Stack, Text, List } from '@chakra-ui/react';
import React from 'react';
import { IoMdClose } from "react-icons/io";

type ContentType = string | (string | string[])[];
interface PPProps {
  onClose: () => void;
}

const PP = ({ onClose }: PPProps) => {
  const privacyPolicy = [
    {
      title: "1. Information We Collect",
      content: [
        "When you use the Sukoon App, we collect the following types of information:",
        [
          "a) Account Information:",
          [
            "Full name",
            "Email address",
            "Password",
            "Mobile number"
          ],
          "b) Device and Usage Information:",
          [
            "Device model and type",
            "Unique hub ID or QR code details",
            "Energy consumption data",
            "Interaction logs (e.g., device controls, feature usage)"
          ],
          "c) Communication Data:",
          [
            "Messages exchanged between residents and home admins",
            "Support inquiries and feedback"
          ],
          "d) Technical Data:",
          [
            "IP address",
            "App version and device operating system",
            "Log files for troubleshooting and security purposes"
          ]
        ]
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use the collected information to:",
        [
          "Provide and enhance the Sukoon App's functionalities",
          "Monitor and manage smart devices for energy efficiency",
          "Send important account-related notifications",
          "Ensure security and prevent unauthorized access",
          "Improve user experience through analytics and feedback",
          "Comply with legal obligations and regulatory requirements"
        ]
      ]
    },
    {
      title: "3. Data Security and Storage",
      content: [
        "We implement strict security measures to protect user data:",
        [
          "Encryption of stored data",
          "Compliance with GDPR and UAE Personal Data Protection Law (2021)",
          "Restricted access to sensitive data",
          "Regular security audits and updates"
        ],
        "Your data is stored securely and retained only as long as necessary to fulfill the purposes outlined in this policy."
      ]
    },
    {
      title: "4. Sharing and Disclosure",
      content: [
        "We do not sell or rent your personal information. However, we may share your data in the following cases:",
        [
          "With authorized service providers: To enable App functionality (e.g., cloud storage, analytics)",
          "With regulatory authorities: If required by law or to comply with legal processes",
          "With your consent: When explicitly agreed to for additional services"
        ]
      ]
    },
    {
      title: "5. User Rights and Choices",
      content: [
        "You have the following rights regarding your personal data:",
        [
          "Access and Review: Request a copy of your stored information",
          "Correction: Update inaccurate or outdated information",
          "Deletion: Request the removal of your account and associated data",
          "Data Portability: Obtain your data in a structured format"
        ],
        "To exercise these rights, contact us at sukoon.services8@gmail.com. We will process your request in compliance with legal obligations."
      ]
    },
    {
      title: "6. Use of Smart Devices",
      content: [
        "When linking smart devices, users should note:",
        [
          "Sukoon ensures compatibility with approved APIs but is not responsible for limitations due to third-party services.",
          "Data collected from linked devices is used solely for energy management and efficiency purposes."
        ]
      ]
    },
    {
      title: "7. Children's Privacy",
      content: "The Sukoon App is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If we discover such data, we will delete it promptly."
    },
    {
      title: "8. Changes to Privacy Policy",
      content: "We may update this Privacy Policy periodically. Users will be notified of significant changes via email or App notifications. Continued use of the App after updates constitutes acceptance of the revised policy."
    },
    {
      title: "9. Contact Us",
      content: "For privacy-related inquiries, reach out to us at:\nEmail: sukoon.services8@gmail.com"
    }
  ];

  const renderContent = (content: ContentType) => {
    if (typeof content === 'string') {
      return (
        <Text color="gray.300" fontSize="md" mb={4} bg="transparent">
          {content}
        </Text>
      );
    }

    return content.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <Text key={index} color="gray.300" fontSize="md" mb={2} bg="transparent">
            {item}
          </Text>
        );
      }

      if (Array.isArray(item)) {
        return (
          <List.Root key={index} ps="5" bg="transparent">
            {item.map((point, i) => {
              if (typeof point === 'string') {
                return (
                  <List.Item key={i} color="gray.300" fontSize="md" mb={2} bg="transparent">
                    {point}
                  </List.Item>
                );
              }
              if (Array.isArray(point)) {
                return (
                  <List.Root key={i} ps="5" bg="transparent">
                    {point.map((subPoint, j) => (
                      <List.Item key={j} color="gray.300" fontSize="md" mb={2} bg="transparent">
                        {subPoint}
                      </List.Item>
                    ))}
                  </List.Root>
                );
              }
              return null;
            })}
          </List.Root>
        );
      }

      return null;
    });
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
      <IoMdClose
        aria-label="Close privacy policy"
        style={{ position: 'absolute', top: '1%', right: '5%', zIndex: 1001, background: 'transparent' }}
        color="gray"
        onClick={onClose}
        size={'8%'}
      />
      
      <Stack spaceY={4} p={6} height="100%" bg="black" mt={'10%'}>
        <Heading color="white" textAlign="center" fontSize="2xl" bg="black" className='bold'>
          Privacy Policy
        </Heading>
        <Box bg="white" height="1px" width="100%" />
        
        <Box overflowY="auto" pr={4} height="100%" bg="black">
          <Text color="gray.300" mb={6} textAlign="justify" bg="black">
            Welcome to Sukoon! Your privacy is important to us. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use the Sukoon application.
          </Text>

          {privacyPolicy.map((section, index) => (
            <Box key={index} mb={6} bg="black">
              <Heading color="white" fontSize="xl" mb={2} bg="black">
                {section.title}
              </Heading>
              {renderContent(section.content)}
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default PP;