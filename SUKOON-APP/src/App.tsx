// App.tsx
import { Route, Routes } from 'react-router-dom'; // Import Routes and Route
import Register from '@/customComponents/login/register.tsx';
import Auth from '@/customComponents/login/auth.tsx';
import Login from '@/customComponents/login/Login.tsx';
import Statistics from '@/customComponents/stats/stats_mainpage'; 
import EnergyConsumed from '@/customComponents/stats/energy_consumed';
import EnergyGenerated from '@/customComponents/stats/energy_generated';
import EnergyStored from '@/customComponents/stats/energy_stored';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />         {/* Home or Auth page */}
      <Route path="/login" element={<Login />} />   {/* Login page */}
      <Route path="/register" element={<Register />} /> {/* Register page */}
      <Route path="/stats" element={<Statistics />} /> {/* Statistics page */}
      <Route path="/stats/energy-consumed" element={<EnergyConsumed />} /> {/* Energy Consumed page */}
      <Route path="/stats/energy-generated" element={<EnergyGenerated/>} /> {/* Energy Generated page */}
      <Route path="/stats/energy-stored" element={<EnergyStored />} /> {/* Energy Stored page */}
    </Routes>
  );
};

export default App;