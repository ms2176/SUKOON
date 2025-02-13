import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './energy.css';

const EnergyConsumption = () => {
  const navigate = useNavigate();
  const [realTimeData, setRealTimeData] = useState({
    'Living Room': 10,
    'Kitchen': 20,
    'Master Bedroom': 30,
  });
  const [historicalData, setHistoricalData] = useState([
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 120 },
    { name: 'Mar', value: 150 },
  ]);
  const [consumptionBreakdown, setConsumptionBreakdown] = useState([
    { appliance: 'Living Room', usage: 100, peakHours: 50, offPeakHours: 50 },
    { appliance: 'Kitchen', usage: 200, peakHours: 100, offPeakHours: 100 },
    { appliance: 'Master Bedroom', usage: 300, peakHours: 150, offPeakHours: 150 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        'Living Room': Math.random() * 100,
        'Kitchen': Math.random() * 100,
        'Master Bedroom': Math.random() * 100,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="energy-container">
      <header className="energy-header">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1>Energy Consumption</h1>
        <p>Monitor and analyze your energy consumption in real-time</p>
      </header>

      <section className="energy-real-time-monitoring">
        <h2>Real-Time Monitoring</h2>
        <ul>
          {Object.keys(realTimeData).map((appliance) => (
            <li key={appliance}>
              {appliance}: <strong>{realTimeData[appliance].toFixed(2)} kW</strong>
            </li>
          ))}
        </ul>
        <LineChart width={500} height={300} data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </section>

      <section className="energy-consumption-breakdown-table">
        <h2>Consumption Breakdown Table</h2>
        <table>
          <thead>
            <tr>
              <th>Appliance</th>
              <th>Usage (kW)</th>
              <th>Peak Hours (kW)</th>
              <th>Off-Peak Hours (kW)</th>
            </tr>
          </thead>
          <tbody>
            {consumptionBreakdown.map((row) => (
              <tr key={row.appliance}>
                <td>{row.appliance}</td>
                <td>{row.usage}</td>
                <td>{row.peakHours}</td>
                <td>{row.offPeakHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="energy-tips-and-recommendations">
        <h2>Tips and Recommendations</h2>
        <ul>
          <li>Turn off lights and appliances when not in use</li>
          <li>Use energy-efficient light bulbs and appliances</li>
          <li>Adjust your thermostat to use less energy for heating and cooling</li>
        </ul>
      </section>
    </div>
  );
};

export default EnergyConsumption; 