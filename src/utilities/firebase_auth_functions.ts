import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  User,
} from "firebase/auth";
import { auth } from "@/config/firebase_conf";

// Register new user
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Send verification email immediately after registration
    await sendEmailVerification(userCredential.user);
    return {
      success: true,
      user: userCredential.user,
      verified: false,
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
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
      verified: userCredential.user.emailVerified,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Check verification status
export const checkVerificationStatus = (
  callback: (isVerified: boolean) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.emailVerified);
    } else {
      callback(false);
    }
  });
};

// Resend verification email
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: false,
      error: "No user is currently signed in",
    };
  }

  try {
    await sendEmailVerification(user);
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

// Google Sign In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user,
      verified: result.user.emailVerified,
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
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");

  try {
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user,
      verified: result.user.emailVerified,
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

// Get current auth state
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Helper to check if email exists
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch {
    return false;
  }
};
