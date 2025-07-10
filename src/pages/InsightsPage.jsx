import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiActivity,
  FiTrendingUp,
  FiFilter,
  FiDownload,
  FiMessageSquare,
  FiCalendar
} from 'react-icons/fi';
import MoodCycleGraph from '../components/MoodCycleGraph';
import HormoneTwin from '../components/HormoneTwin';

const InsightsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cycleData, setCycleData] = useState(null);
  const [filter, setFilter] = useState('3');
  const [gptRecommendation, setGptRecommendation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/insights?cycles=${filter}`);
        setCycleData(response.data);
        
        // Fetch GPT recommendations
        const gptResponse = await axios.post('/api/gpt-recommendations', {
          cycleData: response.data
        });
        setGptRecommendation(gptResponse.data.recommendation);
        
        setError(null);
      } catch (err) {
        // setError(err.response?.data?.message || 'Failed to fetch insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleExportPDF = async () => {
    try {
      const response = await axios.get('/api/export-pdf', {
        responseType: 'blob',
        params: { cycles: filter }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hormonal-insights-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cycle Insights</h1>
            <p className="text-gray-600">Advanced analytics for your hormonal health</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="3">Last 3 cycles</option>
                <option value="6">Last 6 cycles</option>
                <option value="12">Last 12 cycles</option>
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiDownload />
              <span>Export PDF</span>
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* GPT Recommendations */}
            {gptRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 mb-6 border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FiMessageSquare size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">AI Recommendations</h2>
                </div>
                <p className="text-gray-700">{gptRecommendation}</p>
              </motion.div>
            )}

            {/* Mood Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  <FiActivity size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Mood Patterns</h2>
              </div>
              {cycleData ? (
                <div className="h-64">
                  <MoodCycleGraph data={cycleData.moodData} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No mood data available
                </div>
              )}
              <div className="mt-3 text-sm text-gray-500">
                <FiCalendar className="inline mr-1" />
                Showing last {filter} cycles
              </div>
            </motion.div>

            {/* Hormone Curve */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FiTrendingUp size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Hormone Trends</h2>
              </div>
              {cycleData ? (
                <div className="h-64">
                  <HormoneTwin data={cycleData.hormoneData} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No hormone data available
                </div>
              )}
              <div className="mt-3 text-sm text-gray-500">
                <FiCalendar className="inline mr-1" />
                Modeled from your cycle patterns
              </div>
            </motion.div>

            {/* Additional Analytics Sections can be added here */}
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;