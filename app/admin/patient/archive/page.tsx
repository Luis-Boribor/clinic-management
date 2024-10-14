'use client';

import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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
    deletedAt: Date;
}

interface PatientState {
    patients: Patient[];
    loading: boolean;
}

export default function Archive() {
    const [patients, setPatients] = useState<PatientState>({
        patients: [],
        loading: true
    })

    const getPatients = useCallback(async () => {
        await axios.get('/api/patient/archive')
            .then(response => {
                console.log(response)
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
        getPatients()
    }, [getPatients])

    const confirmRestore = (id: string) => {
        Swal.fire({
            title: 'Restore Patient',
            text: 'Are you sure you want to restore?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'indigo',
            cancelButtonColor: 'red',
        })
        .then(response => {
            if (response.isConfirmed) {
                restorePatient(id)
            }
        })
    }

    const restorePatient = async (id: string) => {
        setPatients({...patients, loading: true})
        await axios.patch(`/api/patient/archive?patient_id=${id}`)
        .then(response => {
            const p = response.data?.patient
            setPatients({
                patients: p,
                loading: false
            })
        })
        .catch(error => {
            console.log(error)
            setPatients({
                ...patients,
                loading: false
            })
        })
    }

    const confirmDelete = (id: string) => {
        Swal.fire({
            title: 'Delete Patient',
            text: 'Are you sure you want to permanently delete?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: 'indigo',
            cancelButtonColor: 'red'
        })
        .then(response => {
            if (response.isConfirmed) {
                deletePatient(id)
            }
        })
    }

    const deletePatient = async (id: string) => {
        setPatients({...patients, loading: true})
        axios.delete(`/api/patient/archive?patient_id=${id}`)
        .then(response => {
            const p = response.data?.patient
            setPatients({
                patients: p,
                loading: false
            })
        })
        .catch(error => {
            console.log(error)
            setPatients({
                ...patients,
                loading: false
            })
        })
    }

    return (
        <div className="w-full flex justify-center items-center">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-start items-center gap-2">
                    <Link href={'/admin/patient'} className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white font-semibold">back</Link>
                    <h1 className="text-2xl">Patient Archive</h1>
                </header>
                <div className="relative w-full h-96">
                    <table className="w-full table-auto md:table-fixed text-center border-collapse">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Date Deleted</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                patients.patients.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-200">
                                                <p>{ item.first_name } { item.middle_name } { item.last_name } { item.extension }</p>
                                            </td>
                                            <td className="p-2 border-b border-gray-200">{ item.position }</td>
                                            <td className="p-2 border-b border-gray-200">{ item.department }</td>
                                            <td className="p-2 border-b border-gray-200">{ new Date(item.deletedAt).toLocaleDateString('en-US') }</td>
                                            <td className="p-2 border-b border-gray-200">
                                                <div className="flex flex-wrap justify-center items-center gap-2">
                                                    <button onClick={()=>confirmRestore(item._id)} className="p-2 rounded text-white text-xs font-semibold bg-green-600 hover:bg-green-700">Restore</button>
                                                    <button onClick={()=>confirmDelete(item._id)} className="p-2 rounded text-white text-xs font-semibold bg-red-600 hover:bg-red-700">Delete</button>
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