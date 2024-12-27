'use client'

import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Patient {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    extension: string | null;
    email: string | null;
    position: string | null;
    contact: string | null;
    id_number: string | null;
}

interface Appointment {
    _id: string;
    patient: Patient | null;
    consultation_type: string;
    status: string;
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
    const [appArr, setAppArr] = useState<Appointment[]>([])

    const getAppointments = useCallback(async () => {
        try {
            const response = await axios.get('/api/schedule');
            const app = response.data?.schedule || [];
            setAppointments({ appointments: app, loading: false });
            setAppArr(app);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments(prev => ({ ...prev, loading: false }));
        }
    }, [])

    useEffect(() => {
        getAppointments()
    }, [getAppointments])

    const handleSearch = (key: string) => {
        const temp = appArr.filter(app => 
            app.patient?.first_name?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.middle_name?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.last_name?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.extension?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.position?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.email?.toLowerCase().includes(key.toLowerCase()) ||
            app.patient?.id_number?.toLowerCase().includes(key.toLowerCase()) ||
            app.consultation_type?.toLowerCase().includes(key.toLowerCase()) 
        )
        setAppointments({
            ...appointments,
            appointments: temp
        })
    }

    const confirmAccept = (id: string) => {
        Swal.fire({
            title: 'Accept Confirmation',
            text: 'Are you sure you want to accept appointment?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                acceptAppointment(id)
            }
        })
    }
    
    const confirmReject = (id: string) => {
        Swal.fire({
            title: 'Reject Confirmation',
            text: 'Are you sure you want to reject appointment?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                rejectAppointment(id)
            }
        })
    }

    const acceptAppointment = async (id: string) => {
        try {
            const response = toast.promise(
                axios.put(`/api/schedule?schedule_id=${id}`, { status: 'accepted' }),
                {
                    pending: 'Accepting appointment...',
                    success: 'Accepted',
                    error: 'Error'
                }
            )
            const apps = (await response).data?.schedule
            setAppArr(apps)
            setAppointments({
                ...appointments,
                appointments: apps
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    title: 'Appointment Error',
                    text: error.response?.data?.message ?? error.message,
                    icon: 'error',
                });
            }
        }
    }

    const rejectAppointment = async (id: string) => {
        try {
            const response = toast.promise(
                axios.put(`/api/schedule?schedule_id=${id}`, { status: 'rejected' }),
                {
                    pending: 'Accepting appointment...',
                    success: 'Accepted',
                    error: 'Error'
                }
            )
            const apps = (await response).data?.schedule
            setAppArr(apps)
            setAppointments({
                ...appointments,
                appointments: apps
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    title: 'Appointment Error',
                    text: error.response?.data?.message ?? error.message,
                    icon: 'error',
                });
            }
        }
    }

    return (
        <div className="w-full flex justify-center items-center">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Appointments</h1>
                    <input type="text" onChange={e=>handleSearch(e.target.value)} className="p-2 text-sm w-1/3 rounded" placeholder="Search" />
                    <Link href={'/admin/scheduling/create'} className="block p-2 text-white text-sm font-bold bg-blue-600 hover:bg-blue-900 rounded">Create</Link>
                </header>
                <div className="relative w-full h-96 overflow-y-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600 sticky top-0">
                            <tr>
                                <th>Name</th>
                                <th>Cellphone Number</th>
                                <th>Position</th>
                                <th>Consultation</th>
                                <th>Status</th>
                                <th>Schedule</th>
                                <th>Action</th>
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
                                            <td className="p-2 border-b border-gray-200">{app?.status}</td>
                                            <td className="p-2 border-b border-gray-200">{scheduleDate.toLocaleDateString('en-US')} {scheduleDate.toLocaleTimeString('en-US')}</td>
                                            <td className="p-2 border-b border-gray-200">
                                                <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                    <button onClick={()=>confirmAccept(app._id)} className="p-2 rounded text-white text-sm font-bold bg-blue-400 hover:bg-blue-600">Accept</button>
                                                    <button onClick={()=>confirmReject(app._id)} className="p-2 rounded text-white text-sm font-bold bg-rose-400 hover:bg-rose-600">Reject</button>
                                                </div>
                                            </td>
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