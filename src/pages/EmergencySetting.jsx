import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  FiAlertTriangle,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCheckCircle,
  FiPhoneCall,
  FiTrash2,
  FiEdit,
  FiSave,
  FiPlus
} from 'react-icons/fi';

const EmergencySettings = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    contactMethod: 'phone',
    phone: '',
    email: '',
    isActive: true
  });

  const [editingId, setEditingId] = useState(null);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemActive, setSystemActive] = useState(true);

  // Load saved contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/emergency/config`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setContacts(response.data.data.contacts || []);
      } catch (error) {
        console.error('Failed to load emergency contacts:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load emergency contacts',
          timer: 3000
        });
      }
    };
    loadContacts();
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateContact = async () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all required fields',
        timer: 3000
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const contactData = {
        name: newContact.name,
        contactMethod: newContact.contactMethod,
        contactInfo: newContact.contactMethod === 'phone' ? newContact.phone : newContact.email,
        isActive: newContact.isActive
      };

      if (editingId) {
        // Update existing contact
        await axios.put(`${import.meta.env.VITE_API_URL}/api/emergency/config/${editingId}`, contactData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Add new contact
        await axios.post(`${import.meta.env.VITE_API_URL}/api/emergency/config`, contactData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      // Refresh contacts
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/emergency/config`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContacts(response.data.data.contacts || []);

      resetContactForm();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'Contact Updated' : 'Contact Added',
        text: editingId ? 'Your contact has been updated' : 'New contact has been added',
        timer: 3000
      });
    } catch (error) {
      console.error('Error saving contact:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save contact',
        timer: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const editContact = (contact) => {
    setNewContact({
      name: contact.name,
      contactMethod: contact.contactMethod,
      phone: contact.contactMethod === 'phone' ? contact.contactInfo : '',
      email: contact.contactMethod === 'email' ? contact.contactInfo : '',
      isActive: contact.isActive
    });
    setEditingId(contact._id);
  };

  const resetContactForm = () => {
    setNewContact({
      name: '',
      contactMethod: 'phone',
      phone: '',
      email: '',
      isActive: true
    });
    setEditingId(null);
  };

  const removeContact = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/emergency/config/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh contacts
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/emergency/config`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContacts(response.data.data.contacts || []);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Contact has been deleted',
        timer: 3000
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete contact',
        timer: 3000
      });
    }
  };

  const toggleContactStatus = async (contact) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/emergency/config/${contact._id}`, {
        ...contact,
        isActive: !contact.isActive
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh contacts
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/emergency/config`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContacts(response.data.data.contacts || []);

      Swal.fire({
        icon: 'success',
        title: 'Contact Updated',
        text: `Contact has been ${contact.isActive ? 'deactivated' : 'activated'}`,
        timer: 2000
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update contact status',
        timer: 3000
      });
    }
  };

  const sendSOS = async () => {
    if (contacts.filter(c => c.isActive).length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Active Contacts',
        text: 'Please add and activate at least one emergency contact',
        timer: 3000
      });
      return;
    }

    if (!systemActive) {
      Swal.fire({
        icon: 'warning',
        title: 'System Inactive',
        text: 'Please activate the emergency system first',
        timer: 3000
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Send Emergency Alert?',
      text: "This will send your current location to all active emergency contacts.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Send SOS!'
    });

    if (!result.isConfirmed) return;

    setIsSendingSOS(true);

    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      console.log(location)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/emergency/sos`, {
        location,
        isTest: false
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });


      Swal.fire({
        icon: 'success',
        title: 'Alert Sent!',
        text: `Emergency alert sent to ${response.data.data.contactsNotified} contacts`,
        timer: 3000
      });
    } catch (error) {
      console.error('Error sending SOS:', error);
      let errorMessage = 'Failed to send emergency alert';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access was denied. Please enable location services.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        timer: 3000
      });
    } finally {
      setIsSendingSOS(false);
    }
  };

  const toggleSystemStatus = async () => {
    try {
      setIsSubmitting(true);
      const newStatus = !systemActive;
      
      await axios.put(`${import.meta.env.VITE_API_URL}/api/emergency/settings`, {
        isActive: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSystemActive(newStatus);
      
      Swal.fire({
        icon: 'success',
        title: `Emergency System ${newStatus ? 'Activated' : 'Deactivated'}`,
        text: `The emergency system has been ${newStatus ? 'activated' : 'deactivated'}`,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to toggle emergency system:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update emergency system status',
        timer: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <FiAlertTriangle size={24} />
            <div>
              <h1 className="text-xl font-bold">Emergency SOS</h1>
              <p className="text-red-100 text-sm mt-1">
                Configure emergency contacts and trigger alerts
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* System Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${systemActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div>
                <p className="font-medium">Emergency System</p>
                <p className="text-sm text-gray-600">
                  {systemActive ? 'Active - System is ready' : 'Inactive - Emergency alerts disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSystemStatus}
              disabled={isSubmitting}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                systemActive 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isSubmitting ? 'Updating...' : systemActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* SOS Button */}
          <div className="text-center">
            <button
              onClick={sendSOS}
              disabled={isSendingSOS || !systemActive}
              className="w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSendingSOS ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Alert...
                </>
              ) : (
                <>
                  <FiAlertTriangle size={20} />
                  <span className="font-bold text-lg">SEND EMERGENCY ALERT</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Pressing this button will send your current location to all active emergency contacts
            </p>
          </div>

          {/* Trusted Contacts */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-md font-semibold text-gray-800">
              <FiUser className="text-red-600" />
              Trusted Contacts
            </h2>
            <p className="text-sm text-gray-600">
              These people will be notified when you trigger an emergency alert
            </p>

            {/* Add/Edit Contact Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newContact.name}
                    onChange={handleContactChange}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewContact(prev => ({ ...prev, contactMethod: 'phone' }))}
                      className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-sm ${
                        newContact.contactMethod === 'phone'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FiPhone size={14} />
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewContact(prev => ({ ...prev, contactMethod: 'email' }))}
                      className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-sm ${
                        newContact.contactMethod === 'email'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FiMail size={14} />
                      Email
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                {newContact.contactMethod === 'phone' ? (
                  <input
                    type="tel"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleContactChange}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                ) : (
                  <input
                    type="email"
                    name="email"
                    value={newContact.email}
                    onChange={handleContactChange}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                )}
              </div>

              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newContact.isActive}
                  onChange={(e) => setNewContact(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (will receive alerts)
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addOrUpdateContact}
                  disabled={!newContact.name || (!newContact.phone && !newContact.email) || isSubmitting}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiPlus size={16} />
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Contact' : 'Add Contact'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetContactForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Contacts List */}
            {contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div key={contact._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleContactStatus(contact)}
                        className={`w-4 h-4 rounded-full border ${
                          contact.isActive ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'
                        }`}
                        title={contact.isActive ? 'Active' : 'Inactive'}
                      />
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.contactMethod === 'phone' ? (
                            <span className="flex items-center gap-1">
                              <FiPhone size={12} /> {contact.contactInfo}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FiMail size={12} /> {contact.contactInfo}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editContact(contact)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeContact(contact._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No contacts added yet
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencySettings;