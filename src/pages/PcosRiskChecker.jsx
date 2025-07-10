import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { differenceInDays, parseISO, format } from "date-fns";

const PcosRiskChecker = () => {
  // Form state management
  const [formData, setFormData] = useState({
    age: "",
    cycleRegularity: null,
    cycleLength: "",
    bmi: "",
    weightGain: null,
    hairGrowth: null,
    pimples: null,
    hairLoss: null,
    skinDarkening: null,
    fastFood: null,
    exercise: null,
  });

  // Component state
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskResult, setRiskResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load latest assessment and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([loadLatestAssessment(), loadPeriodAndUserData()]);
      } catch (error) {
        console.error("Error loading data:", error);
        showErrorAlert(
          error?.response?.data?.message ||
            "Failed to load data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to show error alerts
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#ec4899",
      timer: 3000,
    });
  };

  // Load the user's latest PCOS assessment
  const loadLatestAssessment = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pcos-assessment/latest`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setRiskResult(response.data);
      }
    } catch (error) {
      // Only log errors other than 404 (not found)
      if (error.response?.status !== 404) {
        console.error("Error loading assessment:", error);
      }
    }
  };

  // Load period data and user profile
  const loadPeriodAndUserData = async () => {
    try {
      // Fetch period data
      const periodRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period-tracker`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const periodsRaw = periodRes.data?.data || [];
      const periodsWithDuration = periodsRaw.map((period) => ({
        ...period,
        durationDays: differenceInDays(
          new Date(period.endDate),
          new Date(period.startDate)
        ) + 1,
      }));

      setPeriods(periodsWithDuration);

      // Fetch user details
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userData = userRes.data?.data || {};
      const cycleStats = calculateCycleStats(periodsWithDuration);

      // Update form with user data
      setFormData((prev) => ({
        ...prev,
        age: userData.age || "",
        bmi: userData.bmi || "",
        cycleLength: cycleStats.averageCycleLength || "",
        cycleRegularity: isCycleRegular(cycleStats.averageCycleLength)
          ? 0
          : 1,
      }));
    } catch (error) {
      console.error("Error loading user data:", error);
      throw error;
    }
  };

  // Calculate cycle statistics from period data
  const calculateCycleStats = (periodLogs) => {
    if (!Array.isArray(periodLogs)) return { averageCycleLength: 0, averageDuration: 0 };

    const sorted = [...periodLogs].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    let totalCycleLength = 0;
    let cycleCount = 0;
    let totalDuration = 0;

    for (let i = 0; i < sorted.length; i++) {
      const start = new Date(sorted[i].startDate);
      const end = new Date(sorted[i].endDate);
      totalDuration += differenceInDays(end, start) + 1;

      if (i < sorted.length - 1) {
        const nextStart = new Date(sorted[i + 1].startDate);
        totalCycleLength += differenceInDays(nextStart, start);
        cycleCount++;
      }
    }

    return {
      averageCycleLength: cycleCount > 0 ? Math.round(totalCycleLength / cycleCount) : 0,
      averageDuration: sorted.length > 0 ? Math.round(totalDuration / sorted.length) : 0,
    };
  };

  // Determine if cycles are regular
  const isCycleRegular = (averageLength) => {
    return averageLength >= 25 && averageLength <= 35;
  };

  // Calculate cycle regularity from period data
  const calculateCycleRegularity = () => {
    if (periods.length < 2) return null;

    const cycleLengths = [];
    for (let i = 1; i < periods.length; i++) {
      const diffDays = differenceInDays(
        new Date(periods[i].startDate),
        new Date(periods[i - 1].startDate)
      );
      cycleLengths.push(diffDays);
    }

    const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    return cycleLengths.every((days) => Math.abs(days - avgCycleLength) <= 7) ? 0 : 1;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "age",
      "cycleRegularity",
      "cycleLength",
      "bmi",
      "weightGain",
      "hairGrowth",
      "pimples",
      "hairLoss",
      "skinDarkening",
      "fastFood",
      "exercise",
    ];

    requiredFields.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        errors[field] = "This field is required";
      }
    });

    // Additional validation for numeric fields
    if (formData.age && (formData.age < 15 || formData.age > 50)) {
      errors.age = "Age must be between 15 and 50";
    }

    if (formData.cycleLength && (formData.cycleLength < 15 || formData.cycleLength > 60)) {
      errors.cycleLength = "Cycle length must be between 15 and 60 days";
    }

    if (formData.bmi && (formData.bmi < 15 || formData.bmi > 50)) {
      errors.bmi = "BMI must be between 15 and 50";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form data for assessment
  const submitForm = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields correctly",
        confirmButtonColor: "#ec4899",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const inputData = {
        age: parseFloat(formData.age),
        isRegular: formData.cycleRegularity,
        cycleLength: parseFloat(formData.cycleLength),
        BMI: parseFloat(formData.bmi),
        weightGain: formData.weightGain,
        hairGrowth: formData.hairGrowth,
        pimples: formData.pimples,
        hairLoss: formData.hairLoss,
        skinDarkening: formData.skinDarkening,
        fastFood: formData.fastFood,
        exercise: formData.exercise,
      };

      // First get prediction from ML model
      const predictionResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/prediction/pcos-check`,
        inputData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Then save the assessment record
      const saveResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pcos-assessment`,
        {
          ...inputData,
          riskLevel: predictionResponse.data.data.risk_level,
          message: predictionResponse.data.data.message,
          showDoctor: predictionResponse.data.data.show_doctor,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update state with results
      setRiskResult(saveResponse.data);
      setShowForm(false);

      // Show results to user
      showAssessmentResults(saveResponse.data);
    } catch (error) {
      console.error("Assessment error:", error);
      showErrorAlert(
        error?.response?.data?.message ||
          "Failed to complete assessment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show assessment results in a modal
  const showAssessmentResults = (results) => {
    Swal.fire({
      title: `PCOS Risk: ${results.riskLevel?.toUpperCase()}`,
      html: `
        <div class="text-left">
          <p class="mb-3">${results.message}</p>
          ${
            results.showDoctor
              ? '<p class="font-medium">Early diagnosis and management can help prevent complications.</p>'
              : ""
          }
        </div>
      `,
      icon: results.riskLevel === "high" ? "warning" : "info",
      confirmButtonColor:
        results.riskLevel === "high" ? "#ef4444" : "#ec4899",
      showConfirmButton: true,
      showCancelButton: results.showDoctor,
      cancelButtonText: "Later",
      confirmButtonText: results.showDoctor ? "Find a Doctor" : "OK",
    }).then((result) => {
      if (result.isConfirmed && results.showDoctor) {
        window.open(
          "https://www.acog.org/womens-health/find-an-ob-gyn",
          "_blank"
        );
      }
    });
  };

  // Start a new assessment
  const startAssessment = () => {
    const regularity = calculateCycleRegularity();
    setFormData((prev) => ({
      ...prev,
      cycleRegularity: regularity !== null ? regularity : prev.cycleRegularity,
    }));
    setShowForm(true);
    setValidationErrors({});
  };

  // Render loading state
  if (isLoading && !riskResult) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white">
        <h2 className="text-xl md:text-2xl font-bold">PCOS Risk Assessment</h2>
        <p className="text-purple-100 text-sm md:text-base mt-1">
          Evaluate your risk for Polycystic Ovary Syndrome using our ML model
        </p>
      </div>

      <div className="p-4 md:p-6">
        {!showForm ? (
          <div className="space-y-5">
            {riskResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  riskResult.riskLevel === "high"
                    ? "bg-red-50 border-red-200"
                    : riskResult.riskLevel === "medium"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <h3 className="font-medium text-lg mb-2">
                  Latest Assessment Result
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      riskResult.riskLevel === "high"
                        ? "bg-red-100 text-red-800"
                        : riskResult.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {riskResult.riskLevel?.toUpperCase()} RISK
                  </span>
                  <span className="text-sm text-gray-600">
{riskResult?.createdAt
  ? format(parseISO(riskResult.createdAt), "MMM d, yyyy")
  : "Not available"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{riskResult.message}</p>
                {riskResult.showDoctor && (
                  <p className="text-xs text-gray-600 mt-2">
                    Consider consulting a healthcare provider
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-blue-800 mb-2">
                  About This Assessment
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Our PCOS risk assessment uses machine learning trained on
                  clinical data to evaluate your risk factors.
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                  <li>Takes about 2 minutes to complete</li>
                  <li>Answers are kept private and secure</li>
                  <li>Provides personalized recommendations</li>
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>You have {periods.length} cycle(s) recorded.</strong>{" "}
                  {periods.length > 1
                    ? "We've used this data to assess your cycle regularity."
                    : periods.length === 1
                    ? "Recording more cycles will improve assessment accuracy."
                    : "No cycle data recorded yet."}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startAssessment}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {riskResult ? "Take New Assessment" : "Start Assessment"}
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Health Information
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close form"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border ${
                    validationErrors.age ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  min="15"
                  max="50"
                  placeholder="Enter your age"
                />
                {validationErrors.age && (
                  <p className="text-xs text-red-600">{validationErrors.age}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Average Cycle Length (days)
                </label>
                <input
                  type="number"
                  name="cycleLength"
                  value={formData.cycleLength}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border ${
                    validationErrors.cycleLength
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  min="15"
                  max="60"
                  placeholder="e.g. 28"
                />
                {validationErrors.cycleLength && (
                  <p className="text-xs text-red-600">
                    {validationErrors.cycleLength}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  BMI (Body Mass Index)
                </label>
                <input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border ${
                    validationErrors.bmi ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  step="0.1"
                  min="15"
                  max="50"
                  placeholder="e.g. 22.5"
                />
                {validationErrors.bmi && (
                  <p className="text-xs text-red-600">{validationErrors.bmi}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Cycle Regularity
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRadioChange("cycleRegularity", 0)}
                    className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                      formData.cycleRegularity === 0
                        ? "bg-green-50 border-green-500 text-green-800"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Regular
                  </button>
                  <button
                    onClick={() => handleRadioChange("cycleRegularity", 1)}
                    className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                      formData.cycleRegularity === 1
                        ? "bg-red-50 border-red-500 text-red-800"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Irregular
                  </button>
                </div>
                {validationErrors.cycleRegularity && (
                  <p className="text-xs text-red-600">
                    {validationErrors.cycleRegularity}
                  </p>
                )}
                {formData.cycleRegularity !== null && !validationErrors.cycleRegularity && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.cycleRegularity === 0
                      ? "Regular cycles are typically between 25-35 days"
                      : "Irregular cycles vary by more than 7 days between cycles"}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Symptoms and Lifestyle Factors
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Have you experienced weight gain?",
                    name: "weightGain",
                  },
                  {
                    label: "Do you have excess hair growth?",
                    name: "hairGrowth",
                  },
                  {
                    label: "Do you have persistent acne/pimples?",
                    name: "pimples",
                  },
                  {
                    label: "Have you experienced hair loss?",
                    name: "hairLoss",
                  },
                  {
                    label: "Do you have skin darkening patches?",
                    name: "skinDarkening",
                  },
                  {
                    label: "Do you consume fast food regularly?",
                    name: "fastFood",
                  },
                  { label: "Do you exercise regularly?", name: "exercise" },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      {item.label}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRadioChange(item.name, 1)}
                        className={`flex-1 py-2 text-sm rounded-lg border-2 transition-colors ${
                          formData[item.name] === 1
                            ? "bg-green-50 border-green-500 text-green-800"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleRadioChange(item.name, 0)}
                        className={`flex-1 py-2 text-sm rounded-lg border-2 transition-colors ${
                          formData[item.name] === 0
                            ? "bg-red-50 border-red-500 text-red-800"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        No
                      </button>
                    </div>
                    {validationErrors[item.name] && (
                      <p className="text-xs text-red-600">
                        {validationErrors[item.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitForm}
                disabled={isSubmitting}
                className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Get Risk Assessment
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PcosRiskChecker;