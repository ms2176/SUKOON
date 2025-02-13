import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './energy.css';

const EnergyGeneration = () => {
  const navigate = useNavigate();
  const [livePowerOutput, setLivePowerOutput] = useState(100);
  const [efficiencyAndYieldData, setEfficiencyAndYieldData] = useState([
    { name: 'Jan', generated: 100, consumed: 50 },
    { name: 'Feb', generated: 120, consumed: 60 },
    { name: 'Mar', generated: 150, consumed: 70 },
  ]);
  const [sourceStatus, setSourceStatus] = useState<Record<string, string>>({
    'Solar Panel 1': 'Online',
    'Solar Panel 2': 'Offline',
    'Wind Turbine 1': 'Online',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePowerOutput(Math.random() * 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="energy-container">
      <header className="energy-header">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1>Energy Generation</h1>
        <p>Monitor and analyze your energy generation in real-time</p>
      </header>

      <section className="energy-live-power-output-widget">
        <h2>Live Power Output</h2>
        <p>{livePowerOutput} kW</p>
        <BarChart width={500} height={300} data={efficiencyAndYieldData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="generated" fill="#8884d8" />
          <Bar dataKey="consumed" fill="#82ca9d" />
        </BarChart>
      </section>

      <section className="energy-source-status-table">
        <h2>Source Status Table</h2>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(sourceStatus).map((source) => (
              <tr key={source}>
                <td>{source}</td>
                <td>{sourceStatus[source]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="energy-maintenance-and-repair">
        <h2>Maintenance and Repair</h2>
        <ul>
          <li>Schedule regular maintenance checks</li>
          <li>Get notified of any issues or faults</li>
          <li>Request repair or replacement of faulty components</li>
        </ul>
      </section>
    </div>
  );
};

export default EnergyGeneration;