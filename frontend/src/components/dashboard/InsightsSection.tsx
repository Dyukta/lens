import React from "react";
import { useAppStore } from "../../store/useAppStore";
import InsightCard from "../shared/InsightCard";

const InsightsSection: React.FC = () => {
  const insights = useAppStore((state) => state.insights);

  if (!insights || insights.length === 0)
    return <div className="text-gray-500 p-4">No insights available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};

export default InsightsSection;