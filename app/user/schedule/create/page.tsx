'use client'

import axios from "axios";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface Schedule {
    email: string;
    consultation_type: string;
    schedule: Date | null;
}

export default function Create() {
    const session = useSession()
    const [schedule, setSchedule] = useState<Schedule>({
        email: session.data?.user?.email ?? '',
        consultation_type: '',
        schedule: null
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await axios.post('/api/schedule', schedule)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="w-full justify-center items-center flex min-h-screen">
            <section className="w-96 rounded-lg shadow-xl bg-zinc-400 p-5">
                <header className="mb-5 font-semibold">
                    <h1 className="text-xl">Create Appointment</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <div className="w-full">
                            <label htmlFor="consultation_type" className="text-xs font-semibold">Consultation Type:</label>
                            <select 
                                name="consultation_type" 
                                id="consultation_type"
                                className="w-full p-2 text-sm rounded"
                                value={schedule.consultation_type}
                                onChange={(e)=>setSchedule({...schedule, consultation_type: e.target.value})}
                            >
                                <option value="">Select Type</option>
                                <option value="consultation">Consultation</option>
                                <option value="medical-examination">Medical Examination</option>
                                <option value="dental-consultation">Dental Consultation</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label htmlFor="schedule" className="text-xs font-semibold">Schedule:</label>
                            <input 
                                type="datetime-local" 
                                name="schedule" 
                                id="schedule" 
                                className="w-full p-2 text-sm rounded" 
                                value={schedule.schedule ? schedule.schedule.toISOString().substring(0, 16) : ''}
                                onChange={(e)=>setSchedule({...schedule, schedule: new Date(e.target.value)})}
                            />
                        </div>
                        <button type="submit" className="w-full p-2 text-sm rounded bg-blue-400 hover:bg-blue-600 text-white font-bold">Submit</button>
                    </div>
                </form>
            </section>
        </div>
    )
}