"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ListProps {
  data: any[];
  minimum: number;
  maximum: number;
}


export default function Graph({data, minimum, maximum}: ListProps) {

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
        <YAxis domain={[minimum, maximum]} />
        <Legend wrapperStyle={{ position: "relative" }} />
        <Tooltip></Tooltip>
      </LineChart>
    </ResponsiveContainer>
  );
}