'use client'

import axios, { AxiosError, AxiosResponse } from "axios";
import { FC, FormEvent, useState } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
        toast.promise(
            axios.get(`/api/patient?id_number=${idNumber}`),
            {
                pending: 'Finding patient...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const p = data.data?.patient
                        router.push(goTo + '/' + p?.id_number)
                        toggle()
                        return 'Patient found'
                    }
                },
                error: {
                    render({ data }: {data: AxiosError}) {
                        console.log(data)
                        Swal.fire({
                            title: 'Error',
                            text: data?.message,
                            icon: 'error'
                        })
                        return 'Error'
                    }
                }
            }
        )
    }

    return (
        <div className={`fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-10 ${isHidden && 'hidden'}`}>
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