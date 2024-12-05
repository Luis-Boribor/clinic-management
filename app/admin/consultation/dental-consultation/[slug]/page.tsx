'use client'

import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

interface Patient {
    _id: string
    first_name: string;
    middle_name: string;
    last_name: string;
    extension?: string;
    position: 'student' | 'teacher' | 'non-teaching-staff';
    department: string;
    birthdate: Date;
    sex: 'male' | 'female';
    contact: string;
    address: string;
}

interface DentalConsultation {
    age: string;
    patient: string;
    chief_complaint: string;
    examined_by: string;
    teeth: number[];
    teeth_work: string[];
}

export default function DentalConsultation({ params }: { params: { slug: string } }) {
    const [patient, setPatient] = useState<Patient>({
        _id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        position: 'student',
        department: '',
        birthdate: new Date(),
        sex: 'male',
        contact: '',
        address: '',
    })
    const [dentalConsultation, setDentalConsultation] = useState<DentalConsultation>({
        age: '',
        patient: '',
        chief_complaint: '',
        examined_by: '',
        teeth: [0],
        teeth_work: ['']
    })

    const calculateAge = (birthdate: Date) => {
        const today = new Date()
        const bday = new Date(birthdate)
        let age = today.getFullYear() - bday.getFullYear()
        const monthDiff = today.getMonth() - bday.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
            age--
        }
        return age
    }

    const getPatient = useCallback(async () => {
        await axios.get(`/api/patient?id_number=${params.slug}`)
        .then(response => {
            const p = response.data?.patient
            const age = calculateAge(p?.birthdate)
            setPatient(p)
            setDentalConsultation({
                ...dentalConsultation,
                patient: p?._id,
                age: age.toString(),
            })
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getPatient()
    }, [getPatient])

    const addTooth = () => {
        const tooth = [...dentalConsultation.teeth]
        const twork = [...dentalConsultation.teeth_work]
        tooth.push(0)
        twork.push('')
        setDentalConsultation({
            ...dentalConsultation,
            teeth: tooth,
            teeth_work: twork,
        })
    }

    const decTooth = (index: number) => {
        const tooth = [...dentalConsultation.teeth]
        const twork = [...dentalConsultation.teeth_work]
        tooth.splice(index, 1)
        twork.splice(index, 1)
        setDentalConsultation({
            ...dentalConsultation,
            teeth: tooth,
            teeth_work: twork,
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        toast.promise(
            axios.post('/api/dental-consultation', dentalConsultation),
            {
                pending: 'Submitting form...',
                success: {},
                error: {
                    render({ data }: { data: AxiosError<{message: ''}> }) {
                        Swal.fire({
                            title: 'Error',
                            text: data.response?.data?.message
                        })
                        return 'Error'
                    }
                }
            }
        )
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setDentalConsultation({
            ...dentalConsultation,
            [name]: value
        })
    }

    return (
        <div className="w-full flex justify-center items-center py-10">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Dental Consultation</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <div className="w-full">
                            <p className="font-semibold">Patient Information</p>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="first_name" className="text-xs font-semibold">First name:</label>
                                    <input 
                                        type="text" 
                                        name="first_name" 
                                        id="first_name" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={patient.first_name}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="middle_name" className="text-xs font-semibold">Middle name:</label>
                                    <input 
                                        type="text" 
                                        name="middle_name" 
                                        id="middle_name" 
                                        className="w-full p-2 rounded text-sm"  
                                        value={patient.middle_name}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="last_name" className="text-xs font-semibold">Last name:</label>
                                    <input 
                                        type="text" 
                                        name="last_name" 
                                        id="last_name" 
                                        className="w-full p-2 rounded text-sm"  
                                        value={patient.last_name}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="extension" className="text-xs font-semibold">Extension:</label>
                                    <input 
                                        type="text" 
                                        name="extension" 
                                        id="extension" 
                                        className="w-full p-2 rounded text-sm"  
                                        value={patient.extension}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
                                <div className="w-full">
                                    <label htmlFor="age" className="text-xs font-semibold">Age:</label>
                                    <input 
                                        type="text" 
                                        name="age" 
                                        id="age" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={dentalConsultation.age}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="sex" className="text-xs font-semibold">Sex:</label>
                                    <input 
                                        type="text" 
                                        name="sex" 
                                        id="sex" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={patient.sex}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="contact" className="text-xs font-semibold">Contact Number:</label>
                                    <input 
                                        type="text" 
                                        name="contact" 
                                        id="contact" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={patient.contact}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="w-full mt-2">
                                <label htmlFor="address" className="text-xs font-semibold">Address:</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    id="address" 
                                    className="w-full p-2 text-sm rounded" 
                                    value={patient.address}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="flex items-center my-5">
                            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                            <div className="flex-grow-0 mx-5 text-sm font-semibold dark:text-white">modifiable</div>
                            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                        </div>
                        <div className="dental-img w-full h-[600px]">
                        </div>
                        <div className="w-full text-white text-sm mt-2">
                            <p>Legend:</p>
                            <p className="flex justify-between">
                                <span>C - Dental Caries</span>
                                <span>Co - Composite Filling</span>
                                <span>Rf - Roof Fragment</span>
                                <span>Un - Un-erupted</span>
                            </p>
                            <p className="flex justify-between">
                                <span>X - Tooth for Extraction</span>
                                <span>P - Pontic</span>
                            </p>
                        </div>
                        <div className="w-full mt-2 space-y-2">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-full">
                                    <span className="text-xs font-semibold">No.:</span>
                                </div>
                                <div className="w-full">
                                    <span className="text-xs font-semibold">Legend:</span>
                                </div>
                            </div>
                            {
                                dentalConsultation.teeth.map((teet, index) => {
                                    return(
                                        <div className="w-full flex justify-center items-center gap-2" key={index}>
                                            <input 
                                                type="number"
                                                className="w-full p-2 text-sm rounded" 
                                                value={teet}
                                                onChange={e=>{
                                                    const temp = [...dentalConsultation.teeth]
                                                    temp[index] = Number(e.target.value)
                                                    setDentalConsultation({
                                                        ...dentalConsultation,
                                                        teeth: temp
                                                    })
                                                }}
                                                required
                                            />
                                            <input 
                                                type="text"
                                                className="w-full p-2 text-sm rounded" 
                                                value={dentalConsultation.teeth_work[index]}
                                                onChange={e=>{
                                                    const temp = [...dentalConsultation.teeth_work]
                                                    temp[index] = e.target.value
                                                    setDentalConsultation({
                                                        ...dentalConsultation,
                                                        teeth_work: temp
                                                    })
                                                }}
                                                required
                                            />
                                            {
                                                index === 0 ? (
                                                    <button 
                                                        onClick={addTooth}
                                                        type="button" 
                                                        className="p-2 rounded text-white bg-teal-400 hover:bg-teal-600"
                                                    >
                                                        <IoMdAdd />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={()=>decTooth(index)}
                                                        type="button" 
                                                        className="p-2 rounded text-white bg-rose-400 hover:bg-rose-600"
                                                    >
                                                        <MdDeleteOutline />
                                                    </button>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="w-full mt-2">
                            <label htmlFor="case_history" className="font-bold">Case History:</label>
                            <textarea onChange={handleOnChange} name="case_history" id="case_history" className="p-2 w-full rounded resize-none text-sm"></textarea>
                        </div>
                        <div className="w-full mt-2">
                            <label htmlFor="chief_complaint" className="font-bold">Chief Complaint:</label>
                            <textarea onChange={handleOnChange} name="chief_complaint" id="chief_complaint" className="p-2 w-full rounded resize-none text-sm"></textarea>
                        </div>
                        <button type="submit" className="mt-2 p-2 rounded text-white text-sm font-semibold bg-blue-600 hover:bg-blue-900">submit</button>
                    </div>
                </form>
            </section>
        </div>
    )
}