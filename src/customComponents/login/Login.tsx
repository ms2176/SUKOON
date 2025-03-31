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
import "./register.css";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";

import { FormControl } from "@chakra-ui/form-control";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  loginWithEmail,
  signInWithGoogle,
  signInWithApple,
} from "@/utilities/firebase_auth_functions";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

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

  const checkUserHubs = async (userId: string) => {
    const db = getFirestore();
    const userHubsRef = collection(db, "userHubs");
    const q = query(userHubsRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Return true if hubs exist, false otherwise
    } catch (error) {
      console.error("Error checking user hubs:", error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    e.preventDefault();
  setEmailError("");
  setPasswordError("");

  let hasError = false;
  if (!email) {
    setEmailError("Email is required");
    hasError = true;
  }
  if (!password) {
    setPasswordError("Password is required");
    hasError = true;
  }
  if (hasError) return;

    if (!email || !password) {
      setEmailError("Email and password are required");
      return;
    }

    const result = await loginWithEmail(email, password);
    if (result.success) {
      sessionStorage.setItem("userEmail", email);
      if (!result.verified) {
        // If email isn't verified, send to verification page
        navigate("/verification_hold");
      } else {
        const hasHubs = await checkUserHubs(result.user.uid);
        if (hasHubs) {
          navigate("/home"); // Navigate to home if hubs exist
        } else {
          navigate("/initial"); // Navigate to initial setup if no hubs exist
        }
      }
    } else {
      setEmailError("Invalid email or password");
    }
  };

  // Add these functions for Google and Apple sign in to the approprite btn component
  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithGoogle();

      if (result.success && result.user) {
        const userEmail = result.user.email || "";

        // Check if this email is used with email/password auth
        const methods = await fetchSignInMethodsForEmail(auth, userEmail);

        if (methods.includes("password") && !methods.includes("google.com")) {
          // Email already registered with password only
          setEmailError(
            "An account with this email already exists. Please sign in with your email and password."
          );
          return;
        }

        // Check if the user document already exists
        const db = getFirestore();
        const userDocRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userDocRef);

        // If user document doesn't exist, create it (first-time Google login)
        if (!userDoc.exists()) {
          const username = userEmail.split("@")[0];

          try {
            await setDoc(userDocRef, {
              email: userEmail,
              username: username,
              userId: result.user.uid,
              dailyGoal: "",
              dailyGoalProgress: "",
              phoneNumber: "",
              plants: {
                roses: false,
                sunflower: false,
                daisy: false,
                cactus: false,
                bonsai: false,
                VFtrap: false,
              },
              profilePhoto: result.user.photoURL || "",
              totalCarbonSavingGoal: 0,
              totalEnergySavingGoal: 0,
              totalCostGoal: 0,
              totalCarbonSavingGoalProgress: 0,
              totalEnergySavingGoalProgress: 0,
              totalCostGoalProgress: 0,
              darkMode: false,
            });
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        }

        // Store user email in session
        sessionStorage.setItem("userEmail", userEmail);

        // Check if user has hubs and navigate accordingly
        const hasHubs = await checkUserHubs(result.user.uid);
        if (hasHubs) {
          navigate("/home");
        } else {
          navigate("/initial");
        }
      } else {
        setEmailError(result.error || "Google sign-in failed");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setEmailError("An error occurred during authentication");
    }
  };
  // const handleAppleSignIn = async () => {
  //   const result = await signInWithApple();
  //   if (result.success) {
  //     navigate("/home");
  //   } else {
  //     setEmailError(result.error);
  //   }
  // };

  const navigate = useNavigate(); // Initialize navigate function

  // Function to navigate back to Auth page
  const goToAuth = () => {
    navigate("/"); // Navigate to the root Auth page
  };

  const goToReg = () => {
    navigate("/register"); // Navigate to the root Auth page
  };

  const goToResetPassword = () => {
    navigate("/ResetPassword");
  };

  return (
    <div style={{ overflowX: "hidden" }}>

      <Button
        borderRadius="full"
        width="50px"
        height="50px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#43eb7f"
        position="fixed" // Changed from absolute to fixed
        left="7%"
        top="9%"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        onClick={goToAuth}
        zIndex={999} // Ensure it stays on top
      >
        <IoChevronBackOutline 
          color="white" 
          size={24} 
          style={{ background: "transparent" }}
        />
      </Button>

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
              onClick={goToReg}
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
          
          <div className="google-login-button" onClick={handleGoogleSignIn}>
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
