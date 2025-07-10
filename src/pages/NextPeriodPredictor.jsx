import { useState } from 'react';
import { FiCalendar, FiClock, FiHeart, FiSun, FiMoon, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const NextPeriodPredictor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const predictNextPeriod = async () => {
    setIsLoading(true);
    setError(null);
    setShowEncouragement(false);

    try {
      const { data } = await axios.get('http://localhost:5000/api/prediction/predict-next-cycle', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(data);

      if (data.success && data.prediction) {
        setPrediction({
          predictedDate: data.prediction.predicted_date,
          cycleLength: data.prediction.predicted_length,
          earliest_likely_date: data.prediction.earliest_likely_date,
          latest_likely_date: data.prediction.latest_likely_date,
          confidence: 'high',
          selfCareTips: [
            "Stay hydrated with warm herbal teas",
            "Gentle yoga can help with cramps",
            "Consider increasing magnesium-rich foods"
          ]
        });
        setShowEncouragement(true);
      } else {
        throw new Error('Prediction failed.');
      }

      if(data.success == false){
        setError(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError('Atleast two of your cycles are required. Please fill in the cycle tracker first.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysRemaining = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const predictedDate = new Date(dateString);
    const diffTime = predictedDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCyclePhase = (daysRemaining) => {
    if (daysRemaining > 21) return { name: 'Follicular Phase', icon: <FiSun className="text-yellow-400" />, desc: 'Energy is rising!' };
    if (daysRemaining > 14) return { name: 'Ovulation', icon: <FiHeart className="text-pink-400" />, desc: 'Peak fertility window' };
    if (daysRemaining > 7) return { name: 'Luteal Phase', icon: <FiSun className="text-orange-400" />, desc: 'Productivity time' };
    return { name: 'Pre-Menstrual', icon: <FiMoon className="text-purple-400" />, desc: 'Time for self-care' };
  };

  return (
    <section className="max-w-3xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-2">Cycle Companion</h2>
        <p className="text-pink-600 text-sm sm:text-base">Understanding your rhythm, supporting your journey</p>
      </div>
      
      <div className="space-y-6">
        {/* Prediction Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pink-100">
          <div className="flex items-center mb-4">
            <div className="bg-pink-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
              <FiCalendar className="text-pink-600 text-lg sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Next Period Prediction</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Personalized forecast based on your unique cycle</p>
            </div>
          </div>
          
          <button
            onClick={predictNextPeriod}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl text-white font-medium flex items-center justify-center ${
              isLoading ? 'bg-pink-300' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
            } transition-all shadow-md hover:shadow-lg`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              'Predict My Next Cycle'
            )}
          </button>
        </div>

        {prediction && (
          <div className="space-y-4">
            {/* Prediction Results */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pink-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <FiClock className="text-purple-600 text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Your Prediction</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Based on your cycle patterns</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-5 rounded-lg mb-4">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Most likely start date</p>
                <p className="text-xl sm:text-2xl font-bold text-pink-700 my-2">
                  {formatDate(prediction.predictedDate)}
                </p>
                <div className="flex items-center text-purple-700 mt-3">
                  <span className="bg-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                    {calculateDaysRemaining(prediction.predictedDate)} days from now
                  </span>
                </div>
              </div>

              {/* Date Range Card */}
              <div className="rounded-xl bg-white border border-gray-200 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-pink-100 p-2 rounded-full">
                    <svg
                      className="h-5 w-5 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">Next Period Range</h4>
                    <p className="text-xs sm:text-sm text-gray-500">Based on your past cycles</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-center bg-pink-50 rounded-lg p-2 sm:p-3 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Earliest</p>
                      <p className="font-semibold text-pink-700">
                        {formatShortDate(prediction.earliest_likely_date)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-xs text-gray-400">to</span>
                    </div>
                    <div className="text-center bg-pink-50 rounded-lg p-2 sm:p-3 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Latest</p>
                      <p className="font-semibold text-pink-700">
                        {formatShortDate(prediction.latest_likely_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {showEncouragement && (
                <div className="mt-4 animate-fadeIn">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiHeart className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 text-sm sm:text-base">Remember</p>
                      <p className="text-blue-600 text-xs sm:text-sm">
                        Your body is unique. This prediction is an estimate based on your patterns.
                        Always listen to what your body tells you.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cycle Phase Card */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pink-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Current Cycle Phase</h3>
              <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl sm:text-3xl mr-3">
                    {getCyclePhase(calculateDaysRemaining(prediction.predictedDate)).icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base sm:text-lg">
                      {getCyclePhase(calculateDaysRemaining(prediction.predictedDate)).name}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {getCyclePhase(calculateDaysRemaining(prediction.predictedDate)).desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Self-Care Tips Card */}
            {prediction.selfCareTips && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Self-Care Suggestions</h3>
                <ul className="space-y-3">
                  {prediction.selfCareTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-pink-100 text-pink-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-4 sm:p-6 rounded-xl border border-red-100 animate-fadeIn">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                {/* <p className="font-medium text-red-800 text-sm sm:text-base">Something went wrong</p> */}
                <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-3 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Empty State */}
      {!prediction && !error && (
        <div className="mt-6 text-center text-gray-500">
          <p className="text-sm sm:text-base">We use your cycle history to provide personalized predictions and insights.</p>
          <p className="text-xs sm:text-sm mt-2">Click the button above to get started.</p>
        </div>
      )}
    </section>
  );
};

export default NextPeriodPredictor;