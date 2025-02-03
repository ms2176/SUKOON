import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import TopBorderImage from "@/images/pngegg (1).png";
import "./Register.css";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import React, { useState } from "react";
import { FormControl } from "@chakra-ui/form-control";
import {
  registerWithEmail,
  loginWithEmail,
  signInWithGoogle,
  signInWithApple,
  resetPassword,
} from "@/utilities/firebase_auth_functions";

// import {
//   resetPassword
// } from "@/utilities/firebase_auth_functions";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the email state when the user types
  };

  const handleReset = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      navigate("/OTP");
    } else {
      setEmailError(result.error);
    }
  };

  const navigate = useNavigate(); // Initialize navigate function

  // Function to navigate back to Auth page
  const goToAuth = () => {
    navigate("/"); // Navigate to the root Auth page
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <Flex
        className="registerTop"
        overflow="hidden"
        position="relative"
        width="100%"
      >
        {/* Image */}
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

      <Stack
        className="signUpDataInputStack"
        spaceY={3}
        transform={"translate(-50%, -50%)"}
        bg={"transparent"}
      >
        <Flex
          alignItems="center"
          width="100%"
          display={"flex"}
          position="relative"
          bg={"transparent"}
        >
          {/* Back Button */}
          <Button
            borderRadius={200}
            width="30px"
            height="40px"
            display={"flex"}
            bg={"#43eb7f"}
            position="absolute"
            left="-15%"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
            onClick={goToAuth} // Navigate to Auth when clicked
            top={"-120%"}
          >
            <Text color={"white"} bg={"transparent"}>
              &lt;
            </Text>
          </Button>

          {/* Log In Heading */}
          <Heading
            textAlign="center"
            width="100%"
            color={"black"}
            bg={"transparent"}
          >
            Reset Password
          </Heading>
        </Flex>

        <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
          <FormControl isInvalid={!!emailError} width={"100%"}>
            <Box className="OuterInputBox">
              <Input
                placeholder="Email"
                className="InputData"
                value={email}
                onChange={handleEmailChange}
              />
              <Box className="InnerInputBox">
                <MdOutlineEmail />
              </Box>
            </Box>
          </FormControl>
        </Box>

        <Text textAlign={"center"}>
          Enter your email, and we will send you an email with a confirmation
          code to reset your password.
        </Text>

        <Flex
          width={"100%"}
          display={"flex"}
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            className="next-Button"
            backgroundColor={"#6cce58"}
            color={"#f6f6f6"}
            onClick={(e) => {
              e.preventDefault();
              handleReset();
            }}
          >
            Next
          </Button>

          {/* Reserve space to prevent layout shifting */}
          <Text
            color={"red.500"}
            fontSize={"sm"}
            minH="20px"
            visibility={emailError ? "visible" : "hidden"}
          >
            Enter a valid email.
          </Text>
        </Flex>
      </Stack>
    </div>
  );
};

export default ResetPassword;
