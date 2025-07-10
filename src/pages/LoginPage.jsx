import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiHelpCircle, FiKey, FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetErrors, setResetErrors] = useState({});

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

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({
      ...prev,
      [name]: value
    }));
    if (resetErrors[name]) {
      setResetErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = () => {
    const newErrors = {};
    
    if (!resetData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(resetData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (otpSent && !resetData.otp) {
      newErrors.otp = 'OTP is required';
    }
    if (otpSent && !resetData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (otpSent && resetData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (otpSent && resetData.newPassword !== resetData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      
      if(response.data){
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          case 403:
            errorMessage = 'Account not verified. Please check your email for verification link.';
            break;
          case 404:
            errorMessage = 'Account not found. Please register first.';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please wait before trying again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateReset()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-reset-otp`, {
        email: resetData.email
      });
      setOtpSent(true);
      setApiError('');
    } catch (error) {
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Email not found. Please check your email address.';
            break;
          case 429:
            errorMessage = 'Too many OTP requests. Please wait before trying again.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateReset()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        email: resetData.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword
      });
      setApiError('');
      setShowForgotPassword(false);
      setOtpSent(false);
      setResetData({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid OTP. Please check the code or request a new one.';
            break;
          case 401:
            errorMessage = 'OTP expired. Please request a new one.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setApiError(errorMessage);
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
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Welcome Back</h1>
              <p className="text-purple-100 text-lg">
                Continue your hormonal health journey with personalized insights.
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
                <span>Track your cycle and symptoms</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <FiClock className="w-5 h-5" />
                </div>
                <span>Get personalized predictions</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                  <FiUser className="w-5 h-5" />
                </div>
                <span>Access your health dashboard</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 hidden md:block"
            >
              <div className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
                <p className="italic">"This app has completely changed how I understand my body's patterns."</p>
                <p className="mt-2 font-medium">- Emily, 31</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10">
            {!showForgotPassword ? (
              <>
                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-gray-600 mt-2">Welcome back to your health journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {apiError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{apiError}</span>
                      </div>
                    </div>
                  )}

                  <div>
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
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
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
                        placeholder="Your password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-purple-600 hover:underline flex items-center"
                    >
                      <FiHelpCircle className="mr-1" />
                      Forgot password?
                    </button>
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
                          Signing in...
                        </>
                      ) : 'Sign In'}
                    </motion.button>
                  </div>

                  <div className="text-center text-sm text-gray-600 pt-2">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Register
                    </Link>
                  </div>
                  <div className="text-center text-sm text-gray-600 pt-2">
                    Go to {' '} <Link 
                      to="/" 
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Home
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Reset Password</h2>
                  <p className="text-gray-600 mt-2">
                    {otpSent ? 'Enter the OTP and your new password' : 'We will send an OTP to your email'}
                  </p>
                </div>

                <form onSubmit={otpSent ? handleResetPassword : handleSendOtp} className="space-y-4">
                  {apiError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{apiError}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={resetData.email}
                        onChange={handleResetChange}
                        disabled={otpSent}
                        className={`pl-10 w-full rounded-lg border ${resetErrors.email ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {resetErrors.email && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {resetErrors.email}
                      </p>
                    )}
                  </div>

                  {otpSent && (
                    <>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">OTP</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiKey className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="otp"
                            value={resetData.otp}
                            onChange={handleResetChange}
                            className={`pl-10 w-full rounded-lg border ${resetErrors.otp ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            placeholder="Enter OTP"
                          />
                        </div>
                        {resetErrors.otp && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {resetErrors.otp}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="newPassword"
                            value={resetData.newPassword}
                            onChange={handleResetChange}
                            className={`pl-10 w-full rounded-lg border ${resetErrors.newPassword ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            placeholder="New password (min 6 characters)"
                          />
                        </div>
                        {resetErrors.newPassword && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {resetErrors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={resetData.confirmPassword}
                            onChange={handleResetChange}
                            className={`pl-10 w-full rounded-lg border ${resetErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                            placeholder="Confirm password"
                          />
                        </div>
                        {resetErrors.confirmPassword && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {resetErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  )}

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
                          {otpSent ? 'Resetting...' : 'Sending OTP...'}
                        </>
                      ) : (
                        otpSent ? 'Reset Password' : 'Send OTP'
                      )}
                    </motion.button>
                  </div>

                  <div className="text-center text-sm text-gray-600 pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setOtpSent(false);
                        setApiError('');
                      }}
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;