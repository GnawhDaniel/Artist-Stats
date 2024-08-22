"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataItem {
  date: string;
  followers: number | null;
}

interface ListProps {
  data: DataItem[];
  minimum: any;
  maximum: any;
  artistName: string;
}

function appendNullDates(data: DataItem[]) {  
  const transformed_data = data.map((entry) => {
    const [year, month, day] = entry.date.split("-").map(Number);
    return {
      date: new Date(Date.UTC(year, month - 1, day)), // Treat as UTC date
      followers: entry.followers,
    };
  });

  if (data.length < 2) {
    return transformed_data;
  }

  const new_data: { date: Date; followers: number | null }[] = [transformed_data[0]];

  let previous: Date = new Date(transformed_data[0].date.getTime());

  let index = 1;

  while (transformed_data[index]) {
    const differenceInDays =
      (transformed_data[index].date.getTime() - previous.getTime()) /
      (1000 * 60 * 60 * 24);

    if (differenceInDays > 1) {
      let a = 0
      for (let i = 1; i < (differenceInDays); i++) {
        const temp = new Date(previous.getTime())
        temp.setDate(temp.getDate() + 1);
        previous = temp;
        new_data.push({ date: new Date(temp), followers: NaN});
      }

    } else {

      new_data.push({
        date: new Date(transformed_data[index].date),
        followers: transformed_data[index].followers
      });
      previous = new Date(transformed_data[index].date.getTime());
      index++;
    }
  }
  return new_data;
}

export default function Graph({ data, minimum, maximum, artistName}: ListProps) {
  const data_transformed: { date: Date; followers: number | null }[] =
    appendNullDates(data);
  const dates = data_transformed.map((d) => d.date.toDateString());
  const followers = data_transformed.map((d) => d.followers);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${artistName}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgb(220,220,220)",
          beginAtZero: true
        },
        grid: {
          display: false,
        },
        border: {
          color: "rgb(220,220,220)",
        },
      },
      y: {
        ticks: {
          color: "rgb(220,220,220)",
        },
        grid: {
          display: false,
        },
        border: {
          color: "rgb(220,220,220)",
        },
      },
    },
  };

  const dataset = {
    labels: dates,
    datasets: [
      {
        label: "Follower Count",
        data: followers,
        borderColor: "rgb(255,140,0)",
        backgroundColor: "rgba(255,165,0, 0.5)",
        spanGaps: true,
        pointRadius: 5
      },
    ],
  };

  return <Line options={options} data={dataset} />;
}
