// App.tsx
import { Route, Routes } from "react-router-dom"; // Import Routes and Route
import Register from "@/customComponents/login/register.tsx";
import Auth from "@/customComponents/login/auth.tsx";
import Login from "@/customComponents/login/Login.tsx";
import QRWait from "@/customComponents/login/QRWait.tsx";
import ResetPassword from "@/customComponents/login/ResetPassword.tsx";
import OTP from "@/customComponents/login/OTP.tsx";
import NewPass from "@/customComponents/login/NewPass.tsx";
import Statistics from "@/customComponents/stats/stats_mainpage"; // Ensure the correct path to your Statistics component
import EmailConfirm from "./customComponents/login/EmailConfirm";
import VerifyEmail from "@/customComponents/login/verification_hold";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} /> {/* Home or Auth page */}
      <Route path="/login" element={<Login />} /> {/* Login page */}
      <Route path="/register" element={<Register />} /> {/* Register page */}
      <Route path="/QRWait" element={<QRWait />} /> {/* QR Wait page */}
      <Route path="/ResetPassword" element={<ResetPassword />} />{" "}
      {/* Reset Password page */}
      <Route path="/OTP" element={<OTP />} /> {/* OTP page */}
      <Route path="/NewPass" element={<NewPass />} /> {/* New Password page */}
      <Route path="/EmailConf" element={<EmailConfirm />} />{" "}
      {/* New Password page */}
      <Route path="/stats" element={<Statistics />} /> {/* Statistics page */}
      <Route path="/verification_hold" element={<VerifyEmail />} />
    </Routes>
  );
};

export default App;
