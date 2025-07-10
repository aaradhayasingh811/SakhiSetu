import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiDroplet,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertTriangle,
  FiInfo,
  FiZap,
  FiSun,
  FiMoon,
  FiDroplet as FiBlood,
  FiThermometer,
  FiBarChart2
} from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

// API Configuration
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Set auth token function
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// API Functions
const fetchCurrentCycle = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/cycles/current`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });

    console.log("Current Cycle Data:", response.data);

    return {
      cycleDay: response.data.cycleDay || 1,
      phase: response.data.phase || "Unknown",
      symptoms: response.data.symptoms || [],
      predictions: response.data.predictions || [],
    };
  } catch (error) {
    console.error("Error fetching cycle data:", error);
    throw error;
  }
};

const fetchHormoneData = async (currentDay) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    const response = await axios.post(
      `${API_URL}/prediction/hormones`,
      { currentDay },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      }
    );

    console.log(response.data.data)
    return response.data.data || {
      estrogen: 0,
      progesterone: 0,
      fsh: 0,
      lh: 0,
      insights: "No prediction data available"
    };
  } catch (error) {
    console.error("Error fetching hormone predictions:", error);
    return {
      estrogen: 0,
      progesterone: 0,
      fsh: 0,
      lh: 0,
      insights: "Prediction service unavailable"
    };
  }
};

const fetchSymptomTrends = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/cycles/trends`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });

    const trends = Array.isArray(response.data) ? response.data : [];
    const defaultSymptoms = ["Energy", "Mood", "Cramps", "Sleep"];

    return defaultSymptoms.map((symptom, index) => ({
      symptom,
      average: trends[index]?.average || Math.floor(Math.random() * 3) + 2,
    }));
  } catch (error) {
    console.error("Error fetching symptom trends:", error);
    throw error;
  }
};

// Phase colors mapping
const phaseColors = {
  "Menstrual": "bg-red-100 text-red-800",
  "Follicular": "bg-blue-100 text-blue-800",
  "Ovulation": "bg-yellow-100 text-yellow-800",
  "Luteal": "bg-purple-100 text-purple-800",
  "Unknown": "bg-gray-100 text-gray-800"
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {Number(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Cycle Status Card
const CycleStatusCard = ({ day, phase, lastLogged, loading, error }) => {
  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Cycle Status</h2>
        </div>
        <p className="text-sm text-red-500">Failed to load cycle data.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
            <FiCalendar size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Today at a Glance</h2>
        </div>
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <FiCalendar size={24} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Today at a Glance</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Cycle Day:</span>
          <span className="text-2xl font-bold text-blue-600">{day}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Phase:</span>
          <span className={`px-3 py-1 ${phaseColors[phase] || phaseColors["Unknown"]} rounded-full font-medium`}>
            {phase}
          </span>
        </div>

        {lastLogged && (
          <div className="pt-3 border-t border-gray-100">
            <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-white">
              <h3 className="font-semibold text-lg mb-3">Today's Log</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <FiSun className="text-yellow-500" />
                  <span className="text-sm">
                    <span className="font-medium">Energy:</span> {lastLogged.energy}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiThermometer className="text-red-500" />
                  <span className="text-sm">
                    <span className="font-medium">Pain:</span> {lastLogged.pain}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBlood className="text-pink-500" />
                  <span className="text-sm">
                    <span className="font-medium">Flow:</span> {lastLogged.flow || "None"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBarChart2 className="text-purple-500" />
                  <span className="text-sm">
                    <span className="font-medium">Mood:</span> {lastLogged.mood}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Hormone Prediction Card
const HormonePredictionCard = ({ predictions, loading, error }) => {
  const [activeTab, setActiveTab] = useState('estrogen');
  const [chartHeight, setChartHeight] = useState(250);
  
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(200);
      } else if (window.innerWidth < 768) {
        setChartHeight(220);
      } else {
        setChartHeight(250);
      }
    };

    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  const hormoneData = [
    { name: 'Day 1', estrogen: predictions?.estrogen * 0.2, progesterone: predictions?.progesterone * 0.2 },
    { name: 'Day 8', estrogen: predictions?.estrogen * 0.6, progesterone: predictions?.progesterone * 0.4 },
    { name: 'Day 16', estrogen: predictions?.estrogen, progesterone: predictions?.progesterone * 0.8 },
    { name: 'Day 24', estrogen: predictions?.estrogen * 0.4, progesterone: predictions?.progesterone },
  ];

  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100 lg:col-span-2"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Hormone Levels</h2>
        </div>
        <p className="text-sm text-red-500">Failed to load hormone data.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
            <FiActivity size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Hormone Levels</h2>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 lg:col-span-2"
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <FiActivity size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Hormone Predictions</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('estrogen')}
            className={`px-3 py-1 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'estrogen' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
          >
            Estrogen
          </button>
          <button 
            onClick={() => setActiveTab('progesterone')}
            className={`px-3 py-1 text-wrap rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'progesterone' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}
          >
            Progesterone
          </button>
          <button 
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'both' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            Both
          </button>
        </div>
      </div>

      <div className="h-[200px] sm:h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'both' ? (
            <LineChart data={hormoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="estrogen" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="progesterone" 
                stroke="#ff82c2" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={hormoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={activeTab} 
                fill={activeTab === 'estrogen' ? "#8884d8" : "#ff82c2"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-gradient-to-r from-purple-50 to-white p-3 rounded-lg border border-purple-100">
          <div className="text-purple-600 font-medium flex items-center gap-2 text-sm sm:text-base">
            <FiZap size={16} /> Estrogen
          </div>
          <div className="text-lg sm:text-xl font-bold mt-1">
            {predictions?.estrogen?.toFixed(2) || '0.00'} pg/mL
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-white p-3 rounded-lg border border-pink-100">
          <div className="text-pink-600 font-medium flex items-center gap-2 text-sm sm:text-base">
            <FiMoon size={16} /> Progesterone
          </div>
          <div className="text-lg sm:text-xl font-bold mt-1">
            {predictions?.progesterone?.toFixed(2) || '0.00'} ng/mL
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100">
          <div className="text-blue-600 font-medium flex items-center gap-2 text-sm sm:text-base">
            <FiActivity size={16} /> FSH
          </div>
          <div className="text-lg sm:text-xl font-bold mt-1">
            {predictions?.fsh?.toFixed(2) || '0.00'} mIU/mL
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-white p-3 rounded-lg border border-orange-100">
          <div className="text-orange-600 font-medium flex items-center gap-2 text-sm sm:text-base">
            <FiActivity size={16} /> LH
          </div>
          <div className="text-lg sm:text-xl font-bold mt-1">
            {predictions?.lh?.toFixed(2) || '0.00'} mIU/mL
          </div>
        </div>
      </div>

      {predictions?.insights && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-700">{predictions.insights}</p>
        </div>
      )}
    </motion.div>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, color, onClick, disabled }) => {
  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    const updateIconSize = () => {
      setIconSize(window.innerWidth < 640 ? 18 : 20);
    };

    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);

  return (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl shadow-sm border transition-all ${color} ${
        disabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : 
        "bg-white border-gray-100 hover:shadow-md"
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      <div className={`p-2 sm:p-3 rounded-full ${disabled ? "bg-gray-200" : color.replace('hover:', 'bg-')} mb-2`}>
        {React.cloneElement(icon, { size: iconSize })}
      </div>
      <span className={`text-xs sm:text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        {label}
      </span>
    </motion.button>
  );
};

// Quick Actions Panel
const QuickActions = ({ loading }) => {
  const navigate = useNavigate();
  
  const actions = [
    {
      icon: <FiDroplet className="text-pink-500" />,
      label: "Log Today",
      color: "hover:bg-pink-50",
      action: () => navigate("/tracker")
    },
    {
      icon: <FiMessageSquare className="text-blue-500" />,
      label: "Ask GPT",
      color: "hover:bg-blue-50",
      action: () => navigate("/gpt")
    },
    {
      icon: <FiTrendingUp className="text-purple-500" />,
      label: "Period Tracker",
      color: "hover:bg-purple-50",
      action: () => navigate("/period-tracker")
    },
    {
      icon: <FiShare2 className="text-green-500" />,
      label: "Partner Sync",
      color: "hover:bg-green-50",
      action: () => navigate("/partner")
    }
  ];

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100"
      whileHover={{ y: -2 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            color={action.color}
            onClick={action.action}
            disabled={loading}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Symptom Trends Card
const SymptomTrendsCard = ({ data, loading, error }) => {
  const [chartHeight, setChartHeight] = useState(200);

  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(180);
      } else if (window.innerWidth < 768) {
        setChartHeight(200);
      } else {
        setChartHeight(220);
      }
    };

    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  const chartData = data?.map(item => ({
    name: item.symptom,
    value: item.average
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Symptom Trends</h2>
        </div>
        <p className="text-sm text-red-500">Failed to load symptom trends.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
            <FiActivity size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Symptom Trends</h2>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-sm border border-green-100"
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <FiActivity size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Symptom Trends</h2>
        </div>
        <button className="text-xs px-3 py-1 bg-gray-100 rounded-lg text-gray-600 self-start sm:self-auto">
          Last 3 cycles
        </button>
      </div>

      <div className="h-[180px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// AI Insights Card
const AIInsightsCard = ({ prediction, loading, error }) => {
  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">AI Insights</h2>
        </div>
        <p className="text-sm text-red-500">Failed to load insights.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm border border-gray-100"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
            <FiActivity size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">AI Insights</h2>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <FiActivity size={24} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">AI Insights</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
        {prediction ? (
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{prediction}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiInfo className="flex-shrink-0" />
            <p>No insights available for your current cycle phase.</p>
          </div>
        )}
      </div>

      {/* <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Ask Follow-up
        </button>
      </div> */}
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [cycleData, setCycleData] = useState({
    cycleDay: 1,
    phase: "Loading...",
    symptoms: [],
    predictions: [],
  });
  const [hormonePredictions, setHormonePredictions] = useState({
    estrogen: 0,
    progesterone: 0,
    fsh: 0,
    lh: 0,
    insights: ""
  });
  const [symptomTrends, setSymptomTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    setAuthToken(token);
    return true;
  };

  const fetchData = async () => {
    try {
      if (!checkAuth()) return;

      setLoading(true);
      setError(null);

      const [cycleResponse, trendsResponse] = await Promise.all([
        fetchCurrentCycle().catch(e => {
          console.error("Cycle data error:", e);
          return { cycleDay: 1, phase: "Unknown", symptoms: [], predictions: [] };
        }),
        fetchSymptomTrends().catch(e => {
          console.error("Trends error:", e);
          return [];
        }),
      ]);

      setCycleData(cycleResponse);
      setSymptomTrends(trendsResponse);

      const predictionResponse = await fetchHormoneData(cycleResponse.cycleDay);
      setHormonePredictions(predictionResponse);
    } catch (err) {
      console.error("Dashboard error:", err);
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchData, 2000 * retryCount);
      } else {
        setError("Failed to load data. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tracker`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allLogs = response.data.data || [];
        setLogs(allLogs);

        const today = dayjs().format("YYYY-MM-DD");
        const logForToday = allLogs.find(log => dayjs(log.date).format("YYYY-MM-DD") === today);

        if (logForToday) {
          setTodayLog({
            ...logForToday,
            mood: logForToday.mood || "neutral",
            energy: classifyEnergy(logForToday.energyLevel),
            pain: classifyPain(logForToday.painLevel),
            flow: logForToday.flow || "None"
          });
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

  const classifyEnergy = (level) => {
    if (level < 4) return "Low energy";
    if (level <= 7) return "Medium energy";
    return "High energy";
  };

  const classifyPain = (level) => {
    if (level > 5) return "High pain";
    if (level >= 1) return "Low pain";
    return "No pain";
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error && retryCount >= 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FiAlertTriangle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <FiRefreshCw /> Try Again
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cycle Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500">Track your hormonal health journey</p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            {loading && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <FiRefreshCw className="animate-spin" /> Loading...
              </div>
            )}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 md:ml-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FiHeart className="text-purple-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Welcome back</p>
                <p className="text-sm sm:text-base font-medium text-gray-700">Hormone Warrior</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <CycleStatusCard
              day={`Day ${cycleData.cycleDay}`}
              phase={cycleData.phase}
              lastLogged={todayLog}
              loading={loading}
              error={error}
            />
            <QuickActions loading={loading} />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <HormonePredictionCard 
              predictions={hormonePredictions}
              loading={loading}
              error={error}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <SymptomTrendsCard 
                data={symptomTrends} 
                loading={loading} 
                error={error} 
              />
              <AIInsightsCard
                prediction={cycleData.predictions[0]?.prediction}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* Cycle Phase Info */}
        <motion.div 
          className="bg-gradient-to-r from-white to-indigo-50 rounded-2xl p-4 sm:p-6 shadow-sm border border-indigo-100 mb-6"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <FiInfo size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">About Your {cycleData.phase} Phase</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            {cycleData.phase === "Menstrual" && "During your menstrual phase, your body is shedding the uterine lining. Focus on rest and gentle movement."}
            {cycleData.phase === "Follicular" && "Your follicular phase is when energy typically increases. It's a great time for new projects and intense workouts."}
            {cycleData.phase === "Ovulation" && "Ovulation is when you're most fertile. Many people experience increased energy and libido during this phase."}
            {cycleData.phase === "Luteal" && "The luteal phase may bring PMS symptoms for some. Prioritize self-care and stress management during this time."}
            {cycleData.phase === "Unknown" && "Tracking your cycle will help us provide personalized insights for each phase."}
          </p>
          <button 
            className="px-3 sm:px-4 py-1 sm:py-2 bg-indigo-100 text-indigo-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-200 transition-colors"
            onClick={() => navigate("/education")}
          >
            Learn More About Cycle Phases
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;