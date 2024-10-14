'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"

interface PatientLog {
    consultation_type: string;
    complaint: string;
    findings: string;
    createdAt: Date;
}

interface Post {
    content: string;
    createdAt: Date;
}

interface Schedule {
    schedule?: Date | null;
}

export default function Dashboard() {
    const session = useSession()
    const [clickViewMedex, setClickViewMedex] = useState<boolean>(true)
    // const [medicalRecord, setMedicalRecord] = useState<PatientLog[]>([])
    const [records, setRecords] = useState<PatientLog[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [schedule, setSchedule] = useState<Schedule>({
        schedule: null,
    })

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short', // Abbreviated month format
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12-hour format
      }

    const getData = useCallback(async () => {
        await axios.get(`/api/dashboard?email=${session.data?.user?.email}`)
        .then(response => {
            console.log(response)
            const p = response.data?.posts
            const r = response.data?.logs
            const s = response.data?.appointment
            setRecords(r)
            setPosts(p)
            setSchedule(s)
        })
        .catch(error => {
            console.log(error)        
        })
    }, [])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <div className="w-full min-h-screen pt-20">
            <section className="w-full flex flex-col md:flex-row justify-center items-center gap-2 p-5 pb-0 bg-white md:px-20">
                <div className="relative w-full md:w-1/2" onClick={()=>setClickViewMedex(!clickViewMedex)}>
                    <div className="w-full rounded-lg shadow-xl p-5 bg-zinc-400 hover:ring-2 ring-zinc-600 cursor-pointer">
                        <header>
                            <h1 className="text-xl font-semibold">Medical Record</h1>
                            <p className="text-sm">View your own medical records.</p>
                        </header>
                        <p className="text-center">click to view</p>
                    </div>
                    <div className={`absolute w-full rounded-lg shadow-xl p-5 bg-zinc-400 top-0 ${clickViewMedex && 'hidden'} ring-2 ring-black`}>
                        <header className="text-sm font-semibold">
                            <h1>Medical Records</h1>
                        </header>
                        <div className="w-full divide-y text-xs h-60 overflow-y-auto">
                            <div className="grid grid-cols-3 font-semibold bg-zinc-600 p-2 text-gray-200 sticky top-0">
                                <p>Type</p>
                                <p>Date</p>
                            </div>
                            {
                                records.map((record, index) => {
                                    return(
                                        <div className="grid grid-cols-3 p-2" key={index}>
                                            <div>{record.consultation_type}</div>
                                            <div>{new Date(record.createdAt).toLocaleDateString('en-PH')}</div>
                                            <div>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 rounded-lg shadow-xl p-5 bg-red-900 text-gray-200">
                    <header className="mb-5">
                        <h1 className="text-xl font-semibold">Scheduled Appointment</h1>
                    </header>
                    {
                        schedule?.schedule ? (
                            <p className="">{new Date(schedule.schedule).toLocaleString('en-PH', options)} {schedule.schedule.toString()}</p>
                        ) : (
                            <p>No Scheduled Appointment</p>
                        )
                    }
                </div>
            </section>
            <div className=" flex flex-col justify-center items-center gap-10 mt-10 p-2 pb-10">
                <header className="mb-1">
                    <h1 className="text-xl font-semibold">Announcements</h1>
                </header>
            {
                posts.map((post, index) => {
                    return (
                        <article key={index} className="w-full md:w-3/5 rounded-lg shadow-xl p-5 bg-zinc-400">
                            <p>{post.content}</p>
                            <p className="text-xs font-semibold">{new Date(post.createdAt).toLocaleDateString('en-US')} {new Date(post.createdAt).toLocaleTimeString('en-US')}</p>
                        </article>
                    )
                })
            }
            </div>
            
        </div>
    )
}