import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BoltIcon } from '@heroicons/react/24/outline';
import './energy.css';

const EnergyStorage = () => {
  const navigate = useNavigate();
  const [batteryChargeLevel, setBatteryChargeLevel] = useState(50);
  const [chargeDischargeData, setChargeDischargeData] = useState([
    { name: 'Jan', charge: 100, discharge: 50 },
    { name: 'Feb', charge: 120, discharge: 60 },
    { name: 'Mar', charge: 150, discharge: 70 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryChargeLevel(Math.random() * 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="energy-container">
      <header className="energy-header">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1>Energy Storage</h1>
        <p>Monitor and analyze your energy storage in real-time</p>
      </header>

      <section className="energy-battery-charge-level-indicator">
        <h2>Battery Charge Level Indicator</h2>
        <p>{batteryChargeLevel}%</p>
        <AreaChart width={500} height={300} data={chargeDischargeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="charge" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="discharge" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </section>

      <section className="energy-smart-storage-management-panel">
        <h2>Smart Storage Management Panel</h2>
        <p>Configure your energy storage settings for optimal performance</p>
        <ul>
          <li>Set charge and discharge thresholds</li>
          <li>Configure smart charging and discharging algorithms</li>
          <li>Monitor and adjust energy storage performance in real-time</li>
        </ul>
      </section>

      <section className="energy-battery-maintenance-and-replacement">
        <h2>Battery Maintenance and Replacement</h2>
        <p>Get notifications and schedule maintenance and replacement for your energy storage batteries</p>
        <ul>
          <li>Schedule regular maintenance checks</li>
          <li>Get notified of any issues or faults</li>
          <li>Request replacement of faulty batteries</li>
        </ul>
      </section>
    </div>
  );
};

export default EnergyStorage;