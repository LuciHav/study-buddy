import MetricCards from "@/components/MetricCards";
import { getRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [metrics, setMertics] = useState({
    totalUsers: null,
    totalRevenue: null,
    totalSales: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: "/api/v1/admin/dashboard" });
      if (resData.success) {
        setMertics(resData.metrics);
      } else {
        console.log("Error:", resData.message);
      }
      setLoading(false);
    })();
  });

  if (loading) <p>Loading</p>;
  return <MetricCards metrics={metrics} />;
}
