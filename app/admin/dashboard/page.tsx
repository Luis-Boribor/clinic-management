'use client'

import Clock from "@/app/components/Clock"
import Calendar from "@/app/components/Calendar"
import { FaPaperPlane } from "react-icons/fa";
import { 
    Chart as ChartJS,  
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    // ChartData
} from "chart.js";
// import { Bar } from "react-chartjs-2";
import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface Patient {
    _id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    extension?: string;
    position: 'student' | 'teacher' | 'non-teaching-staff' | '';
    department: string;
    id_number: string;
    birthdate: Date | null;
    nationality: string;
    religion: string;
    sex: 'male' | 'female';
    contact: string;
    email: string;
    address: string;
    father_name?: string;
    father_birthdate?: Date | null;
    father_occupation?: string;
    mother_name?: string;
    mother_birthdate?: Date | null;
    mother_occupation?: string;
    blood_type?: string;
    height?: string;
    weight?: string;
    person_to_be_notified?: 'father' | 'mother' | null;
    emergency_contact?: string;
    other_person_name?: string;
    other_person_contact?: string;
    relation?: string;
    food_allergy: string[];
    medicine_allergy: string[];
    other_allergy: string[];
}

interface PatientState {
    patients: Patient[];
    loading: boolean;
}

interface Appointment {
    consultation_type: string;
    schedule: Date;
}

interface AppointmentState {
    appointments: Appointment[];
    loading: boolean;
}

interface Post {
    content: string;
    createdAt: Date;
}

export default function Dashboard() {
    const [patients, setPatients] = useState<PatientState>({
        patients: [],
        loading: true
    })
    const [appointments, setAppointments] = useState<AppointmentState>({
        appointments: [],
        loading: true
    })
    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const [postContent, setPostContent] = useState<string>('')
    const [posts, setPosts] = useState<Post[]>([])

    // const options = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top' as const,
    //         },
    //         title: {
    //             display: true,
    //             text: 'Clinic Consultations',
    //         },
    //     },
    // }

    // const dataArr = [0, 1, 10, 2, 13, 15, 3, 1, 0, 0, 0, 0]

    // const data: ChartData<"bar", number[], string> = {
    //     labels,
    //     datasets: [
    //     {
    //         label: "Number of consultations",
    //         data: dataArr, 
    //         backgroundColor: "rgba(69, 10, 10, 0.8)", 
    //     },
    //     ],
    // }

    

    const dateFormat: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short', // Abbreviated month format
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12-hour format
      }

    // const getAppointments = useCallback(async () => {
    //     await axios.get('/api/schedule')
    //     .then(response => {
    //         const app = response.data.schedule
    //         setAppointments({
    //             appointments: app,
    //             loading: false
    //         })
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         setAppointments({
    //             ...appointments,
    //             loading: false
    //         })
    //     })
    // }, [])

    // const getPatients = useCallback(async () => {
    //     await axios.get('/api/patient')
    //         .then(response => {
    //             const p = response.data?.patient;
    //             setPatients({
    //                 patients: p,
    //                 loading: false
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }, []); 

    const getData = useCallback(async () => {
        await axios.get('/api/dashboard')
        .then(response => {
            const p = response.data?.patient
            const app = response.data?.appointment
            const posts = response.data?.posts
            setPatients({
                patients: p,
                loading: false
            })
            setAppointments({
                appointments: app,
                loading: false
            })
            setPosts(posts)
        })
    }, [])
    
    useEffect(() => {
        // getPatients();
        // getAppointments();
        getData();
    }, [getData]);

    const postAnnouncement = async (event: FormEvent) => {
        event.preventDefault()
        await axios.post('/api/posts', { content: postContent })
        .then(response => {
            console.log(response)
            const posts = response.data?.posts
            setPosts(posts)
        })
        .catch(error => {
            console.log(error)
        })
        .finally(()=>{
            setPostContent('')
        })
    }

    return (
        <div className="w-full p-5 md:px-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <section className="w-96 rounded-lg shadow-xl bg-zinc-400 p-5">
                    <header className="mb-1 font-semibold">
                        <h1 className="">Patients</h1>
                    </header>
                    <div className="grid grid-cols-3 bg-zinc-600 text-white p-1">
                        <span className="font-semibold text-xs">Name</span>
                        <span className="font-semibold text-xs">Position</span>
                        <span className="font-semibold text-xs">Department</span>
                    </div>
                    <div className="h-36 overflow-y-auto divide-y-2">
                    {
                        patients.patients.map((patient,index)=>{
                            return(
                                <div className="grid grid-cols-3 text-xs p-1 hover:bg-zinc-600 hover:text-white" key={index}>
                                    <span>{patient.first_name} {patient.middle_name} {patient.last_name} {patient.extension}</span>
                                    <span>{patient.position}</span>
                                    <span>{patient.department}</span>
                                </div>
                            )
                        })
                    }
                    </div>
                </section>
                <section className="w-96 rounded-lg shadow-xl bg-[#ccc] p-5 flex justify-center items-center gap-4 h-60">
                    <Clock datediff={8} />
                    <Calendar appointments={appointments.appointments} />
                </section>
            </div>
            {/* <section className="w-full bg-zinc-200 p-5">
                <Bar options={options} data={data} />
            </section> */}
            <section className="w-full bg-zinc-200 p-5 mb-10">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Jan</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Apr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Aug</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dec</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className="p-2">Headache</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Cough</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Cold</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Flu</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Allergies</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Stomach ache</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">UTI</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Toothache</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Injury</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Infected wounds</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Tuberculosis</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                        <tr>
                            <th className="p-2">Menstrual cramps</th>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                            <td className="border border-white p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <div className="w-full md:px-20 flex flex-col justify-center items-center gap-10">
                <section className="w-full md:w-2/3">
                    <header className="mb-1">
                        <h1 className="text-lg text-gray-600 font-semibold">Post announcement?</h1>
                    </header>
                    <form onSubmit={postAnnouncement}>
                        <div className="flex justify-center items-center gap-2">
                            <input 
                                type="text" 
                                name="post" 
                                id="post" 
                                className="p-2 text-lg w-full rounded border border-black" 
                                onChange={(e)=>setPostContent(e.target.value)}
                                value={postContent}
                            />
                            <button className="p-3 w-1/6 flex justify-center items-center text-lg text-white font-semibold rounded bg-blue-400 hover:bg-blue-600">
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </section>
                {
                    posts.map((post,index) => {
                        return(
                            <article className="w-full md:w-2/3 bg-zinc-400 p-5 rounded-lg" key={index}>
                                <header className="mb-4">
                                    <h1 className="text-sm font-semibold">{new Date(post.createdAt).toLocaleString('en-PH', dateFormat)}</h1>
                                </header>
                                <p className="">{post.content}</p>
                            </article>
                        )
                    })
                }
            </div>
        </div>
    )
}