import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartsWidget = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        // You can add checks for response.ok here if you want to handle HTTP errors (e.g., 404, 500)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const labels = data.slice(0, 5).map((post) => post.id);
        const values = data.slice(0, 5).map((post) => post.userId);

        setChartData({
          labels,
          datasets: [
            {
              label: "User ID per Post",
              data: values,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setChartData(null);
      });
  }, []);

  return (
    <div className="widget">
      <div className="widget-title">Chart Widget</div>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default ChartsWidget;
