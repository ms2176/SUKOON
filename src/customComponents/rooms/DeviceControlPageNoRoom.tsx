import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LightsControlPage from './deviceconfigurations/LightsControlPage';
import Washingmachine from './deviceconfigurations/Washingmachine';
import Dishwasher from './deviceconfigurations/Dishwasher';
import Heatconvector from './deviceconfigurations/Heatconvector';
import Smartdoor from './deviceconfigurations/Smartdoor';
import Fan from './deviceconfigurations/Fan';
import TV from './deviceconfigurations/TV';
import Thermo from './deviceconfigurations/Thermo';
import Speaker from './deviceconfigurations/Speaker';
import AC from './deviceconfigurations/ACControlPage';

interface Device {
  deviceType: string;
}

const DeviceControlPageNoRoom = () => {
  const { deviceId } = useParams<{ deviceId: string }>(); // Only deviceId is needed
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      if (deviceId) {
        const db = getFirestore();
        const deviceDocRef = doc(db, 'devices', deviceId);

        try {
          const deviceDocSnap = await getDoc(deviceDocRef);
          if (deviceDocSnap.exists()) {
            const deviceData = deviceDocSnap.data();
            if (deviceData.deviceType) {
              setDevice({ deviceType: deviceData.deviceType });
            } else {
              console.error('Device data is missing deviceType');
            }
          } else {
            console.error('Device not found');
          }
        } catch (error) {
          console.error('Error fetching device:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDevice();
  }, [deviceId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!device) {
    return <div>Device not found</div>;
  }

  // Render the appropriate component based on deviceType
  switch (device.deviceType) {
    case 'light':
      return <LightsControlPage deviceId={deviceId!} />;
    case 'washingMachine':
      return <Washingmachine deviceId={deviceId!} />;
    case 'dishwasher':
      return <Dishwasher deviceId={deviceId!} />;
    case 'heatconvector':
      return <Heatconvector deviceId={deviceId!} />;
    case 'door':
      return <Smartdoor deviceId={deviceId!} />;
    case 'fan':
      return <Fan deviceId={deviceId!} />;
    case 'tv':
      return <TV deviceId={deviceId!} />;
    case 'thermostat':
      return <Thermo deviceId={deviceId!} />;
    case 'speaker':
      return <Speaker deviceId={deviceId!} />;
    case 'ac':
      return <AC deviceId={deviceId!} />;
    default:
      return <div>Unknown device type</div>;
  }
};

export default DeviceControlPageNoRoom;