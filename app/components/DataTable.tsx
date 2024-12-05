'use client'

import React from 'react';

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

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const output: DataRow[] = data.reduce<DataRow[]>((acc, record) => {
    let existing = acc.find((item) => item.findings === record.findings);

    if (!existing) {
        existing = { findings: record.findings, counts: Array(12).fill(0) };
        acc.push(existing);
    }

    existing.counts[record.month] = record.count;

    return acc;
    }, []);

    return (
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
                {
                    output.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-300 font-semibold">{record.findings}</td>
                        {record.counts.map((count, i) => (
                        <td key={i} className="px-4 py-2 border border-gray-300 text-center">{count}</td>
                        ))}
                    </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default DataTable;
