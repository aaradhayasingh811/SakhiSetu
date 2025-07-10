import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiDroplet,
  FiSmile,
  FiActivity,
  FiZap,
  FiMoon,
  FiCoffee,
  FiSave,
  FiMessageSquare
} from 'react-icons/fi';
import axios from 'axios';

const TrackerForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    periodStatus: '',
    flowLevel: '',
    mood: '',
    painLevel: 0,
    energyLevel: 5,
    notes: '',
    sleepQuality: false,
    foodCravings: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const moodOptions = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😤', label :"Irritated"},
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Get token from localStorage (assuming you store it there after login)
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      // Prepare the data to match backend expectations
      const payload = {
        date: formData.date,
        periodStatus: formData.periodStatus.toLowerCase(), 
        flowLevel: formData.flowLevel.toLowerCase(), 
        mood: formData.mood.toLowerCase(), 
        painLevel: Number(formData.painLevel),
        energyLevel: Number(formData.energyLevel),
        notes: formData.notes,
        sleepQuality: formData.sleepQuality,
        foodCravings: formData.foodCravings
      };
      console.log(payload)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tracker`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccessMessage(response.data.message || 'Your daily log has been saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form (except date)
      setFormData(prev => ({
        date: prev.date,
        periodStatus: '',
        flowLevel: '',
        mood: '',
        painLevel: 0,
        energyLevel: 5,
        notes: '',
        sleepQuality: false,
        foodCravings: false
      }));
    } catch (error) {
      console.error('Error saving log:', error);
      
      let errorMsg = 'Failed to save your log. Please try again.';
      if (error.response) {
        // Handle validation errors from backend
        if (error.response.data.errors) {
          errorMsg = Object.values(error.response.data.errors)
            .map(err => err.message)
            .join(', ');
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white">
          <h1 className="text-xl font-bold">Daily Health Tracker</h1>
          <p className="text-purple-100 text-sm mt-1">
            Log your symptoms and feelings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="text-gray-500" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Period Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiDroplet className="text-gray-500" />
                Period Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['None', 'Start', 'End', 'Ongoing'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, periodStatus: status }))}
                    className={`py-2 px-1 text-xs sm:text-sm rounded-lg font-medium ${
                      formData.periodStatus === status
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Level */}
          {formData.periodStatus && ['Start', 'Ongoing'].includes(formData.periodStatus) && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiDroplet className="text-gray-500" />
                Flow Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Light', 'Medium', 'Heavy'].map(flow => (
                  <button
                    key={flow}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, flowLevel: flow }))}
                    className={`py-2 px-1 text-xs sm:text-sm rounded-lg font-medium ${
                      formData.flowLevel === flow
                        ? 'bg-pink-100 text-pink-700 border border-pink-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mood */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiSmile className="text-gray-500" />
              Mood
            </label>
            <div className="grid grid-cols-5 gap-1">
              {moodOptions.map(({ emoji, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood: label }))}
                  className={`flex flex-col items-center p-1 rounded-lg ${
                    formData.mood === label
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pain Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiActivity className="text-gray-500" />
                Pain Level: {formData.painLevel}
              </label>
              <input
                type="range"
                name="painLevel"
                min="0"
                max="10"
                value={formData.painLevel}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiZap className="text-gray-500" />
                Energy Level: {formData.energyLevel}
              </label>
              <input
                type="range"
                name="energyLevel"
                min="1"
                max="10"
                value={formData.energyLevel}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Exhausted</span>
                <span>Energetic</span>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="sleepQuality"
                checked={formData.sleepQuality}
                onChange={handleChange}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <FiMoon className="text-gray-500" />
              Good sleep?
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="foodCravings"
                checked={formData.foodCravings}
                onChange={handleChange}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <FiCoffee className="text-gray-500" />
              Food cravings?
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiMessageSquare className="text-gray-500" />
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="How are you feeling today? Any specific symptoms?"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Daily Log
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TrackerForm;