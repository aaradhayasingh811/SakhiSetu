// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiUser, FiMail, FiLock, FiCalendar, FiClock } from 'react-icons/fi';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     age: '',
//     cycleLength: '',
//     lastPeriodStart: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user types
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     if (!formData.age) {
//       newErrors.age = 'Age is required';
//     } else if (isNaN(formData.age)) {
//       newErrors.age = 'Age must be a number';
//     } else if (formData.age < 13 || formData.age > 60) {
//       newErrors.age = 'Age must be between 13-60';
//     }
//     if (!formData.cycleLength) {
//       newErrors.cycleLength = 'Cycle length is required';
//     } else if (isNaN(formData.cycleLength)) {
//       newErrors.cycleLength = 'Cycle length must be a number';
//     } else if (formData.cycleLength < 21 || formData.cycleLength > 45) {
//       newErrors.cycleLength = 'Cycle length must be between 21-45 days';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError('');
    
//     if (!validate()) return;

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         age: parseInt(formData.age),
//         avgCycleLength: parseInt(formData.cycleLength),
//         lastPeriodStart: formData.lastPeriodStart || null
//       });

//       // Store token and redirect
//       localStorage.setItem('token', response.data.token);
//       navigate('/dashboard');
//     } catch (error) {
//       setApiError(error.response?.data?.message || error.message || 'Registration failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
//       >
//         <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 sm:p-6 text-center">
//           <h1 className="text-xl sm:text-2xl font-bold text-white">Create Your Account</h1>
//           <p className="text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base">
//             Start your personalized hormonal health journey
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
//           {apiError && (
//             <div className="bg-red-50 text-red-600 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
//               {apiError}
//             </div>
//           )}

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Full Name</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiUser className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`pl-9 sm:pl-10 w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
//                 placeholder="Your name"
//               />
//             </div>
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Email</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiMail className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`pl-9 sm:pl-10 w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
//                 placeholder="your@email.com"
//               />
//             </div>
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Password</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`pl-9 sm:pl-10 w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
//                 placeholder="At least 6 characters"
//               />
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Age</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiUser className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="number"
//                 name="age"
//                 min="13"
//                 max="60"
//                 value={formData.age}
//                 onChange={handleChange}
//                 className={`pl-9 sm:pl-10 w-full rounded-lg border ${errors.age ? 'border-red-500' : 'border-gray-300'} p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
//                 placeholder="Your age"
//               />
//             </div>
//             {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Average Cycle Length (days)</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiClock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="number"
//                 name="cycleLength"
//                 min="21"
//                 max="45"
//                 value={formData.cycleLength}
//                 onChange={handleChange}
//                 className={`pl-9 sm:pl-10 w-full rounded-lg border ${errors.cycleLength ? 'border-red-500' : 'border-gray-300'} p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
//                 placeholder="Typically 28-32 days"
//               />
//             </div>
//             {errors.cycleLength && <p className="text-red-500 text-xs mt-1">{errors.cycleLength}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Last Period Date?</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiCalendar className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <input
//                 type="date"
//                 name="lastPeriodStart"
//                 value={formData.lastPeriodStart}
//                 onChange={handleChange}
//                 className="pl-9 sm:pl-10 w-full rounded-lg border border-gray-300 p-2 sm:p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="pt-1 sm:pt-2">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70 text-sm sm:text-base"
//             >
//               {isSubmitting ? 'Creating account...' : 'Create Account'}
//             </motion.button>
//           </div>

//           <div className="text-center text-xs sm:text-sm text-gray-600 pt-1 sm:pt-2">
//             Already have an account?{' '}
//             <Link to="/login" className="text-purple-600 hover:underline font-medium">
//               Log in
//             </Link>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCalendar, FiClock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    cycleLength: '',
    lastPeriodStart: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age)) {
      newErrors.age = 'Age must be a number';
    } else if (formData.age < 13 || formData.age > 60) {
      newErrors.age = 'Age must be between 13-60';
    }
    if (!formData.cycleLength) {
      newErrors.cycleLength = 'Cycle length is required';
    } else if (isNaN(formData.cycleLength)) {
      newErrors.cycleLength = 'Cycle length must be a number';
    } else if (formData.cycleLength < 21 || formData.cycleLength > 45) {
      newErrors.cycleLength = 'Cycle length must be between 21-45 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        avgCycleLength: parseInt(formData.cycleLength),
        lastPeriodStart: formData.lastPeriodStart || null
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Illustration/Info */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 p-8 sm:p-12 text-white flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Join Our Community</h1>
              <p className="text-purple-100 text-lg">
                Track your hormonal health with personalized insights and predictions.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mt-6"
            >
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <span>Period tracking with predictions</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <FiClock className="w-5 h-5" />
                </div>
                <span>Symptom and mood logging</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <FiUser className="w-5 h-5" />
                </div>
                <span>Personalized health insights</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 hidden md:block"
            >
              <div className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
                <p className="italic">"This app has helped me understand my body better than ever before!"</p>
                <p className="mt-2 font-medium">- Sarah, 28</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-2">Start your personalized health journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Your name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      min="13"
                      max="60"
                      value={formData.age}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${errors.age ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Your age"
                    />
                  </div>
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Cycle Length (days)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="cycleLength"
                      min="21"
                      max="45"
                      value={formData.cycleLength}
                      onChange={handleChange}
                      className={`pl-10 w-full rounded-lg border ${errors.cycleLength ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Typically 28-32"
                      required
                    />
                  </div>
                  {errors.cycleLength && <p className="text-red-500 text-xs mt-1">{errors.cycleLength}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Last Period Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="lastPeriodStart"
                      value={formData.lastPeriodStart}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70 text-sm sm:text-base flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </motion.button>
              </div>

              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                  Log in
                </Link>
              </div>
               <div className="text-center text-sm text-gray-600 pt-2">
                Return to {' '}
                <Link to="/" className="text-purple-600 hover:underline font-medium">
                  Home 
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;