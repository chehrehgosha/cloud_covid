import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function BarChartCovid({ data }) {
  const [processedData, setProcessedData] = useState(null);
  const mapper = (element) => {
    return {
      "New Confirmed": element["NewConfirmed"],
      "New Deaths": element["NewDeaths"],
      "New Recovered": element["NewRecovered"],
    };
  };
  useEffect(() => {
    if (data) {
      const newData = data.map(mapper);
      setProcessedData(newData);
    }
  }, [data]);
  console.log(processedData);
  return (
    <div>
      <BarChart
        style={{ margin: "auto" }}
        width={700}
        height={400}
        data={processedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="New Confirmed" fill="#fcba03" />
        <Bar dataKey="New Deaths" fill="#fc032d" />
        <Bar dataKey="New Recovered" fill="#13ed07" />
      </BarChart>
    </div>
  );
}
