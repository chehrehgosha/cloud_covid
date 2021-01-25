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
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // console.log(data);
      const keys = Object.keys(data["cases"])
        .slice(Math.max(Object.keys(data["cases"]).length - 7, 1))
        .sort((a, b) => {
          const datea = a.split("/");
          const dateb = b.split("/");
          if (datea[2] > dateb[2]) {
            return 1;
          } else if (datea[2] < dateb[2]) {
            return -1;
          } else {
            if (datea[1] > dateb[1]) return 1;
            else if (datea[1] < dateb[1]) return -1;
            else {
              if (datea[0] > dateb[0]) return 1;
              else if (datea[0] < dateb[0]) return -1;
              else return 1;
            }
          }
        });
      const cases = Object.values(data["cases"])
        .slice(Math.max(Object.values(data["cases"]).length - 7, 1))
        .sort();
      const deaths = Object.values(data["deaths"])
        .slice(Math.max(Object.values(data["deaths"]).length - 7, 1))
        .sort();
      const recovered = Object.values(data["recovered"])
        .slice(Math.max(Object.values(data["recovered"]).length - 7, 1))
        .sort();
      let newData = [];
      let obj = {};
      for (let index = 0; index < keys.length; index++) {
        if (index === 0) {
          obj = {
            "New Confirmed": cases[index],
            "New Deaths": deaths[index],
            "New Recovered": recovered[index],
          };
          // newData.push(obj)
        } else {
          obj = {
            name: keys[index],
            "New Confirmed": cases[index] - cases[index - 1],
            "New Deaths": deaths[index] - deaths[index - 1],
            "New Recovered": recovered[index] - recovered[index - 1],
          };
          newData.push(obj);
        }
      }
      // const newData = data.map(mapper);
      setProcessedData(newData);
    }
  }, [data]);
  // console.log(processedData);
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
