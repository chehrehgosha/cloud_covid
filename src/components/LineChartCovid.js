import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function LineChartCovid({ data, length }) {
  const [processedData, setProcessedData] = useState(null);
  const mapper = (element, index) => {
    const dat = new Date();
    dat.setDate(dat.getDate()-(length-index))
    return {
      "Total Confirmed": element["TotalConfirmed"],
      "Total Deaths": element["TotalDeaths"],
      "Total Recovered": element["TotalRecovered"],
      "name": dat.toString().slice(4,10)
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
      <LineChart
        style={{ margin: "auto" }}
        width={700}
        height={700}
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
        <Line
          type="monotone"
          dataKey="Total Confirmed"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Total Deaths" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Total Recovered" stroke="#52ca9d" />
      </LineChart>
    </div>
  );
}
