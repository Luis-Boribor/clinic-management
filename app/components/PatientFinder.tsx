'use client'

import axios from "axios";
import { FC, FormEvent, useState } from "react"
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface PatientFinderProps {
    isHidden: boolean;
    goTo: string;
    toggle: () => void;
}

const PatientFinder: FC<PatientFinderProps> = ({ isHidden, goTo, toggle }) => {
    const [idNumber, setIdNumber] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await axios.get(`/api/patient?id_number=${idNumber}`)
        .then(response => {
            toast.success('Patient found')
            const p = response.data?.patient
            router.push(goTo + '/' + p?.id_number)
        })
        .catch(error => {
            console.log(error)
            toast.error(error.response?.data?.message)
        })
    }

    return (
        <div className={`fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-10 ${isHidden && 'hidden'}`}>
            <ToastContainer />
            <section className="w-96 rounded-lg p-5 bg-zinc-400">
                <header className="mb-5">
                    <h1 className="font-semibold">Patient Finder</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <input 
                            type="text" 
                            name="id_number" 
                            id="id_number" 
                            className="w-full p-2 rounded text-sm" 
                            placeholder="ID Number"
                            value={idNumber}
                            onChange={(e)=>setIdNumber(e.target.value)}
                            required
                        />
                        <button type="submit" className="w-full p-2 rounded text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700">Find</button>
                        <button onClick={()=>toggle()} type="button" className="w-full p-2 rounded text-sm text-white font-semibold bg-rose-600 hover:bg-rose-700">Cancel</button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default PatientFinder