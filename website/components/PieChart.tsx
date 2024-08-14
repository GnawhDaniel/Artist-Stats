import * as React from "react";
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";

// const data = [
//   { label: 'Group A', value: 400 },
//   { label: 'Group B', value: 300 },
//   { label: 'Group C', value: 300 },
//   { label: 'Group D', value: 200 },
// ];

interface Prop {
  genres: any[];
}

export default function PieChartWithPaddingAngle({ genres }: Prop) {
  const [isHidden, setIsHidden] = React.useState(false);
  const series = [
    {
      data: genres,
      innerRadius: 50,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: 0,
      endAngle: 360,
      cx: 130,
      cy: 120,
    },
  ];

  return (
    <PieChart
      series={series}
      slotProps={{
        legend: {
          // direction: 'row',
          // position: {vertical: 'top', horizontal: "middle"},
          hidden: isHidden,
          labelStyle: {
            fill: "white"
          }
        },
      }}
      width={450}
      height={250}
    />
  );
}
