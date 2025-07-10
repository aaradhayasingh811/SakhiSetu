import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHeart,
  FiCalendar,
  FiSettings,
  FiCheckCircle,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const PartnerSync = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationshipType: 'Partner',
    consent: false,
    notificationPreferences: ['email']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const relationshipTypes = [
    'Partner',
    'Spouse',
    'Friend',
    'Family',
    'Caregiver',
    'Other'
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push Notification' }
  ];

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/partner`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.data) {
          setPartnerData(response.data.data);
          setFormData({
            name: response.data.data.name,
            email: response.data.data.email || '',
            phone: response.data.data.phone || '',
            relationshipType: response.data.data.relationshipType,
            consent: response.data.data.consent,
            notificationPreferences: response.data.data.notificationPreferences || ['email']
          });
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerData();
  }, [success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'consent') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => {
          const newPrefs = checked
            ? [...prev.notificationPreferences, value]
            : prev.notificationPreferences.filter(pref => pref !== value);
          return { ...prev, notificationPreferences: newPrefs };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const endpoint =  `${import.meta.env.VITE_API_URL}/api/partner`;
      const method = 'post';

      const response = await axios[method](endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        setIsEditing(false);
        setPartnerData(response.data.data);
        
        Swal.fire({
          title: 'Success!',
          text: partnerData 
            ? 'Partner connection updated successfully!' 
            : 'Partner connection saved successfully!',
          icon: 'success',
          confirmButtonColor: '#7c3aed',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message || 'Failed to save partner details',
          icon: 'error',
          confirmButtonColor: '#7c3aed'
        });
      }
    } catch (error) {
      console.error('Error saving partner details:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while saving partner details',
        icon: 'error',
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/partner`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setPartnerData(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            relationshipType: 'Partner',
            consent: false,
            notificationPreferences: ['email']
          });
          setSuccess(false);
          
          Swal.fire({
            title: 'Removed!',
            text: 'Your partner connection has been removed.',
            icon: 'success',
            confirmButtonColor: '#7c3aed'
          });
        }
      } catch (error) {
        console.error('Error deleting partner:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An error occurred while removing partner',
          icon: 'error',
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (partnerData) {
      setFormData({
        name: partnerData.name,
        email: partnerData.email || '',
        phone: partnerData.phone || '',
        relationshipType: partnerData.relationshipType,
        consent: partnerData.consent,
        notificationPreferences: partnerData.notificationPreferences || ['email']
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-purple-50 p-1 to-pink-50 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white">
          <h1 className="text-xl font-bold">
            {partnerData ? 'Partner Connection' : 'Connect with Your Partner'}
          </h1>
          <p className="text-purple-100 text-sm mt-1">
            {partnerData 
              ? 'Manage your partner connection settings' 
              : 'Set up details for sharing your cycle information'}
          </p>
        </div>

        {partnerData && !isEditing ? (
          <div className="p-5 space-y-6">
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-md font-semibold text-gray-800">
                <FiUser className="text-purple-600" />
                Partner Information
              </h2>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{partnerData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{partnerData.relationshipType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{partnerData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{partnerData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consent</p>
                    <p className="font-medium">{partnerData.consent ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Notification Preferences</p>
                    <p className="font-medium">
                      {partnerData.notificationPreferences?.join(', ') || 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-purple-600 text-purple-600 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all"
              >
                <FiEdit />
                Edit Connection
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-600 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-all"
              >
                <FiTrash2 />
                Remove Connection
              </motion.button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-md font-semibold text-gray-800">
                <FiUser className="text-purple-600" />
                Partner Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner's Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship Type
                  </label>
                  <select
                    name="relationshipType"
                    value={formData.relationshipType}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {relationshipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="partner@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  Partner has consented to receive notifications
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Preferences
                </label>
                <div className="flex flex-wrap gap-4">
                  {notificationOptions.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="notificationPreferences"
                        value={value}
                        checked={formData.notificationPreferences.includes(value)}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3"
              >
                <FiCheckCircle className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {partnerData ? 'Partner connection updated successfully!' : 'Partner connection saved successfully!'}
                  </p>
                  <p className="text-sm mt-1">
                    {formData.name} will receive notifications via {formData.notificationPreferences.join(', ')}.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {partnerData ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    {partnerData ? 'Update Connection' : 'Save Connection'}
                  </>
                )}
              </motion.button>

              {partnerData && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default PartnerSync;