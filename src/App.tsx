import { Route, Routes, useLocation } from 'react-router-dom';
import Register from '@/customComponents/login/register.tsx';
import Auth from '@/customComponents/login/auth.tsx';
import Login from '@/customComponents/login/Login.tsx';
import QRWait from '@/customComponents/login/QRWait.tsx';
import ResetPassword from '@/customComponents/login/ResetPassword.tsx';
import OTP from '@/customComponents/login/OTP.tsx';
import NewPass from '@/customComponents/login/NewPass.tsx';
import Statistics from '@/customComponents/stats/stats_mainpage';
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
import Rate from './customComponents/account/Rate';
import MoreTools from './customComponents/account/MoreTools';
import ThirdPartyServices from './customComponents/account/ThirdPartyServices';
import InitialView from './customComponents/homepage/InitialView';
import SupportCenter from './customComponents/account/SupportCenter';
import './index.css';
import { useState } from 'react';
import Verification_hold from './customComponents/login/verification_hold';
import Alldevices from './customComponents/rooms/Alldevices';
import DeviceControlPageNoRoom from './customComponents/rooms/DeviceControlPageNoRoom';
import UnitsList from './customComponents/rooms/unitsList';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  selectedHome?: Home | null;
  homes: Home[]; // Add homes prop
}

// Layout component that includes the Navbar
const AuthenticatedLayout = ({ children, selectedHome, homes }: AuthenticatedLayoutProps) => {
  return (
    <>
      {selectedHome?.homeType === 'admin' ? <NavbarAdmin /> : <NavbarTenant homes={homes} />}
      {children}
    </>
  );
};

const App = () => {
  const location = useLocation();
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [homes, setHomes] = useState<Home[]>([]); // Add homes state

  // Define the routes that require authentication
  const authenticatedRoutes = ['/Home', '/stats'];

  // Check if the current route is an authenticated route
  const isAuthenticatedRoute = authenticatedRoutes.includes(location.pathname);

  // Function to handle home selection
  const handleSelectHome = (home: Home) => {
    setSelectedHome(home);
  };

  // Function to update the homes state
  const handleHomeAdded = (newHomes: Home[]) => {
    setHomes(newHomes); // Update the homes state
  };

  const handleHomeRename = (renamedHomes: Home[]) => {
    setHomes(renamedHomes); // Update local state
  };
  

  console.log('Current path:', location.pathname); // Debugging

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userHubsRef = collection(db, 'userHubs');
        const q = query(userHubsRef, where('userId', '==', userId));

        try {
          const querySnapshot = await getDocs(q);
          const hubs = querySnapshot.docs.map(doc => ({
            homeName: doc.data().homeName,
            homeType: doc.data().homeType,
            hubCode: doc.data().hubCode,
          }));
          setHomes(hubs); // Update global homes state
        } catch (error) {
          console.error('Error fetching hubs:', error);
        }
      } else {
        setHomes([]); // Clear homes if user logs out
      }
    });

    

    return () => unsubscribe();
  }, []);

  const fetchHomes = async () => {
      const auth = getAuth();
      const db = getFirestore();
  
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
  
        const hubsRef = collection(db, 'userHubs');
        const q = query(hubsRef, where('userId', '==', userId));
  
        try {
          const querySnapshot = await getDocs(q);
          const homesData: Home[] = [];
  
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            homesData.push({
              homeName: data.homeName,
              homeType: data.homeType,
              hubCode: data.hubCode,
            });
          });
  
          setHomes(homesData);
        } catch (error) {
          console.error('Error fetching user hubs:', error);
        }
      }
    };
  
    useEffect(() => {
      fetchHomes();
    }, []);

  const handleHomeDeleted = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const userHubsRef = collection(db, 'userHubs');
    const q = query(userHubsRef, where('userId', '==', user.uid));

    try {
      const querySnapshot = await getDocs(q);
      const hubs = querySnapshot.docs.map(doc => ({
        homeName: doc.data().homeName,
        homeType: doc.data().homeType,
        hubCode: doc.data().hubCode,
      }));
      setHomes(hubs);
    } catch (error) {
      console.error('Error refreshing homes:', error);
    }
  };

  

  

  return (
    <>
      {isAuthenticatedRoute && (
        selectedHome?.homeType === 'admin' ? <NavbarAdmin /> : <NavbarTenant homes={homes} />
      )}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/QRWait" element={<QRWait />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/NewPass" element={<NewPass />} />

        {/* Actual App */}
        <Route
          path="/Home"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Homepage onHomeRename={handleHomeRename} onHomeDelete={handleHomeDeleted} onSelectHome={handleSelectHome} selectedHome={selectedHome} onHomeAdded={handleHomeAdded} homes={homes}/>
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/initial"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <InitialView onSelectHome={handleSelectHome} selectedHome={selectedHome} onHomeAdded={handleHomeAdded}/>
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/Rooms"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <RoomList selectedHome={selectedHome} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/unitsList"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <UnitsList selectedHome={selectedHome} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/support"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <SupportCenter selectedHome={selectedHome} />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/device/:deviceId"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <DeviceControlPageNoRoom />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/devices/:roomId/:deviceId"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <DeviceControlPage />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/devices/:roomId"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Devices />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/alldevices"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Alldevices />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/verification_hold"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Verification_hold />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/stats"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Statistics />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/accountspage"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <AccountsPage />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/accinfo"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <AccInfo />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/beati"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <BeatiMain />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/myGreenhouse"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <MyGreenhouse />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/rate"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <Rate />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/tools"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <MoreTools />
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/services"
          element={
            <AuthenticatedLayout selectedHome={selectedHome} homes={homes}>
              <ThirdPartyServices />
            </AuthenticatedLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;