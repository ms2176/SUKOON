// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLbsGvxMJnS6b74hfVzEjI8XxqCqS-QuE",
  authDomain: "sukoonhome-4aa48.firebaseapp.com",
  projectId: "sukoonhome-4aa48",
  storageBucket: "sukoonhome-4aa48.firebasestorage.app",
  messagingSenderId: "1018858628021",
  appId: "1:1018858628021:web:de8e025a2ed5a57ace6ffc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);