import React from "react";
import { useAppStore } from "../store/useAppStore";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ChartsSection from "../components/dashboard/ChartsSection";
import InsightsSection from "../components/dashboard/InsightsSection";
import ChatDock from "../components/dashboard/ChatDock";
import SummaryStrip from "../components/dashboard/SummaryStrip";

const Dashboard: React.FC = () => {
  const parsedCSV = useAppStore((s) => s.parsedCSV);

  if (!parsedCSV) return <div className="text-gray-500 p-4">No data loaded</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white">
      <DashboardHeader />
      <SummaryStrip />

      <div className="flex flex-col md:flex-row flex-1 p-4 gap-6">
        <div className="flex-1 space-y-6">
          <ChartsSection />
          <InsightsSection />
        </div>

        <ChatDock />
      </div>
    </div>
  );
};

export default Dashboard;