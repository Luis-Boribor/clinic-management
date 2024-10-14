'use client'

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

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

    return (
        <div className="w-full flex justify-center items-center py-10">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Dental Consultation</h1>
                </header>
                <form>
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
                        <div className=""></div>
                    </div>
                </form>
            </section>
        </div>
    )
}