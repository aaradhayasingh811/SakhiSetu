import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FiSend,
  FiMessageSquare,
  FiRefreshCw,
  FiCopy,
  FiUser,
  FiTrash2
} from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

const GPTCompanion = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Example prompts to suggest to users
  const examplePrompts = [
    "What helps with cramps?",
    "Why do I get sad after ovulation?",
    "Is it normal to have irregular cycles?",
    "How can I track my fertility window?",
    "What foods help with PMS symptoms?"
  ];

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('healthCompanionMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage and scroll to bottom
  useEffect(() => {
    localStorage.setItem('healthCompanionMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to chat
      const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Send to API
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/gpt/ask`, {
        question: input,
        history: messages.filter(m => m.role !== 'system')
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(response.data)

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.data,
        timestamp: new Date().toISOString()
      }]);

    } catch (err) {
      console.error('Error asking health companion:', err);
      setError(err.response?.data?.message || 'Failed to get response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble answering that right now. Please try again later.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt) => {
    setInput(prompt);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Show a toast notification
  };

  const clearConversation = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      localStorage.removeItem('healthCompanionMessages');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Hormonal Health Companion</h1>
            <p className="text-purple-100 text-sm">Ask me anything about your cycle, symptoms, or emotions</p>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={clearConversation}
              className="p-2 rounded-full hover:bg-purple-700 transition-colors"
              title="Clear conversation"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <BsRobot size={24} />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-gray-600 mb-4">Ask me anything about your menstrual cycle, symptoms, or emotional health.</p>
              
              <div className="grid grid-cols-1 gap-2">
                {examplePrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExampleClick(prompt)}
                    className="text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    "{prompt}"
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'user' ? (
                    <FiUser className="flex-shrink-0" />
                  ) : (
                    <BsRobot className="flex-shrink-0 text-purple-600" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : 'Health Companion'}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <FiCopy size={14} />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none shadow-sm p-4 max-w-xs md:max-w-md">
              <div className="flex items-center gap-2 text-gray-500">
                <FiRefreshCw className="animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your cycle..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-lg ${
              !input.trim() || isLoading
                ? 'bg-gray-200 text-gray-400'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <FiSend />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default GPTCompanion;