// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add a global error handler for Firestore connection issues
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    typeof event.reason.message === "string" &&
    event.reason.message.includes("ERR_BLOCKED_BY_CLIENT")
  ) {
    console.warn(
      "Firebase connection appears to be blocked by an extension. " +
        "Please check any ad blockers or privacy extensions that might " +
        "be interfering with the connection."
    );
  }
});
