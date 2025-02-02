import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
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
import { FiEye, FiEyeOff } from "react-icons/fi";

import { IoChevronBack } from "react-icons/io5";
import {
  loginWithEmail,
  signInWithGoogle,
  signInWithApple,
} from "@/utilities/firebase_auth_functions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the email state when the user types
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // Update the password state when the user types
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      setEmailError("Email and password are required");
      return;
    }

    const result = await loginWithEmail(email, password);
    if (result.success) {
      sessionStorage.setItem("userEmail", email);
      navigate("/home");
    } else {
      setEmailError("Invalid email or password");
    }
  };

  // Add these functions for Google and Apple sign in to the approprite btn component
  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      navigate("/home");
    } else {
      setEmailError(result.error);
    }
  };

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();
    if (result.success) {
      navigate("/home");
    } else {
      setEmailError(result.error);
    }
  };

  const navigate = useNavigate(); // Initialize navigate function

  // Function to navigate back to Auth page
  const goToAuth = () => {
    navigate("/"); // Navigate to the root Auth page
  };

  const goToQR = () => {
    navigate("/QRWait"); // Navigate to the root Auth page
  };

  const goToResetPassword = () => {
    navigate("/ResetPassword");
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
            Log In
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

        <Box width="130%" display="flex" flexDirection="column" p={0} m={0}>
          <FormControl isInvalid={!!passwordError} width={"100%"}>
            <Box className="OuterInputBox">
              <Input
                placeholder="Password"
                className="InputData"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={password}
                onChange={handlePasswordChange}
              />
              <Box className="InnerInputBox">
                <CiLock />
              </Box>
              <HStack
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
              >
                <Button
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </HStack>
            </Box>
          </FormControl>
        </Box>

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
              handleLogin(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            Next
          </Button>

          {/* Reserve space to prevent layout shifting */}
          <Text
            color={"red.500"}
            fontSize={"sm"}
            minH="20px"
            visibility={emailError || passwordError ? "visible" : "hidden"}
          >
            Invalid Email or Password
          </Text>
        </Flex>

        <Stack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          alignContent={"center"}
          spaceY={-3}
        >
          <Text className="registeryText">
            Don't have an account?{" "}
            <span
              style={{ color: "#6cce58", textDecoration: "underline" }}
              onClick={goToQR}
            >
              {" "}
              Sign Up!
            </span>
          </Text>
          <Text
            className="registeryText"
            style={{ color: "#6cce58", textDecoration: "underline" }}
            onClick={goToResetPassword}
          >
            Forgot password?
          </Text>
        </Stack>

        <div className="buttons-container">
          <div className="apple-login-button">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              className="apple-icon"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
            </svg>
            <span style={{ backgroundColor: "transparent" }}>
              Sign in with Apple
            </span>
          </div>
          <div className="google-login-button">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              version="1.1"
              x="0px"
              y="0px"
              className="google-icon"
              viewBox="0 0 48 48"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span>Sign in with Google</span>
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default Login;
