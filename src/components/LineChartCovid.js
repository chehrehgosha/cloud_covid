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

export default function LineChartCovid({ data }) {
  const [processedData, setProcessedData] = useState(null);
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // console.log(data);
      const keys = Object.keys(data["cases"]);
      const cases = Object.values(data["cases"]).sort();
      const deaths = Object.values(data["deaths"]).sort();
      const recovered = Object.values(data["recovered"]).sort();
      let newData = [];
      let obj = {};
      for (let index = 0; index < keys.length; index++) {
        if (index === 0) {
          obj = {
            "Total Confirmed": cases[index],
            "Total Deaths": deaths[index],
            "Total Recovered": recovered[index],
          };
          // TotalData.push(obj)
        } else {
          obj = {
            name: keys[index],
            "Total Confirmed": cases[index],
            "Total Deaths": deaths[index],
            "Total Recovered": recovered[index],
          };
          newData.push(obj);
        }
      }
      // const newData = data.map(mapper);
      setProcessedData(newData);
    }
  }, [data]);
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
