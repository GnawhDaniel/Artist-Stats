"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ListProps {
  data: any[];
  minimum: any;
  maximum: any;
}


export default function Graph({data, minimum, maximum}: ListProps) {
  const buffer = (maximum - minimum) * 0.07; // 5% of the range
  const adjustedMin = Math.floor((Math.max(0, minimum - buffer)) / 10) * 10;
  const adjustedMax = Math.ceil((maximum + buffer) / 10) * 10;

  return (
    <ResponsiveContainer width="100%" height="98%">        
      <LineChart data={data}>
        <Line
          connectNulls
          type="monotone"
          dataKey="followers"
          stroke="#8884d8"
        />
        <XAxis dataKey="date" angle={45} minTickGap={-200} />
        <YAxis domain={[adjustedMin, adjustedMax]} />
        <Legend wrapperStyle={{ position: "relative" }} />
        <Tooltip></Tooltip>
      </LineChart>
    </ResponsiveContainer>
  );
}