// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   FiCalendar,
//   FiPlus,
//   FiTrash2,
//   FiEdit,
//   FiSave,
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";
// import {
//   format,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   startOfDay,
//   endOfDay ,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isSameDay,
//   parseISO,
//   startOfWeek,
//   endOfWeek,
//   isWithinInterval,
// } from "date-fns";

// const PeriodTracker = () => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [periods, setPeriods] = useState([]);
//   const [newPeriod, setNewPeriod] = useState({
//     startDate: "",
//     endDate: "",
//     notes: "",
//     symptoms: [],
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   const symptomOptions = [
//     "Cramps",
//     "Headache",
//     "Fatigue",
//     "Bloating",
//     "Mood swings",
//     "Back pain",
//     "Breast tenderness",
//     "Acne",
//   ];

//   const symptomColors = {
//     'Cramps': 'border-red-300 bg-red-50 text-red-700',
//     'Headache': 'border-blue-300 bg-blue-50 text-blue-700',
//     'Fatigue': 'border-amber-300 bg-amber-50 text-amber-700',
//     'Bloating': 'border-emerald-300 bg-emerald-50 text-emerald-700',
//     'Mood swings': 'border-purple-300 bg-purple-50 text-purple-700',
//     'Back pain': 'border-indigo-300 bg-indigo-50 text-indigo-700',
//     'Breast tenderness': 'border-pink-300 bg-pink-50 text-pink-700',
//     'Acne': 'border-gray-300 bg-gray-50 text-gray-700'
//   };

//   // Load saved periods
//   useEffect(() => {
//     const loadPeriods = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/period-tracker`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         console.log(response.data.data)
//         setPeriods(response.data.data || []);
//       } catch (error) {
//         console.error("Failed to load periods:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load period data",
//           timer: 3000,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadPeriods();
//   }, []);

//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };

//   const getCalendarDays = () => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(currentMonth);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);

//     return eachDayOfInterval({ start: startDate, end: endDate });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPeriod((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSymptomChange = (symptom) => {
//     setNewPeriod((prev) => {
//       if (prev.symptoms.includes(symptom)) {
//         return {
//           ...prev,
//           symptoms: prev.symptoms.filter((s) => s !== symptom),
//         };
//       } else {
//         return {
//           ...prev,
//           symptoms: [...prev.symptoms, symptom],
//         };
//       }
//     });
//   };

//   const savePeriod = async () => {
//     if (!newPeriod.startDate || !newPeriod.endDate) {
//       Swal.fire({
//         icon: "warning",
//         title: "Incomplete Information",
//         text: "Please select both start and end dates",
//         timer: 3000,
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const periodData = {
//         ...newPeriod,
//         symptoms: newPeriod.symptoms,
//       };

//       if (editingId) {
//         await axios.put(
//           `${import.meta.env.VITE_API_URL}/api/period-tracker/${editingId}`,
//           periodData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_URL}/api/period-tracker`,
//           periodData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/period-tracker`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setPeriods(response.data.data || []);

//       resetForm();
//       Swal.fire({
//         icon: "success",
//         title: editingId ? "Period Updated" : "Period Recorded",
//         text: editingId
//           ? "Your period has been updated"
//           : "New period has been recorded",
//         timer: 3000,
//       });
//     } catch (error) {
//       console.error("Error saving period:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to save period data",
//         timer: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const editPeriod = (period) => {
//     setNewPeriod({
//       startDate: period.startDate.split("T")[0],
//       endDate: period.endDate.split("T")[0],
//       notes: period.notes,
//       symptoms: period.symptoms,
//     });
//     setEditingId(period._id);
//     setShowForm(true);
//   };

//   const deletePeriod = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/period-tracker/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/period-tracker`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setPeriods(response.data.data || []);

//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Period record has been deleted",
//         timer: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting period:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to delete period record",
//         timer: 3000,
//       });
//     }
//   };

//   const resetForm = () => {
//     setNewPeriod({
//       startDate: "",
//       endDate: "",
//       notes: "",
//       symptoms: [],
//     });
//     setEditingId(null);
//     setShowForm(false);
//   };

//  const isPeriodDay = (day) => {
//   const current = startOfDay(day);

//   return periods.some((period) => {
//     const startDate = startOfDay(parseISO(period.startDate));
//     const endDate = endOfDay(parseISO(period.endDate));
//     return isWithinInterval(current, { start: startDate, end: endDate });
//   });
// };
//   const getDayIntensity = (day) => {
//   const current = startOfDay(day);

//   const dayPeriods = periods.filter((period) => {
//     const startDate = startOfDay(parseISO(period.startDate));
//     const endDate = endOfDay(parseISO(period.endDate));
//     return isWithinInterval(current, { start: startDate, end: endDate });
//   });

//   if (dayPeriods.length === 0) return 0;

//   const isStartOrEnd = dayPeriods.some((period) => {
//     const start = startOfDay(parseISO(period.startDate));
//     const end = startOfDay(parseISO(period.endDate));
//     return current.getTime() === start.getTime() || current.getTime() === end.getTime();
//   });

//   return isStartOrEnd ? 2 : 1;
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
//       >
//         <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-5 text-white">
//           <div className="flex items-center gap-3">
//             <FiCalendar size={24} />
//             <div>
//               <h1 className="text-xl font-bold">Period Tracker</h1>
//               <p className="text-pink-100 text-sm mt-1">
//                 Track your menstrual cycle and symptoms
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="p-5 space-y-6">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={prevMonth}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <FiChevronLeft size={20} />
//             </button>
//             <h2 className="text-lg font-semibold text-gray-800">
//               {format(currentMonth, "MMMM yyyy")}
//             </h2>
//             <button
//               onClick={nextMonth}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <FiChevronRight size={20} />
//             </button>
//           </div>

//           <div className="grid grid-cols-7 gap-1 mb-6">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//               <div
//                 key={day}
//                 className="text-center text-xs font-medium text-gray-500 py-2 uppercase tracking-wider"
//               >
//                 {day}
//               </div>
//             ))}

//             {getCalendarDays().map((day, i) => {
//               const isCurrentMonth = isSameMonth(day, currentMonth);
//               const isPeriod = isPeriodDay(day);
//               const isToday = isSameDay(day, new Date());
//               const intensity = getDayIntensity(day);

//               return (
//                 <div
//                   key={i}
//                   className={`relative p-1 h-12 flex flex-col items-center justify-center 
//                     ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
//                     ${isToday ? "border-2 border-pink-500 rounded-lg" : ""}
//                     transition-all duration-100
//                   `}
//                 >
//                   <span className={`text-sm z-10 ${isToday ? "font-bold" : ""}`}>
//                     {format(day, "d")}
//                   </span>
                  
//                   {isPeriod && isCurrentMonth && (
//                     <>
//                       <div className={`absolute inset-0 rounded-lg ${
//                         intensity === 2 ? 
//                         'bg-pink-400' : 
//                         'bg-pink-200'
//                       } opacity-80`}></div>
//                       {intensity === 2 && (
//                         <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-600"></div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {!showForm && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowForm(true)}
//               className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center justify-center gap-2 shadow-md transition-colors"
//             >
//               <FiPlus size={16} />
//               <span>Add Period</span>
//             </motion.button>
//           )}

//           {showForm && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200"
//             >
//               <h3 className="font-medium text-gray-800 text-lg">
//                 {editingId ? "Edit Period" : "Record New Period"}
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={newPeriod.startDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={newPeriod.endDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Symptoms
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {symptomOptions.map((symptom) => (
//                     <motion.button
//                       key={symptom}
//                       type="button"
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleSymptomChange(symptom)}
//                       className={`px-3 py-1 rounded-full text-sm border-2 ${
//                         newPeriod.symptoms.includes(symptom)
//                           ? symptomColors[symptom]
//                           : "border-gray-200 bg-white text-gray-700"
//                       } transition-colors`}
//                     >
//                       {symptom}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes
//                 </label>
//                 <textarea
//                   name="notes"
//                   value={newPeriod.notes}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
//                   placeholder="Any additional notes about this period..."
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={savePeriod}
//                   disabled={
//                     isLoading || !newPeriod.startDate || !newPeriod.endDate
//                   }
//                   className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-colors"
//                 >
//                   <FiSave size={16} />
//                   {isLoading ? "Saving..." : "Save Period"}
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={resetForm}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}

//           <div className="space-y-4">
//             <h3 className="font-medium text-gray-800 flex items-center gap-2 text-lg">
//               <FiCalendar className="text-pink-600" />
//               Period History
//             </h3>

//             {periods.length === 0 ? (
//               <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
//                 No period records yet. Add your first period to start tracking.
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {periods.map((period) => (
//                   <motion.div
//                     key={period._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           {format(parseISO(period.startDate), "MMM d")} -{" "}
//                           {format(parseISO(period.endDate), "MMM d, yyyy")}
//                         </p>
//                         {period.notes && (
//                           <p className="text-sm text-gray-600 mt-1">
//                             {period.notes}
//                           </p>
//                         )}
//                         {period.symptoms && period.symptoms.length > 0 && (
//                           <div className="flex flex-wrap gap-1 mt-2">
//                             {period.symptoms.map((symptom) => (
//                               <motion.span
//                                 key={symptom}
//                                 whileHover={{ scale: 1.05 }}
//                                 className={`px-2 py-0.5 rounded-full text-xs border-2 ${symptomColors[symptom]}`}
//                               >
//                                 {symptom}
//                               </motion.span>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => editPeriod(period)}
//                           className="text-blue-600 hover:text-blue-800 transition-colors"
//                           title="Edit"
//                         >
//                           <FiEdit size={16} />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => deletePeriod(period._id)}
//                           className="text-red-600 hover:text-red-800 transition-colors"
//                           title="Delete"
//                         >
//                           <FiTrash2 size={16} />
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PeriodTracker;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiCalendar,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfDay,
  endOfDay,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  addDays,
  differenceInDays,
} from "date-fns";

const PeriodTracker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [periods, setPeriods] = useState([]);
  const [newPeriod, setNewPeriod] = useState({
    startDate: "",
    endDate: "",
    notes: "",
    symptoms: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [allPeriodDays, setPeriodDays] = useState([]);

  const symptomOptions = [
    "Cramps",
    "Headache",
    "Fatigue",
    "Bloating",
    "Mood swings",
    "Back pain",
    "Breast tenderness",
    "Acne",
  ];

  const symptomColors = {
    'Cramps': 'border-red-300 bg-red-50 text-red-700',
    'Headache': 'border-blue-300 bg-blue-50 text-blue-700',
    'Fatigue': 'border-amber-300 bg-amber-50 text-amber-700',
    'Bloating': 'border-emerald-300 bg-emerald-50 text-emerald-700',
    'Mood swings': 'border-purple-300 bg-purple-50 text-purple-700',
    'Back pain': 'border-indigo-300 bg-indigo-50 text-indigo-700',
    'Breast tenderness': 'border-pink-300 bg-pink-50 text-pink-700',
    'Acne': 'border-gray-300 bg-gray-50 text-gray-700'
  };

  const getAllPeriodDays = (periods) => {
  const allDays = [];

  periods.forEach((period) => {
    console.log(periods);
    const start = startOfDay(parseISO(period.startDate));
    const end = endOfDay(parseISO(period.endDate));
    console.log(start, end);

    const days = eachDayOfInterval({ start, end });
    console.log(days)
    allDays.push(...days);
  });

  return allDays;
};

  // Load saved periods
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/period-tracker`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const periodsWithDuration = response.data.data.map(period => {
          const start = new Date(period.startDate);
          const end = new Date(period.endDate);
          const durationDays = differenceInDays(end, start) + 1;
          return { ...period, durationDays };
        });
        setPeriods(periodsWithDuration || []);
        const periodDaysArray = getAllPeriodDays(periodsWithDuration || []);
        setPeriodDays(periodDaysArray);

      } catch (error) {
        console.error("Failed to load periods:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load period data",
          timer: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadPeriods();
  }, []);

//   console.log(allPeriodDays)

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPeriod((prev) => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (symptom) => {
    setNewPeriod((prev) => {
      if (prev.symptoms.includes(symptom)) {
        return {
          ...prev,
          symptoms: prev.symptoms.filter((s) => s !== symptom),
        };
      } else {
        return {
          ...prev,
          symptoms: [...prev.symptoms, symptom],
        };
      }
    });
  };

  const savePeriod = async () => {
    if (!newPeriod.startDate || !newPeriod.endDate) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please select both start and end dates",
        timer: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Calculate duration in days
      const start = new Date(newPeriod.startDate);
      const end = new Date(newPeriod.endDate);
      const durationDays = differenceInDays(end, start) + 1; // +1 to include both start and end days
      
      const periodData = {
        ...newPeriod,
        symptoms: newPeriod.symptoms,
        durationDays: durationDays,
      };

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/period-tracker/${editingId}`,
          periodData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/period-tracker`,
          periodData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period-tracker`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Calculate duration for all periods
      const periodsWithDuration = response.data.data.map(period => {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        const durationDays = differenceInDays(end, start) + 1;
        return { ...period, durationDays };
      });
      
      setPeriods(periodsWithDuration || []);

      resetForm();
      Swal.fire({
        icon: "success",
        title: editingId ? "Period Updated" : "Period Recorded",
        text: editingId
          ? "Your period has been updated"
          : "New period has been recorded",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error saving period:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save period data",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editPeriod = (period) => {
    setNewPeriod({
      startDate: period.startDate.split("T")[0],
      endDate: period.endDate.split("T")[0],
      notes: period.notes,
      symptoms: period.symptoms,
    });
    setEditingId(period._id);
    setShowForm(true);
  };

  const deletePeriod = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/period-tracker/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period-tracker`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const periodsWithDuration = response.data.data.map(period => {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        const durationDays = differenceInDays(end, start) + 1;
        return { ...period, durationDays };
      });
      
      setPeriods(periodsWithDuration || []);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Period record has been deleted",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error deleting period:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete period record",
        timer: 3000,
      });
    }
  };

  const resetForm = () => {
    setNewPeriod({
      startDate: "",
      endDate: "",
      notes: "",
      symptoms: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const isPeriodDay = (day) => {
    const current = startOfDay(day);
    
    return periods.some((period) => {
      const startDate = startOfDay(parseISO(period.startDate));
      const endDate = addDays(startDate, period.durationDays - 1);
      const adjustedEndDate = endOfDay(endDate);
      
      return isWithinInterval(current, { start: startDate, end: adjustedEndDate });
    });
  };

  const getDayIntensity = (day) => {
    const current = startOfDay(day);

    const dayPeriods = periods.filter((period) => {
      const startDate = startOfDay(parseISO(period.startDate));
      const endDate = addDays(startDate, period.durationDays - 1);
      const adjustedEndDate = endOfDay(endDate);
      
      return isWithinInterval(current, { start: startDate, end: adjustedEndDate });
    });

    if (dayPeriods.length === 0) return 0;

    const isStartOrEnd = dayPeriods.some((period) => {
      const start = startOfDay(parseISO(period.startDate));
      const end = addDays(start, period.durationDays - 1);
      return current.getTime() === start.getTime() || current.getTime() === end.getTime();
    });

    return isStartOrEnd ? 2 : 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <FiCalendar size={24} />
            <div>
              <h1 className="text-xl font-bold">Period Tracker</h1>
              <p className="text-pink-100 text-sm mt-1">
                Track your menstrual cycle and symptoms
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {getCalendarDays().map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isPeriod = isPeriodDay(day);
              const isToday = isSameDay(day, new Date());
              const intensity = getDayIntensity(day);
            //   console.log(day, "Period", isPeriod,"IS curent", isCurrentMonth,"istoday", isToday, intensity);

              return (
                <div
                  key={i}
                  className={`relative p-1 h-12 flex flex-col items-center justify-center 
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                    ${isToday ? "border-2 border-pink-500 rounded-lg" : ""}
                    transition-all duration-100
                  `}
                >
                  <span className={`text-sm z-10 ${isToday ? "font-bold" : ""}`}>
                    {format(day, "d")}
                  </span>
                  
                  {isPeriod && isCurrentMonth && (
                    <>
                      <div className={`absolute inset-0 rounded-lg ${
                        intensity === 2 ? 
                        'bg-pink-400' : 
                        'bg-pink-200'
                      } opacity-80`}></div>
                      {intensity === 2 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-600"></div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <FiPlus size={16} />
              <span>Add Period</span>
            </motion.button>
          )}

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200"
            >
              <h3 className="font-medium text-gray-800 text-lg">
                {editingId ? "Edit Period" : "Record New Period"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newPeriod.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={newPeriod.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((symptom) => (
                    <motion.button
                      key={symptom}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSymptomChange(symptom)}
                      className={`px-3 py-1 rounded-full text-sm border-2 ${
                        newPeriod.symptoms.includes(symptom)
                          ? symptomColors[symptom]
                          : "border-gray-200 bg-white text-gray-700"
                      } transition-colors`}
                    >
                      {symptom}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={newPeriod.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                  placeholder="Any additional notes about this period..."
                />
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={savePeriod}
                  disabled={
                    isLoading || !newPeriod.startDate || !newPeriod.endDate
                  }
                  className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <FiSave size={16} />
                  {isLoading ? "Saving..." : "Save Period"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 text-lg">
              <FiCalendar className="text-pink-600" />
              Period History
            </h3>

            {periods.length === 0 ? (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                No period records yet. Add your first period to start tracking.
              </div>
            ) : (
              <div className="space-y-3">
                {periods.map((period) => (
                  <motion.div
                    key={period._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {format(parseISO(period.startDate), "MMM d")} -{" "}
                          {format(parseISO(period.endDate), "MMM d, yyyy")} 
                          <span className="text-sm text-gray-500 ml-2">
                            ({period.durationDays} {period.durationDays > 1 ? 'days' : 'day'})
                          </span>
                        </p>
                        {period.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {period.notes}
                          </p>
                        )}
                        {period.symptoms && period.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {period.symptoms.map((symptom) => (
                              <motion.span
                                key={symptom}
                                whileHover={{ scale: 1.05 }}
                                className={`px-2 py-0.5 rounded-full text-xs border-2 ${symptomColors[symptom]}`}
                              >
                                {symptom}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => editPeriod(period)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deletePeriod(period._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PeriodTracker;