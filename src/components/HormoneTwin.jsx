import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HormoneTwin = ({ data }) => {
  const chartData = {
    labels: data?.labels || Array.from({ length: 28 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Estrogen',
        data: data?.estrogenLevels || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Progesterone',
        data: data?.progesteroneLevels || [],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value} pg/mL`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hormone Level (pg/mL)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Cycle Day'
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default HormoneTwin;