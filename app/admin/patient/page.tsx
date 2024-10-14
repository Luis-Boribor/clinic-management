'use client'

import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

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

export default function Patient() {
    const [patients, setPatients] = useState<PatientState>({
        patients: [],
        loading: true,
    })

    const getPatients = useCallback(async () => {
        await axios.get('/api/patient')
            .then(response => {
                const p = response.data?.patient;
                setPatients({
                    patients: p,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
                toast.error('Error');
            });
    }, []); 
    
    useEffect(() => {
        getPatients();
    }, [getPatients]);

    const confirmDelete = (id: string) => {
        Swal.fire({
            title: 'Delete Patient',
            text: 'Are you sure you want to delete?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'indigo',
            cancelButtonColor: 'red',
        })
        .then(response => {
            if (response.isConfirmed) {
                archivePatient(id)
            }
        })
    }

    const archivePatient = async (id: string) => {
        setPatients({...patients, loading: true})
        await axios.patch(`/api/patient?patient_id=${id}`)
        .then(response => {
            const p = response.data?.patient
            setPatients({
                patients: p,
                loading: false
            })
        })
        .catch(error => {
            console.log(error)
            toast.error(error.response?.data?.message)
        })
    }

    return (
        <div className="w-full flex flex-col md:pt-10 justify-center items-center">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Patients</h1>
                    <div className="flex justify-center items-center gap-2">
                        <Link href={'/admin/patient/create'} className="p-2 rounded bg-green-300 hover:bg-green-400 text-black hover:text-white font-semibold">Create</Link>
                        <Link href={'/admin/patient/archive'} className="p-2 rounded bg-red-300 hover:bg-red-400 text-black hover:text-white font-semibold">Archive</Link>
                    </div>
                </header>
                <div className="relative w-full h-96 overflow-y-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600 sticky top-0">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>ID Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                patients.patients.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">{ item.first_name } { item.middle_name } { item.last_name } { item.extension }</td>
                                            <td className="p-2 border-b border-gray-200">{ item.position }</td>
                                            <td className="p-2 border-b border-gray-200">{ item.department }</td>
                                            <td className="p-2 border-b border-gray-200">{ item.id_number }</td>
                                            <td>
                                                <div className="p-2 border-b border-gray-200 flex flex-wrap justify-center items-center gap-2">
                                                    <Link href={`/admin/patient/view/${item.id_number}`} className="p-2 rounded text-white text-xs font-semibold bg-green-600 hover:bg-green-700">View</Link>
                                                    <Link href={`/admin/patient/edit/${item.id_number}`} className="p-2 rounded text-white text-xs font-semibold bg-blue-600 hover:bg-blue-700">Edit</Link>
                                                    <button onClick={()=>confirmDelete(item._id)} className="p-2 rounded text-white text-xs font-semibold bg-rose-600 hover:bg-rose-700">Archive</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}