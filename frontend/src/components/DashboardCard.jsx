import React from "react";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
