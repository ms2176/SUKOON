import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Flex,
  HStack,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/form-control';
import { FiSettings, FiUser, FiPhone, FiEdit, FiKey } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AccInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarSrc, setAvatarSrc] = useState('https://via.placeholder.com/150');
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Use a default masked password value.
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('********');
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  // Load user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.username || '');
          setEmail(userData.email || '');
          setPhone(userData.phoneNumber || '');
          if (userData.profilePhoto) setAvatarSrc(userData.profilePhoto);
          // Optionally update passwordPlaceholder if you have that data.
        }
      }
    };
    fetchUserData();
  }, [auth, db]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  const handleAvatarEdit = () => {
    fileInputRef.current?.click();
  };

  const goToResetPassword = () => {
    navigate("/ResetPassword");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      let profilePhotoUrl = avatarSrc;

      // Upload new image if exists
      if (imageFile) {
        const storageRef = ref(storage, `profile-photos/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        profilePhotoUrl = await getDownloadURL(storageRef);
      }

      // Update Firestore document with the full URL
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        username: name,
        phoneNumber: phone,
        profilePhoto: profilePhotoUrl,
      });

      // Update local state with the new URL
      setAvatarSrc(profilePhotoUrl);
      navigate('/accountspage');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    navigate('/accountspage');
  };

  const handleResetPassword = () => {
    // Implement your reset password functionality here
    alert('Reset password clicked');
  };

  return (
    <Box minH="100vh" bg="gray.100">
      <Box p={0} m={0}>
        <Box as="header" bg="white" p={4} textAlign="center" minH="100vh">
          <HStack justify="space-between" px={2}>
            <Button
              borderRadius="full"
              width="30px"
              height="40px"
              bg="#43eb7f"
              boxShadow="0 4px 8px rgba(0,0,0,0.2)"
              aria-label="Back"
              onClick={() => navigate('/accountspage')}
            >
              <IoChevronBack color="white" style={{ background: 'transparent' }} />
            </Button>
            <Heading size="lg" flex="1" color="black">
              Profile Edit
            </Heading>
            <Box boxSize={6} as={FiSettings} color="black" />
          </HStack>

          <Flex align="center" direction="column" mt={6} pt={9}>
            <Box position="relative">
              {/* Box with the profile image */}
              <Box
                borderWidth="4px"
                borderColor="green.500"
                borderRadius="full"
                width="150px"
                height="150px"
                overflow="hidden"
                mx="auto"
              >
                <img
                  src={
                    (avatarSrc.startsWith('data:') || avatarSrc.includes('?'))
                      ? avatarSrc
                      : `${avatarSrc}?${Date.now()}`
                  }
                  alt={name || 'Profile'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              </Box>
              {/* Clickable edit icon */}
              <Box
                position="absolute"
                bottom="2"
                right="2"
                bg="white"
                borderRadius="full"
                p={1}
                cursor="pointer"
                onClick={handleAvatarEdit}
              >
                <FiEdit size={16} color="black" />
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Box>

            <Text fontSize="xl" fontWeight="bold" mt={4} color="black">
              {name}
            </Text>

            <Box width="90%" mt={8}>
              <FormControl mb={8}>
                <Box position="relative">
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={handleNameChange}
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'green.500' }}
                    color="gray.800"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FiUser size={24} />
                  </Box>
                </Box>
              </FormControl>

              <FormControl mb={8}>
                <Box position="relative">
                  <Input
                    placeholder="Email"
                    value={email}
                    disabled
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    color="gray.800"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <MdOutlineEmail size={24} />
                  </Box>
                </Box>
              </FormControl>

              <FormControl mb={8}>
                <Box position="relative">
                  <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'green.500' }}
                    color="gray.800"
                    type="tel"
                    pattern="[0-9]*"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FiPhone size={24} />
                  </Box>
                </Box>
              </FormControl>

              {/* New disabled password input */}
              <FormControl mb={2}>
                <Box position="relative">
                  <Input
                    placeholder="Password"
                    value={passwordPlaceholder}
                    disabled
                    pl={12}
                    height="50px"
                    borderRadius="xl"
                    borderColor="gray.200"
                    color="gray.800"
                  />
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.500"
                  >
                    <FiKey size={24} />
                  </Box>
                </Box>
              </FormControl>
              {/* Reset password link */}
              <Text
                color="red.500"
                textDecoration="underline"
                cursor="pointer"
                mb={8}
                onClick={goToResetPassword}
              >
                Reset Password
              </Text>
            </Box>

            <Flex width="90%" justify="space-between" mt={8}>
              <Button
                variant="outline"
                colorScheme="gray"
                borderRadius="xl"
                width="48%"
                height="50px"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                bg="#43eb7f"
                color="white"
                borderRadius="xl"
                width="48%"
                height="50px"
                _hover={{ bg: '#3ad073' }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default AccInfo;
