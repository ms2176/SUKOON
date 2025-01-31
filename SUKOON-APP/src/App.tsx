// App.tsx
import { Route, Routes } from 'react-router-dom'; // Import Routes and Route
import Register from '@/customComponents/login/register.tsx';
import Auth from '@/customComponents/login/auth.tsx';
import Login from '@/customComponents/login/Login.tsx';
import QRWait from '@/customComponents/login/QRWait.tsx';
import ResetPassword from '@/customComponents/login/ResetPassword.tsx';
import OTP from '@/customComponents/login/OTP.tsx';
import NewPass from '@/customComponents/login/NewPass.tsx';
import Statistics from '@/customComponents/stats/stats_mainpage'; // Ensure the correct path to your Statistics component
import Homepage from './customComponents/homepage/Homepage';

const App = () => {
  return (
    <Homepage />
  );
};

export default App;