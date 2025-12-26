import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex justify-between">
        <p>© {new Date().getFullYear()} ProManage. All rights reserved.</p>
        <p>Project Management Tool</p>
      </div>
    </footer>
  );
};

export default Footer;
