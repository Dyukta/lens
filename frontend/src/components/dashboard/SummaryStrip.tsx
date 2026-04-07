import type { Insight } from "../../types";
import InsightCard from "../shared/InsightCard";

const SummaryStrip = () => {
  // Map your dashboard metrics to Insight objects
  const summaryData: Insight[] = [
    {
      id: "1",
      title: "Total Users",
      description: "Total number of users",
      type: "summary", // valid InsightType
    },
    {
      id: "2",
      title: "Active Sessions",
      description: "Current active sessions",
      type: "summary",
    },
    {
      id: "3",
      title: "Revenue",
      description: "Total revenue generated",
      type: "summary",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {summaryData.map((item) => (
        <InsightCard key={item.id} insight={item} />
      ))}
    </div>
  );
};

export default SummaryStrip;