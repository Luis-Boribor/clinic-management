'use client'

import { useAuthStore } from "@/app/stores/auth";
import axios from "axios"
// import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

interface Appointment {
    patient: string;
    consultation_type: string;
    status: string;
    schedule: Date;
}

interface AppointmentState {
    appointments: Appointment[];
    loading: boolean;
}

export default function Schedule() {
    // const session = useSession()
    const store = useAuthStore()
    const [appointments, setAppointments] = useState<AppointmentState>({
        appointments: [],
        loading: true
    })

    const getAppointments = useCallback(async () => {
        await axios.get(`/api/schedule?email=${store?.user?.email}`)
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
    }, [store.user])

    useEffect(() => {
        getAppointments()
    }, [getAppointments])

    return (
        <div className="w-full flex justify-center items-center pt-20">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Appointments</h1>
                    <Link href={'/user/schedule/create'} className="p-2 rounded bg-green-300 hover:bg-green-400 text-black hover:text-white font-semibold">Create</Link>
                </header>
                <div className="relative w-full h-96 overflow-y-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Consultation</th>
                                <th>Status</th>
                                <th>Schedule</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                appointments.appointments.map((app, index) => {
                                    const scheduleDate = new Date(app.schedule)
                                    return (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">{app.consultation_type}</td>
                                            <td className="p-2 border-b border-gray-200">{app?.status}</td>
                                            <td className="p-2 border-b border-gray-200">{scheduleDate.toLocaleDateString('en-US')} {scheduleDate.toLocaleTimeString('en-US')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        appointments.loading && (
                            <div className="absolute w-full h-full bg-black/80 top-0 left-0 z-9 flex justify-center items-center">
                                <p className="text-white animate-pulse">Loading...</p>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}