'use client'

import axios from "axios";
import { useCallback, useEffect, useState } from "react"

interface Patient {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    extension: string | null;
    email: string | null;
    position: string | null;
    contact: string | null;
}

interface Appointment {
    patient: Patient | null;
    consultation_type: string;
    schedule: Date;
}

interface AppointmentState {
    appointments: Appointment[];
    loading: boolean;
}

export default function Scheduling() {
    const [appointments, setAppointments] = useState<AppointmentState>({
        appointments: [],
        loading: true
    })

    const getAppointments = useCallback(async () => {
        await axios.get('/api/schedule')
        .then(response => {
            console.log(response)
            const app = response.data?.schedule
            setAppointments({
                appointments: app,
                loading: false
            })
        })
        .catch(error => {
            console.log(error)
            setAppointments({
                ...appointments,
                loading: false
            })
        })
    }, [])

    useEffect(() => {
        getAppointments()
    }, [getAppointments])

    return (
        <div className="w-full flex justify-center items-center">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Appointments</h1>
                </header>
                <div className="relative w-full h-96 overflow-y-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Name</th>
                                <th>Cellphone Number</th>
                                <th>Position</th>
                                <th>Consultation</th>
                                <th>Schedule</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                appointments.appointments.map((app, index) => {
                                    const scheduleDate = new Date(app.schedule)
                                    return (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">
                                                {app.patient?.first_name} {app.patient?.middle_name} {app.patient?.last_name} {app.patient?.extension}
                                            </td>
                                            <td className="p-2 border-b border-gray-200">{app.patient?.contact}</td>
                                            <td className="p-2 border-b border-gray-200">{app.patient?.position}</td>
                                            <td className="p-2 border-b border-gray-200">{app.consultation_type}</td>
                                            <td className="p-2 border-b border-gray-200">{scheduleDate.toLocaleDateString('en-US')} {scheduleDate.toLocaleTimeString('en-US')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        appointments.loading && (
                            <div className="absolute w-full h-full top-0 left-0 bg-black/80 flex justify-center items-center">
                                <p className="text-white animate-pulse">Loading...</p>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}