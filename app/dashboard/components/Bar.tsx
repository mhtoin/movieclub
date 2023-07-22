"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.size = 16;
export const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        autoSkip: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          size: 16,
        },
      },
    },
    title: {
      display: true,
      text: "Movies by user",
    },
    layout: {
      padding: 10,
    },
  },
};
type MovieData = { user: string; movies: number };

export default function BarChart({ chartData }: { chartData: UserChartData }) {
  const labels = chartData.data.map((item) => item.user);
  const data = {
    labels,
    datasets: [
      {
        label: "Movies from user's shortlist",
        data: labels.map(
          (label) => chartData.data.find((item) => item.user == label)?.movies
        ),
        backgroundColor: "rgba(215, 115, 210, 0.86)",
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 20,
        borderSkipped: false,
        borderColor: "rgba(255, 255, 255, 0.8)",
      },
    ],
  };
  return (
    <div className="flex flex-col items-center h-[400px] w-[300px] md:w-[700px] lg:w-[1000px] gap-5">
      <Bar options={options} data={data} />
    </div>
  );
}
