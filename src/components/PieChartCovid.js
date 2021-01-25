import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { RadialChart } from "react-vis";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function PieChartCovid({ data }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    if (data) {
      setProcessedData([
        {
          name: "Active",
          value: data["TotalConfirmed"] - data["TotalRecovered"],
        },
        {
          name: "Recovered",
          value: data["TotalRecovered"],
        },
        {
          name: "Death",
          value: data["TotalDeaths"],
        },
      ]);
    }
  }, [data]);
  return (
    <Paper elevation={2}  style={{ margin:'auto',marginTop: "2%" , width:'90%'}} >
      {processedData && (
        <PieChart width={400} height={400} style={{ margin: "auto", marginTop:'30px' }}>
          <Pie
            dataKey="value"
            nameKey="name"
            legendType="circle"
            data={processedData}
            cx={200}
            cy={200}
            outerRadius={150}
            innerRadius={50}
            fill="#8884d8"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {processedData.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              top: 0,
              left: 350,
              lineHeight: "24px",
            }}
          />
          <Tooltip />
        </PieChart>
      )}
    </Paper>
  );
}
