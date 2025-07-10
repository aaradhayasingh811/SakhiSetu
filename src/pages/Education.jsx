import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiDroplet,
  FiSun,
  FiActivity,
  FiZap,
  FiMoon,
  FiInfo,
  FiHeart,
  FiBarChart2,
  FiThermometer,
} from "react-icons/fi";

const phaseData = [
  {
    name: "Menstrual Phase",
    days: "Days 1-5",
    icon: <FiDroplet className="text-red-500" size={24} />,
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-200",
    description:
      "The menstrual phase marks the beginning of your cycle when the uterine lining sheds. This is when you experience your period.",
    hormones: {
      estrogen: "Low",
      progesterone: "Low",
      fsh: "Rising",
    },
    symptoms: [
      "Menstrual bleeding (typically 3-7 days)",
      "Possible cramps or discomfort",
      "Lower energy levels",
      "Possible mood changes",
    ],
    tips: [
      "Prioritize rest and self-care",
      "Use heat therapy for cramps",
      "Stay hydrated",
      "Gentle exercise like yoga can help",
      "Consider iron-rich foods if heavy flow",
    ],
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    name: "Follicular Phase",
    days: "Days 6-14",
    icon: <FiSun className="text-blue-500" size={24} />,
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-200",
    description:
      "After your period ends, your body prepares for ovulation by developing follicles in the ovaries. The uterine lining begins to thicken.",
    hormones: {
      estrogen: "Rising",
      progesterone: "Low",
      fsh: "Stable",
      lh: "Begins rising late in phase",
    },
    symptoms: [
      "Increasing energy levels",
      "Improved mood",
      "Higher pain tolerance",
      "Clearer skin (for some)",
    ],
    tips: [
      "Great time for new projects",
      "Ideal for intense workouts",
      "Social activities may feel easier",
      "Brain tends to be sharper",
      "Good time for creative work",
    ],
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    name: "Ovulation",
    days: "Day 14-16",
    icon: <FiZap className="text-yellow-500" size={24} />,
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-200",
    description:
      "A mature egg is released from the ovary and travels down the fallopian tube. This is your most fertile window.",
    hormones: {
      estrogen: "Peak",
      progesterone: "Begins rising",
      lh: "Surges",
    },
    symptoms: [
      "Possible ovulation pain (mittelschmerz)",
      "Increased libido",
      "Cervical mucus becomes egg-white like",
      "Possible breast tenderness",
      "Heightened senses for some",
    ],
    tips: [
      "Best time for conception if trying",
      "Good time for important conversations",
      "Social confidence often peaks",
      "Communication may feel easier",
      "Take advantage of natural energy boost",
    ],
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    name: "Luteal Phase",
    days: "Days 17-28",
    icon: <FiMoon className="text-purple-500" size={24} />,
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-200",
    description:
      "After ovulation, the empty follicle becomes the corpus luteum which produces progesterone to prepare the uterus for potential pregnancy.",
    hormones: {
      estrogen: "Second rise then fall",
      progesterone: "Peaks then falls",
    },
    symptoms: [
      "Possible PMS symptoms",
      "Breast tenderness",
      "Bloating",
      "Mood changes",
      "Changes in appetite",
      "Fatigue (especially late luteal)",
    ],
    tips: [
      "Practice stress management",
      "Gentle exercise can help with symptoms",
      "Increase magnesium-rich foods",
      "Prioritize sleep",
      "Be kind to yourself",
      "Good time for detail-oriented work",
    ],
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

const HormoneInfoCard = ({ hormone, level, description }) => (
  <motion.div
    className="p-3 rounded-lg border border-gray-200 bg-white shadow-xs hover:shadow-sm transition-shadow"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center gap-2 mb-1">
      <div className="p-1 bg-blue-100 rounded-full">
        <FiActivity className="text-blue-500 text-sm" />
      </div>
      <h4 className="font-medium text-gray-800">{hormone}</h4>
    </div>
    <div className="text-xs text-gray-600">
      <span className="font-medium">Level: </span>
      <span className="font-semibold">{level}</span>
    </div>
    <p className="text-xs mt-1 text-gray-600">{description}</p>
  </motion.div>
);

const PhaseCard = ({ phase }) => (
  <motion.div
    className={`rounded-xl overflow-hidden border ${phase.borderColor} ${phase.bgColor} shadow-xs hover:shadow-sm transition-shadow`}
    whileHover={{ y: -2 }}
  >
    <div className={`p-4 ${phase.color} flex items-center gap-3`}>
      <div className="p-2 bg-white rounded-lg shadow-xs">{phase.icon}</div>
      <div>
        <h3 className="font-bold text-lg">{phase.name}</h3>
        <p className="text-sm opacity-90">{phase.days}</p>
      </div>
    </div>

    <div className="p-4">
      <p className="text-gray-700 mb-4 text-sm md:text-base">{phase.description}</p>

      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Hormone Activity</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <HormoneInfoCard
            hormone="Estrogen"
            level={phase.hormones.estrogen}
            description={
              phase.hormones.estrogen === "Rising"
                ? "Supports follicle development and uterine lining growth"
                : phase.hormones.estrogen === "Peak"
                ? "Triggers LH surge leading to ovulation"
                : "At baseline levels during menstruation"
            }
          />
          <HormoneInfoCard
            hormone="Progesterone"
            level={phase.hormones.progesterone}
            description={
              phase.hormones.progesterone === "Rising"
                ? "Prepares uterine lining for potential pregnancy"
                : phase.hormones.progesterone === "Peak"
                ? "Maintains uterine lining, causes PMS if no pregnancy"
                : "Remains low until after ovulation"
            }
          />
          {phase.hormones.fsh && (
            <HormoneInfoCard
              hormone="FSH"
              level={phase.hormones.fsh}
              description="Follicle stimulating hormone that promotes egg development"
            />
          )}
          {phase.hormones.lh && (
            <HormoneInfoCard
              hormone="LH"
              level={phase.hormones.lh}
              description="Luteinizing hormone that triggers ovulation"
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">
          Common Experiences
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {phase.symptoms.map((symptom, i) => (
            <li key={i} className="flex items-start gap-2">
              <FiHeart className={`mt-0.5 flex-shrink-0 ${phase.iconColor}`} size={14} />
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium text-gray-800 mb-2">
          Self-Care Tips
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {phase.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <FiInfo className={`mt-0.5 flex-shrink-0 ${phase.iconColor}`} size={14} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

const Education = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cycle Education</h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Understand your menstrual cycle phases and hormonal changes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Understanding Your Cycle
            </h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              The menstrual cycle is controlled by hormones that regulate ovulation
              and menstruation. An average cycle lasts 28 days, but normal cycles
              can range from 21 to 35 days.
            </p>
            <div className="relative h-32 sm:h-40 w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
              <div className="absolute inset-0 flex">
                {/* Menstrual Phase */}
                <div
                  className="h-full bg-red-100 flex items-end justify-center"
                  style={{ width: "18%" }}
                >
                  <div className="bg-red-500 w-full" style={{ height: "30%" }}></div>
                </div>
                {/* Follicular Phase */}
                <div
                  className="h-full bg-blue-100 flex items-end justify-center"
                  style={{ width: "32%" }}
                >
                  <div className="bg-blue-500 w-full" style={{ height: "70%" }}></div>
                </div>
                {/* Ovulation */}
                <div
                  className="h-full bg-yellow-100 flex items-end justify-center"
                  style={{ width: "7%" }}
                >
                  <div
                    className="bg-yellow-500 w-full"
                    style={{ height: "100%" }}
                  ></div>
                </div>
                {/* Luteal Phase */}
                <div
                  className="h-full bg-purple-100 flex items-end justify-center"
                  style={{ width: "43%" }}
                >
                  <div
                    className="bg-purple-500 w-full"
                    style={{ height: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1 sm:px-2">
              <span>Day 1</span>
              <span>Day 7</span>
              <span>Day 14</span>
              <span>Day 21</span>
              <span>Day 28</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Key Hormones
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-500 mt-0.5 flex-shrink-0">
                  <FiActivity size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Estrogen</h3>
                  <p className="text-sm text-gray-600">
                    Builds uterine lining, supports follicle development, peaks
                    before ovulation. Fluctuations affect energy, mood, and skin.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-500 mt-0.5 flex-shrink-0">
                  <FiThermometer size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Progesterone</h3>
                  <p className="text-sm text-gray-600">
                    Prepares uterus for pregnancy, rises after ovulation, drops if
                    no pregnancy. Affects body temperature and sleep quality.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="p-2 bg-green-100 rounded-lg text-green-500 mt-0.5 flex-shrink-0">
                  <FiBarChart2 size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">FSH & LH</h3>
                  <p className="text-sm text-gray-600">
                    Follicle stimulating hormone (FSH) and luteinizing hormone (LH) work
                    together to control ovulation and egg development.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Phases Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            The Four Phases Explained
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {phaseData.map((phase, index) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PhaseCard phase={phase} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Benefits of Cycle Tracking
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Understanding your cycle phases helps you anticipate physical and
            emotional changes, optimize activities, and identify potential health
            concerns. Tracking provides valuable insights for:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <FiHeart className="text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Predict patterns:</strong> Energy levels, mood swings, and productivity
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <FiActivity className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Optimize workouts:</strong> Match exercise intensity to your energy
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <FiSun className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Schedule events:</strong> Plan important activities at optimal times
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <FiThermometer className="text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Health insights:</strong> Identify potential hormonal imbalances
              </span>
            </li>
          </ul>
        </motion.div>

       
      </div>
    </div>
  );
};

export default Education;