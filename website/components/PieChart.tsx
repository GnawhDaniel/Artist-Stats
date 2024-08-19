import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Prop {
  genres: any[];
}

export default function PieChartWithPaddingAngle({ genres }: Prop) {
  const labels = genres.map(genre => genre.label);
  const values = genres.map(genre => genre.value);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Count',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.90)',
          'rgba(54, 162, 235, 0.90)',
          'rgba(255, 206, 86, 0.90)',
          'rgba(75, 192, 192, 0.90)',
          'rgba(153, 102, 255, 0.90)',
          'rgba(155, 200, 100, 0.90)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(155, 200, 100, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} />;

}
