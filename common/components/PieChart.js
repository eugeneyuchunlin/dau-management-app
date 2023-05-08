import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
    const graph_data = {
        labels: data.map((item) => item.username),
        datasets: [
        {
            label: "Usage",
            data: data.map((item) => item.total_time),
            backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)", 
            "rgba(255, 206, 86, 0.2)", 
            "rgba(75, 192, 192, 0.2)", 
            "rgba(153, 102, 255, 0.2)", 
            "rgba(255, 159, 64, 0.2)", 
            ],
            borderColor: [
            "rgba(255, 99, 132, 1)", 
            "rgba(54, 162, 235, 1)", 
            "rgba(255, 206, 86, 1)", 
            "rgba(75, 192, 192, 1)", 
            "rgba(153, 102, 255, 1)", 
            "rgba(255, 159, 64, 1)", 
            ],
            borderWidth: 1,
        },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false, // set to false to allow adjusting chart size
    };
    
    return (
        <Pie
        data={graph_data}
        options={options}
        width={400}
        height={400}
        />
    );
}