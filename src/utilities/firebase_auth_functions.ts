// Firebase auth functions for Register.tsx
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "@/config/firebase_conf";

// Register new user
export const registerWithEmail = async (email: string, password: string) => {
  // const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Email/Password Login
export const loginWithEmail = async (email: string, password: string) => {
  // const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  // const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Apple Sign In
export const signInWithApple = async () => {
  // const auth = getAuth();
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");

  try {
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Password Reset
export const resetPassword = async (email: string) => {
  // const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
