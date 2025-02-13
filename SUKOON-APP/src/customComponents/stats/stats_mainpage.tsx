import { useState, useEffect, useMemo } from 'react';
import { ArrowLeftIcon, ChartBarIcon, BoltIcon, SunIcon, CurrencyDollarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './stats_mainpage.css';

interface RoomData {
  room: string;
  devices: number;
  usage: number;
  trend: number;
  icon: string;
}

const Statistics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Daily');
  const [sortOption, setSortOption] = useState('Highest Usage');
  const [liveData, setLiveData] = useState(0);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev + Math.random() * 10 - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate chart data based on timeRange
  const chartData = useMemo(() => {
    switch (timeRange) {
      case 'Daily':
        return Array.from({ length: 24 }, (_, i) => ({
          name: `${i}:00`,
          value: Math.random() * 100 + 50
        }));
      case 'Monthly':
        return Array.from({ length: 30 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.random() * 100 + 50
        }));
      case 'Yearly':
        return Array.from({ length: 12 }, (_, i) => ({
          name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          value: Math.random() * 100 + 50
        }));
      default:
        return [];
    }
  }, [timeRange]);

  const rooms: RoomData[] = useMemo(() => [
    { room: 'Living Room', devices: 5, usage: 985, trend: 2.3, icon: '🛋️' },
    { room: 'Kitchen', devices: 10, usage: 875, trend: -1.5, icon: '🍳' },
    { room: 'Master Bedroom', devices: 12, usage: 742, trend: 0.8, icon: '🛏️' },
    { room: 'Kids Bedroom', devices: 4, usage: 589, trend: -2.1, icon: '🎮' },
    { room: 'Bathroom', devices: 7, usage: 500, trend: 1.4, icon: '🚿' },
  ], []);

  // Sort rooms based on selection
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      switch (sortOption) {
        case 'Highest Usage':
          return b.usage - a.usage;
        case 'Lowest Usage':
          return a.usage - b.usage;
        case 'Most Devices':
          return b.devices - a.devices;
        default:
          return 0;
      }
    });
  }, [rooms, sortOption]);

  const userName = "John"; // This would come from your auth context/state

  const energyCards = [
    {
      title: 'Energy Generated',
      subtitle: 'Total power from renewable sources',
      value: 2345 + Math.round(liveData),
      trend: 12.3,
      icon: SunIcon,
      path: '/stats/energy-generated'
    },
    {
      title: 'Energy Consumed',
      subtitle: 'Total power consumption',
      value: 1890 + Math.round(liveData),
      trend: -5.2,
      icon: ChartBarIcon,
      path: '/stats/energy-consumed'
    },
    {
      title: 'Energy Stored',
      subtitle: 'Available battery power',
      value: 1234 + Math.round(liveData),
      trend: 8.7,
      icon: BoltIcon,
      path: '/stats/energy-stored'
    },
    {
      title: 'Total Cost',
      subtitle: 'Monthly estimated cost',
      value: ((1890 + Math.round(liveData)) * 0.12).toFixed(2),
      trend: 3.4,
      icon: CurrencyDollarIcon,
      unit: '$'
    }
  ];

  const costRate = 0.12; // Example rate per kWh
  
  const calculateCost = (usage: number, rate: number) => {
    return (usage * rate).toFixed(2); // Returns cost in string format
  };

  const totalCost = calculateCost(energyCards.reduce((acc, card) => acc + card.value, 0), costRate);

  const handleDownload = () => {
    // You can integrate Typst here
    // Example: Generate a report with Typst
    const data = {
      timeRange,
      timestamp: new Date().toISOString(),
      chartData,
      rooms: sortedRooms
    };
    
    // For now, just download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `energy-report-${timeRange.toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="statistics-container">
      <div className="welcome-section">
        <h1>Your Stats, <span className="user-name">{userName}</span></h1>
      </div>

      <div className="chart-section">
        <div className="chart-controls">
          <div className="time-range">
            {['Daily', 'Monthly', 'Yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`time-button ${timeRange === range ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="download-button" onClick={handleDownload}>
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064e3b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#064e3b" 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="energy-cards">
        {energyCards.map((card) => (
          <div key={card.title} onClick={() => navigate(card.path)} className="energy-card">
            <div className="card-content">
              <div className="card-header">
                <div>
                  <h3>{card.title}</h3>
                  <p className="card-subtitle">{card.subtitle}</p>
                </div>
                <card.icon className="card-icon" />
              </div>
              <div className="card-footer">
                <p className="card-value">
                  {card.unit || ''}{card.value} {!card.unit && 'kWh'}
                </p>
                <span className={`card-trend ${card.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {card.trend > 0 ? '↑' : '↓'} {Math.abs(card.trend)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      

      <div className="rooms-section">
        <div className="rooms-header">
          <h2>Usage Per Room</h2>
          <select 
            className="sort-select" 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Highest Usage</option>
            <option>Lowest Usage</option>
            <option>Most Devices</option>
          </select>
        </div>
        <div className="rooms-list">
          {sortedRooms.map((room) => (
            <div key={room.room} className="room-usage">
              <div className="room-info">
                <span className="room-icon">{room.icon}</span>
                <div>
                  <h3>{room.room}</h3>
                  <p>{room.devices} Devices</p>
                </div>
              </div>
              <div className="usage-info">
                <p className="usage-value">{room.usage} kWh</p>
                <span className={`usage-trend ${room.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {room.trend > 0 ? '↑' : '↓'} {Math.abs(room.trend)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for bottom nav */}
      <div className="bottom-nav-placeholder" />
    </div>
  );
};

export default Statistics;