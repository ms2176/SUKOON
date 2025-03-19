import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

// Energy consumption rates (in kWh)
const ENERGY_CONSUMPTION_RATES = {
  ac: {
    base: 1.5, // Base consumption per hour
    modes: {
      wind: 1.2,
      cool: 1.8,
      dry: 1.5,
      auto: 1.6,
    },
  },
  dishwasher: {
    base: 1.0, // Base consumption per hour
    modes: {
      cold: 0.8,
      warm: 1.2,
      hot: 1.5,
    },
  },
  tv: {
    base: 0.1, // Base consumption per hour
    // TV volume affects consumption slightly
    volumeMultiplier: 0.005, // per volume unit
  },
  light: {
    base: 0.06, // Base consumption per hour for LED lights
    // Brightness affects consumption linearly
    brightnessMultiplier: 0.01, // per brightness unit
    modes: {
      eco: 0.7, // Eco mode reduces consumption
      standard: 1.0,
      bright: 1.2,
    },
  },
  thermostat: {
    base: 0.05, // Base consumption for the thermostat itself
    // Actual heating/cooling energy would be calculated separately
    tempDiffMultiplier: 0.2, // per degree difference from ambient
  },
  fan: {
    base: 0.03, // Base consumption per hour for fans
    // RPM affects consumption quadratically
    rpmMultiplier: 0.0001, // per RPM unit
  },
  door: {
    base: 0.01, // Minimal consumption for smart locks/sensors
    // Locking/unlocking consumes a small amount of energy
    lockOperationConsumption: 0.005, // per lock/unlock operation
  },
  heatconvector: {
    base: 1.2, // Base consumption per hour
    // Temperature setting affects consumption
    tempMultiplier: 0.15, // per degree
  },
};

// Calculate energy for TV
const calculateTVEnergy = (tvData) => {
  const { on, volume } = tvData;
  if (!on) return 0;
  
  const volumeLevel = parseInt(volume) || 0;
  return ENERGY_CONSUMPTION_RATES.tv.base + (volumeLevel * ENERGY_CONSUMPTION_RATES.tv.volumeMultiplier);
};

// Calculate energy for Light
const calculateLightEnergy = (lightData) => {
  const { on, brightness, brightnessMode, autoMode } = lightData;
  if (!on) return 0;
  
  const brightnessLevel = parseInt(brightness) || 0;
  const modeMultiplier = ENERGY_CONSUMPTION_RATES.light.modes[autoMode] || 1.0;
  
  return (ENERGY_CONSUMPTION_RATES.light.base + 
         (brightnessLevel * ENERGY_CONSUMPTION_RATES.light.brightnessMultiplier)) * modeMultiplier;
};

// Calculate energy for Thermostat
const calculateThermostatEnergy = (thermostatData) => {
  const { on, temp } = thermostatData;
  if (!on) return 0;
  
  const targetTemp = parseInt(temp) || 22; // Default room temperature
  const ambientTemp = 20; // Assumed ambient temperature
  const tempDiff = Math.abs(targetTemp - ambientTemp);
  
  return ENERGY_CONSUMPTION_RATES.thermostat.base + 
         (tempDiff * ENERGY_CONSUMPTION_RATES.thermostat.tempDiffMultiplier);
};

// Calculate energy for Fan
const calculateFanEnergy = (fanData) => {
  const { on, rpm } = fanData;
  if (!on) return 0;
  
  const rpmValue = parseInt(rpm) || 1000; // Default RPM
  return ENERGY_CONSUMPTION_RATES.fan.base + 
         (rpmValue * rpmValue * ENERGY_CONSUMPTION_RATES.fan.rpmMultiplier);
};

// Calculate energy for Door
const calculateDoorEnergy = (doorData) => {
  const { on } = doorData;
  if (!on) return 0;
  
  // Doors consume very little energy, mostly in standby mode
  return ENERGY_CONSUMPTION_RATES.door.base;
};

// Calculate energy for Heat Convector
const calculateHeatConvectorEnergy = (heatConvectorData) => {
  const { on, temp } = heatConvectorData;
  if (!on) return 0;
  
  const tempSetting = parseInt(temp) || 20; // Default temperature
  return ENERGY_CONSUMPTION_RATES.heatconvector.base + 
         (tempSetting * ENERGY_CONSUMPTION_RATES.heatconvector.tempMultiplier);
};

// Simulate energy consumption for AC
const calculateACEnergy = (acData) => {
  const { on, windMode, autoMode, temp } = acData;
  if (!on) return 0;

  const tempSetting = parseInt(temp) || 24;
  const modeConsumption = ENERGY_CONSUMPTION_RATES.ac.modes[windMode] || 1.5;
  const autoModeMultiplier = autoMode === 'eco' ? 0.8 : 1; // Eco mode reduces consumption
  
  // Temperature affects consumption
  const tempFactor = tempSetting < 22 ? 1.2 : 1.0; // Lower temps consume more energy
  
  return ENERGY_CONSUMPTION_RATES.ac.base * modeConsumption * autoModeMultiplier * tempFactor;
};

// Simulate energy consumption for Dishwasher
const calculateDishwasherEnergy = (dishwasherData) => {
  const { on, waterTemp, length } = dishwasherData;
  if (!on) return 0;

  const modeConsumption = ENERGY_CONSUMPTION_RATES.dishwasher.modes[waterTemp.toLowerCase()] || 1.0;
  const durationHours = length ? parseFloat(length.replace(/hr/g, '')) : 1; // Extract hours from "2hr" format
  
  return ENERGY_CONSUMPTION_RATES.dishwasher.base * modeConsumption * durationHours;
};

// Function to calculate energy for any device type
const calculateDeviceEnergy = (deviceData) => {
  const { deviceType } = deviceData;
  
  switch (deviceType) {
    case 'ac':
      return calculateACEnergy(deviceData);
    case 'dishwasher':
      return calculateDishwasherEnergy(deviceData);
    case 'tv':
      return calculateTVEnergy(deviceData);
    case 'light':
      return calculateLightEnergy(deviceData);
    case 'thermostat':
      return calculateThermostatEnergy(deviceData);
    case 'fan':
      return calculateFanEnergy(deviceData);
    case 'door':
      return calculateDoorEnergy(deviceData);
    case 'heatconvector':
      return calculateHeatConvectorEnergy(deviceData);
    default:
      return 0;
  }
};

// Fetch devices and calculate total energy consumption
export const useEnergySimulator = () => {
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [deviceEnergies, setDeviceEnergies] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDevicesAndCalculateEnergy = async () => {
      const selectedHome = localStorage.getItem('selectedHome')
        ? JSON.parse(localStorage.getItem('selectedHome') as string)
        : null;

      if (!selectedHome || !selectedHome.hubCode) {
        console.error('No selected home or hubCode found');
        setLoading(false);
        return;
      }

      const db = getFirestore();
      const devicesRef = collection(db, 'devices');
      const devicesQuery = query(devicesRef, where('hubCode', '==', selectedHome.hubCode));
      const devicesSnapshot = await getDocs(devicesQuery);

      let total = 0;
      const energyByDevice: Record<string, number> = {};

      devicesSnapshot.forEach((doc) => {
        const deviceData = doc.data();
        const deviceEnergy = calculateDeviceEnergy(deviceData);
        
        energyByDevice[deviceData.deviceId] = deviceEnergy;
        total += deviceEnergy;
      });

      setDeviceEnergies(energyByDevice);
      setTotalEnergy(total);
      
      // Save energy data to Firestore if desired
      if (selectedHome.storeEnergyData) {
        await saveEnergyDataToFirestore(selectedHome.hubCode, total, energyByDevice);
      }
      
      setLoading(false);
    };

    fetchDevicesAndCalculateEnergy();
  }, []);

  return { totalEnergy, deviceEnergies, loading };
};

// Function to save energy data to Firestore
const saveEnergyDataToFirestore = async (hubCode: string, totalEnergy: number, deviceEnergies: Record<string, number>) => {
  try {
    const db = getFirestore();
    const timestamp = new Date();
    
    // Store energy usage in a subcollection of hubs
    await setDoc(doc(db, 'energyData', `${hubCode}_${timestamp.getTime()}`), {
      hubCode,
      timestamp,
      totalEnergy,
      deviceBreakdown: deviceEnergies,
    });
    
    console.log('Energy data saved to Firestore');
  } catch (error) {
    console.error('Error saving energy data to Firestore:', error);
  }
};