import React from "react";
import { motion } from "framer-motion";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <motion.h3 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {value}
          </motion.h3>
        </div>
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-md"
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
