import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBorderImage from "@/images/pngegg (1).png";
import { MdOutlineEmail } from "react-icons/md";
import {
  checkVerificationStatus,
  resendVerificationEmail,
  getCurrentUser,
} from "@/utilities/firebase_auth_functions";
import "./Register.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const unsubscribe = checkVerificationStatus(async (verified) => {
      if (verified) {
        try {
          await user.reload();
          setIsVerified(true);
          console.log("Email verified, preparing to redirect..."); // Debug log

          toast({
            title: "Email Verified!",
            description: "Redirecting you to the next step...",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          // Make sure navigation happens after toast
          setTimeout(() => {
            console.log("Attempting navigation..."); // Debug log
            navigate("/home", { replace: true }); // Using replace to prevent back navigation
          }, 2500); // Slightly longer than toast duration
        } catch (error) {
          console.error("Error during verification process:", error);
        }
      }
    });

    // Polling interval for verification status
    const interval = setInterval(async () => {
      if (user) {
        try {
          await user.reload();
          const freshUser = getCurrentUser();
          if (freshUser?.emailVerified) {
            setIsVerified(true);
            clearInterval(interval);

            toast({
              title: "Email Verified!",
              description: "Redirecting you to the next step...",
              status: "success",
              duration: 2000,
              isClosable: true,
            });

            setTimeout(() => {
              navigate("/home", { replace: true });
            }, 2500);
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate, toast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((count) => count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    const result = await resendVerificationEmail();
    if (result.success) {
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setResendDisabled(true);
      setCountdown(60); // 60 second cooldown
    } else {
      toast({
        title: "Error",
        description: result.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const goToAuth = () => {
    navigate("/");
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <Flex
        className="registerTop"
        overflow="hidden"
        position="relative"
        width="100%"
      >
        <img
          src={TopBorderImage}
          alt="border image"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            maxHeight: "100vh",
          }}
        />
      </Flex>

      <Button
        borderRadius={200}
        width="30px"
        height="40px"
        display={"flex"}
        bg={"#43eb7f"}
        position="absolute"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        onClick={goToAuth}
        top={"10%"}
        left={"10%"}
      >
        <Text color={"white"} bg={"transparent"}>
          &lt;
        </Text>
      </Button>

      <Stack
        className="signUpDataInputStack"
        spaceY={3}
        transform={"translate(-50%, -50%)"}
        bg={"transparent"}
        align="center"
        gap={6}
      >
        <Box
          className="verification-icon-container"
          bg={"#6cce58"}
          p={4}
          borderRadius="full"
        >
          <MdOutlineEmail size={40} color="white" />
        </Box>

        <Heading textAlign="center" size="lg" color={"black"}>
          Verify your email
        </Heading>

        <Text textAlign="center" color="gray.600" fontSize="md" maxW="300px">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </Text>

        <Button
          className="next-Button"
          backgroundColor={"#6cce58"}
          color={"#f6f6f6"}
          onClick={handleResendEmail}
          disabled={resendDisabled}
          width="auto"
          px={8}
        >
          {resendDisabled ? `Resend in ${countdown}s` : "Resend Email"}
        </Button>

        {isVerified && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0,0,0,0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
          >
            <Box bg="white" p={6} borderRadius="xl" textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color="#6cce58">
                Email Verified Successfully!
              </Text>
            </Box>
          </Box>
        )}
      </Stack>
    </div>
  );
};

export default VerifyEmail;
