import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
    },
  ];

  return (
    <Stack>
      <PieChart
        series={series}
        slotProps={{
          legend: {
            hidden: isHidden,
            labelStyle: {
              fill: "white"
            }
          },
        }}
        width={550}
        height={250}
      />
    </Stack>
  );
}
