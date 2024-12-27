'use client'

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Patient {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension: string;
    position: string;
}

interface Logs {
    patient: Patient;
    consultation_type: string;
    complaint: string[];
    findings: string[];
    createdAt: Date;
}

export default function HealthRecord() {
    const [logs, setLogs] = useState<Logs[]>([])

    const getLogs = useCallback(async () => {
        await axios.get('/api/patient-logs')
        .then(response => {
            console.log(response)
            const lg = response.data?.logs
            setLogs(lg)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getLogs()
    }, [getLogs])

    return (
        <div className="w-full flex justify-center items-center">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Health Records</h1>
                </header>
                <div className="relative w-full h-96 overflow-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600 sticky top-0">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Findings</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                logs.map((lg,index) => {
                                    return(
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">
                                                <p>
                                                    <span>{lg.patient?.first_name} </span>
                                                    <span>{lg.patient?.middle_name} </span>
                                                    <span>{lg.patient?.last_name} </span>
                                                    <span>{lg.patient?.extension} </span>
                                                </p>
                                            </td>
                                            <td className="p-2 border-b border-gray-200">{lg.patient?.position}</td>
                                            <td className="p-2 border-b border-gray-200">
                                                {
                                                    lg.findings.map((find, idx) => {
                                                        return(
                                                            <span key={idx}>{find}</span>
                                                        )
                                                    })
                                                }
                                            </td>
                                            <td className="p-2 border-b border-gray-200">{new Date(lg.createdAt).toLocaleDateString('en-PH')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}