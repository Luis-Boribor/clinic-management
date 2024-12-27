'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

interface RecordInput {
  findings: string;
  year: number;
  month: number;
  count: number;
}

interface DataRow {
  findings: string;
  counts: number[];
}

interface DataTableProps {
  data: RecordInput[];
}

const borderColors = [
  'rgba(255, 99, 132, 1)',   // Red
  'rgba(54, 162, 235, 1)',  // Blue
  'rgba(255, 206, 86, 1)',  // Yellow
  'rgba(75, 192, 192, 1)',  // Teal
  'rgba(153, 102, 255, 1)', // Purple
  'rgba(255, 159, 64, 1)',  // Orange
  'rgba(201, 203, 207, 1)', // Gray
  'rgba(0, 128, 0, 1)',     // Green
  'rgba(128, 0, 128, 1)',   // Dark Purple
  'rgba(255, 0, 255, 1)',   // Magenta
  'rgba(0, 255, 255, 1)',   // Cyan
  'rgba(128, 128, 0, 1)',   // Olive
];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const output: DataRow[] = data.reduce<DataRow[]>((acc, record) => {
    let existing = acc.find((item) => item.findings === record.findings);

    if (!existing) {
      existing = { findings: record.findings, counts: Array(12).fill(0) };
      acc.push(existing);
    }

    existing.counts[record.month] = record.count;

    return acc;
  }, []);

  const datasets = output.map((item, index) => ({
    label: item.findings,
    data: item.counts,
    borderColor: borderColors[index % borderColors.length],
    backgroundColor: borderColors[index % borderColors.length],
    fill: false,
  }));

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        // Destroy any existing chart instance before creating a new one
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: datasets,
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Findings',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [datasets]);

  return (
    <div className="w-full space-y-5">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Findings</th>
            {months.map((month) => (
              <th key={month} className="px-4 py-2 border border-gray-300">{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {output.map((record, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 font-semibold">{record.findings}</td>
              {record.counts.map((count, i) => (
                <td key={i} className="px-4 py-2 border border-gray-300 text-center">{count}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DataTable;
