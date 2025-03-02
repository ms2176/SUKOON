// App.tsx
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import Register from '@/customComponents/login/register.tsx';
import Auth from '@/customComponents/login/auth.tsx';
import Login from '@/customComponents/login/Login.tsx';
import QRWait from '@/customComponents/login/QRWait.tsx';
import ResetPassword from '@/customComponents/login/ResetPassword.tsx';
import OTP from '@/customComponents/login/OTP.tsx';
import NewPass from '@/customComponents/login/NewPass.tsx';
import Statistics from '@/customComponents/stats/stats_mainpage'; // Ensure the correct path to your Statistics component
import Homepage from './customComponents/homepage/Homepage';
import NavbarTenant from './customComponents/navBar/NavbarTenant';
import NavbarAdmin from './customComponents/navBar/NavbarAdmin';
import RoomList from './customComponents/rooms/roomsList';
import Devices from './customComponents/rooms/devices';
import AccountsPage from './customComponents/account/AccountsPage';
import AccInfo from './customComponents/account/AccInfo';
import DeviceControlPage from './customComponents/rooms/DeviceControlPage';
import BeatiMain from './customComponents/beati/beatiMain';
import MyGreenhouse from './customComponents/beati/myGreenhouse';
import Rate from './customComponents/account/Rate'
import MoreTools from './customComponents/account/MoreTools';
import ThirdPartyServices from './customComponents/account/ThirdPartyServices';
import InitialView from './customComponents/homepage/InitialView';
import SupportCenter from './customComponents/account/SupportCenter';
import './index.css';
import homesdata from '@/JSONFiles/homesdata.json';
import { useState } from 'react';
import LightsControlPage from './customComponents/rooms/deviceconfigurations/LightsControlPage'
import Washingmachine from './customComponents/rooms/deviceconfigurations/Washingmachine'

interface Home {
  homeName: string;
  homeType: string;
}

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  selectedHome?: Home | null; // Add selectedHome as an optional prop
}
// Layout component that includes the Navbar
const AuthenticatedLayout = ({ children, selectedHome }: AuthenticatedLayoutProps) => {
  return (
    <>
      {selectedHome?.homeType === 'admin' ? <NavbarAdmin /> : <NavbarTenant />}
      {children}
    </>
  );
};

const App = () => {
  const location = useLocation();

  // Define the routes that require authentication
  const authenticatedRoutes = ['/Home', '/stats'];
  const [selectedHome, setSelectedHome] = useState<Home | null>(null); // State for selected home

  // Check if the current route is an authenticated route
  const isAuthenticatedRoute = authenticatedRoutes.includes(location.pathname);
  const handleSelectHome = (home: Home) => {
    setSelectedHome(home);
  };

  return (
    <>
        {isAuthenticatedRoute && (
                selectedHome?.homeType === 'admin' ? <NavbarAdmin /> : <NavbarTenant />
              )}      <Routes>
        <Route path="/" element={<Auth />} />         {/* Home or Auth page */}
        <Route path="/login" element={<Login />} />   {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/QRWait" element={<QRWait />} /> {/* QR Wait page */}
        <Route path="/ResetPassword" element={<ResetPassword />} /> {/* Reset Password page */}
        <Route path="/OTP" element={<OTP />} /> {/* OTP page */}
        <Route path="/NewPass" element={<NewPass />} /> {/* New Password page */}

        {/* Actual App */}
        <Route path="/Home" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <Homepage onSelectHome={handleSelectHome} selectedHome={selectedHome}/>
          </AuthenticatedLayout>
        } /> {/* Homepage */}

        <Route path="/Rooms" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <RoomList />
          </AuthenticatedLayout>
        } /> {/* Rooms */}

        <Route path="/devices/:roomId" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <Devices />
          </AuthenticatedLayout>
        } /> {/* Room page */}

<Route path="/devices/:roomId/:deviceId" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <DeviceControlPage />
          </AuthenticatedLayout>
        } />

<Route path="/lights" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <LightsControlPage />
          </AuthenticatedLayout>
        } />

        <Route path="/washing" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <Washingmachine />
          </AuthenticatedLayout>
        } />

        <Route path="/stats" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <Statistics />
          </AuthenticatedLayout>
        } /> {/* Statistics page */}

      <Route path="/accountspage" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <AccountsPage />
          </AuthenticatedLayout>
        } /> {/* Account page */}

        <Route path="/accinfo" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <AccInfo />
          </AuthenticatedLayout>
        } /> {/* AccountInfo page */}

        <Route path="/beati" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <BeatiMain />
          </AuthenticatedLayout>
        } /> {/* beati page */}

<Route path="/myGreenhouse" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <MyGreenhouse />
          </AuthenticatedLayout>
        } /> {/* greenhouse page */}

<Route path="/rate" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <Rate />
          </AuthenticatedLayout>
        } /> {/* rate page */}
      
      <Route path="/tools" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <MoreTools />
          </AuthenticatedLayout>
        } /> {/* tools page */}

<Route path="/services" element={
          <AuthenticatedLayout selectedHome={selectedHome}>
            <ThirdPartyServices />
          </AuthenticatedLayout>
        } /> {/* TPS page */}

      
      </Routes>
      

      
    </>
  );
};

export default App;