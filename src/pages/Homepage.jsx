import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiBarChart2, FiMessageSquare, FiAlertTriangle, FiHeart, FiUsers } from 'react-icons/fi';

const Homepage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const testimonials = [
    {
      quote: "This app changed how I understand my body. The predictions are scarily accurate!",
      author: "Sarah, 28",
      role: "Graphic Designer"
    },
    {
      quote: "Finally an app that helps my partner understand what I'm going through each month.",
      author: "Alex & Jamie",
      role: "Couple users"
    },
    {
      quote: "The emotional forecasting feature has helped me plan my work schedule better.",
      author: "Taylor, 32",
      role: "Project Manager"
    }
  ];

  const faqs = [
    {
      question: "How does the Hormonal Twin work?",
      answer: "Our AI analyzes your cycle patterns, symptoms, and moods to create a personalized model of your hormonal health."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We use end-to-end encryption and never share your personal health data with third parties."
    },
    {
      question: "Can I share my insights with my partner?",
      answer: "Yes! You can choose to share forecasts and insights with trusted partners through secure sharing."
    }
  ];

  const features = [
    {
      icon: <FiBarChart2 size={24} />,
      title: "Hormonal Twin",
      description: "Your personalized AI model that learns and predicts your unique hormonal patterns.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FiCheckCircle size={24} />,
      title: "Predictive AI",
      description: "Advanced algorithms forecast symptoms before they occur so you can plan ahead.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <FiMessageSquare size={24} />,
      title: "GPT Companion",
      description: "Chat with an AI assistant trained to answer all your hormonal health questions.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiAlertTriangle size={24} />,
      title: "Emergency Mode",
      description: "Quick access to tailored advice when you're experiencing severe symptoms.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <FiHeart size={24} />,
      title: "Emotional Forecasting",
      description: "Understand how your emotions fluctuate throughout your cycle.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <FiUsers size={24} />,
      title: "Partner Portal",
      description: "Help your partner understand and support you through shared insights.",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Log your cycle",
      description: "Track your menstrual cycle, symptoms, and moods with our intuitive interface."
    },
    {
      number: "02",
      title: "Predict symptoms",
      description: "Our AI learns your patterns to forecast upcoming symptoms with remarkable accuracy."
    },
    {
      number: "03",
      title: "Understand moods",
      description: "Get insights into how hormonal changes affect your emotions and energy levels."
    },
    {
      number: "04",
      title: "Empower yourself & partner",
      description: "Share insights with loved ones to build understanding and support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <FiHeart className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">HormonalTwin</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <a 
              href="/register" 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-pink-200 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 order-2 lg:order-1 mt-8 lg:mt-0"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Meet your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hormonal Health Twin</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg">
                AI-powered insights to understand your cycle, predict symptoms, and take control of your hormonal health.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/register" 
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-center font-medium shadow-md text-sm sm:text-base md:text-lg"
                >
                  Start Your Journey - It's Free
                </motion.a>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <img 
                      key={item}
                      src={`https://randomuser.me/api/portraits/women/${item + 20}.jpg`}
                      alt="Happy user"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Trusted by thousands of women</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs sm:text-sm text-gray-600 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 flex justify-center order-1 lg:order-2"
            >
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="relative z-10 w-full h-auto">
                  <img 
                    src="https://illustrations.popsy.co/purple/woman-meditating.svg" 
                    alt="Woman using app" 
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
                {!isMobile && (
                  <>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-100 rounded-full filter blur-xl opacity-60"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-100 rounded-full filter blur-xl opacity-60"></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute -bottom-4 -left-4 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                        <p className="text-xs sm:text-sm font-medium">Cycle prediction active</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Next period in 3 days</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="absolute -top-4 -right-4 bg-white p-2 sm:p-3 rounded-xl shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FiHeart className="text-purple-600 w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">Emotional forecast</p>
                          <p className="text-xs text-gray-500">High energy today</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to understand and predict your hormonal health</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Powerful tools designed for your hormonal health</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-3 sm:mb-4`}>
                      {React.cloneElement(feature.icon, { size: isMobile ? 20 : 24 })}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Trusted by Thousands</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">What our community says about HormonalTwin</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm relative"
              >
                <div className="absolute top-0 left-0 w-full h-full rounded-xl sm:rounded-2xl border-2 border-purple-100 opacity-30 pointer-events-none"></div>
                <p className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-4 sm:mb-6 font-medium">"{testimonials[activeTestimonial].quote}"</p>
                <div>
                  <p className="font-semibold text-purple-600">{testimonials[activeTestimonial].author}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-purple-600 w-4 sm:w-6' : 'bg-purple-200'}`}
                  aria-label={`View testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to know about HormonalTwin</p>
          </motion.div>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 sm:mt-12 text-center"
          >
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">We take your privacy seriously. All data is encrypted and stored securely.</p>
            <p className="text-purple-600 hover:text-purple-800 font-medium text-sm sm:text-base">
              Read our full Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to meet your Hormonal Twin?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">Take control of your hormonal health today.</p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register" 
              className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-purple-600 rounded-lg hover:shadow-xl transition-all duration-300 font-medium shadow-lg text-sm sm:text-base md:text-lg"
            >
              Get Started — It's Free
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FiHeart className="text-white w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-base sm:text-lg font-bold">HormonalTwin</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} HormonalTwin. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;