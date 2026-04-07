import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0a0a0f]">
      <button
        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 transition"
        onClick={() => navigate("/")}
      >
        Back
      </button>
      <h2 className="text-xl font-bold">Dashboard</h2>
    </header>
  );
};

export default DashboardHeader;