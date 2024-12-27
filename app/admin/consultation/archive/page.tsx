'use client'

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
    course?: string | null;
    year?: number | null;
    department: string;
    id_number: string;
    birthdate: Date;
    nationality: string;
    religion: string;
    sex: 'male' | 'female';
    contact: string;
    email: string;
    address: string;
    father_name?: string;
    father_birthdate?: Date;
    father_occupation?: string;
    mother_name?: string;
    mother_birthdate?: Date;
    mother_occupation?: string;
    blood_type?: string;
    height?: string;
    weight?: string;
    person_to_be_notified?: 'father' | 'mother' | '';
    emergency_contact?: string;
    other_person_name?: string;
    other_person_contact?: string;
    relation?: string;
    food_allergy: string[];
    medicine_allergy: string[];
    other_allergy: string[];
}

interface ConsultationState {
    _id: string;
    patient: Patient;
    consultation_type: string;
    address: string;
    father_name?: string;
    father_birthdate?: Date;
    father_occupation?: string;
    mother_name?: string;
    mother_birthdate?: Date;
    mother_occupation?: string;
    height?: string;
    weight?: string;
    person_to_be_notified?: 'father' | 'mother' | '';
    emergency_contact?: string;
    other_person_name?: string;
    other_person_contact?: string;
    relation?: string;
    food_allergy: string[];
    medicine_allergy: string[];
    other_allergy: string[];
    asthma_history?: boolean | null;
    illness_history: string[];
    person_with_disability: string[];
    current_illness?: string[];
    surgical_operation: boolean | null;
    operation_date?: Date;
    operation_type?: string;
    operation_hospital?: string;
    hospitalized: boolean | null;
    hospital_name?: string;
    attending_physician?: string;
    diagnosis?: string;
    createdAt: Date | null;
}

interface MedicalExaminationState {
    patient: Patient;
    civil_status: string;
    purpose: string;
    past_medical_history: string;
    family_history: string;
    occupational_history: string;
    body_mass_index: string;
    skin: string;
    heads: string;
    eyes: string;
    ears: string;
    mouth: string;
    neck: string;
    chest: string;
    abdomen: string;
    rectal: string;
    musculo_skeletal: string;
    extremeties: string;
    other: string;
    blood_pressure: string;
    temperature: string;
    hr: string;
    rr: string;
    height: string;
    weight: string;
    hearing: string;
    vision: string;
    vision_l: string;
    vision_r: string;
    chest_xray: string;
    xray_type: string;
    complete_blood_count: string;
    routine_urinalysis: string;
    fecalysis: string;
    hepatitis_b_screening: string;
    metaphetamine: string;
    tetrahydrocannabinol: string;
    image: string;
    classification: string;
    needs_treatment: string[];
    remarks: string;
    createdAt: Date;
}

interface DentalState {
    patient: Patient;
    teeth?: number[];
    teeth_work?: string[];
    case_history?: string;
    chief_complaint?: string;
    createdAt: Date;
}

interface MedexState {
    _id: string;
    patient: Patient;
    consultation: ConsultationState;
    medical_examination: MedicalExaminationState;
    dental_consultation: DentalState;
    consultation_type: string;
    findings: string;
    createdAt: Date;
    deletedAt: Date;
}

export default function Archive() {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [archive, setArchive] = useState<MedexState[]>([])
    const [archiveArr, setArchiveArr] = useState<MedexState[]>([])

    const handleSearch = (key: string) => {
        const temp = archiveArr.filter(item => 
            item.patient.first_name.toLowerCase().includes(key.toLowerCase()) ||
            item.patient?.middle_name.toLowerCase().includes(key.toLowerCase()) ||
            item.patient.last_name.toLowerCase().includes(key.toLowerCase()) ||
            item.patient.extension?.toLowerCase().includes(key.toLowerCase()) ||
            item.patient.email.toLowerCase().includes(key.toLowerCase()) ||
            item.patient.id_number.toLowerCase().includes(key.toLowerCase()) ||
            item.consultation_type.toLowerCase().includes(key.toLowerCase()) || 
            new Date(item.createdAt).toLocaleString('en-PH').toLowerCase().includes(key.toLowerCase()) ||
            new Date(item.deletedAt).toLocaleString('en-PH').toLowerCase().includes(key.toLowerCase())
        )
        setArchive(temp)
    }

    const getData = useCallback(async () => {
        await axios.get('/api/medical-record/archive')
        .then(response => {
            console.log(response)
            const arc = response.data?.medex
            setArchive(arc)
            setArchiveArr(arc)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setIsMounted(true)
        getData()
    }, [getData])

    if (!isMounted) {
        return null
    }

    const confirmRestore = (id: string, index: number) => {
        Swal.fire({
            title: 'Restore Confirmation',
            text: 'Are you sure you want to restore?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                restoreRecord(id, index)
            }
        })
    }

    const restoreRecord = (id: string, index: number) => {
        toast.promise(
            axios.patch(`/api/medical-record/archive?record_id=${id}`),
            {
                pending: 'Restoring...',
                success: {
                    render() {
                        const temp = [...archiveArr]
                        temp.splice(index, 1)
                        setArchive(temp)
                        setArchiveArr(temp)
                        return 'Restored'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError<{message: string}> }) {
                        Swal.fire({
                            title: 'Restore Error',
                            text: data.response?.data?.message
                        })
                        return 'Error'
                    }
                }
            }
        )
    }

    const confirmDelete = (id: string, index: number) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: 'Are you sure you want to permanently delete?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                deleteRecord(id, index)
            }
        })
    }

    const deleteRecord = async (id: string, index: number) => {
        toast.promise(
            axios.delete(`/api/medical-record/archive?record_id=${id}`),
            {
                pending: 'Deleting...',
                success: {
                    render() {
                        const temp = [...archiveArr]
                        temp.splice(index, 1)
                        setArchive(temp)
                        setArchiveArr(temp)
                        return 'Deleted'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError<{message: string}> }) {
                        console.log(data)
                        Swal.fire({
                            title: 'Delete Error',
                            text: data?.response?.data?.message,
                            icon: 'error'
                        })
                        return 'Error'
                    }
                }
            }
        )
    }
    
    return(
        <div className="w-full flex justify-center items-center">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <div className="flex justify-center items-center gap-2">
                        <Link href={'/admin/consultation'} className="p-2 rounded text-white text-sm font-semibold bg-blue-400 hover:bg-blue-600">back</Link>
                        <h1 className="text-2xl">Consultations Archive</h1>
                    </div>
                    <input type="text" onChange={e=>handleSearch(e.target.value)} className="p-2 text-sm w-1/3 rounded" placeholder="Search" />
                </header>
                <div className="relative w-full h-96 overflow-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600 sticky top-0">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Date Archived</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                archive?.map((arc, index) => {
                                    return(
                                        <tr key={index}>
                                            <td className="py-2 border-b border-gray-200">
                                            {arc.patient.first_name} {arc.patient.middle_name} {arc.patient.last_name} {arc.patient.extension}
                                            </td>
                                            <td className="py-2 border-b border-gray-200">{arc.patient.position}</td>
                                            <td className="py-2 border-b border-gray-200">{arc.consultation_type}</td>
                                            <td className="py-2 border-b border-gray-200">{new Date(arc.createdAt).toLocaleDateString('en-PH')}</td>
                                            <td className="py-2 border-b border-gray-200">{new Date(arc.deletedAt).toLocaleDateString('en-PH')}</td>
                                            <td className="py-2 border-b border-gray-200">
                                                <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                    <button onClick={()=>confirmRestore(arc._id, index)} className="p-2 rounded text-xs text-white font-bold bg-teal-400 hover:bg-teal-600">Restore</button>
                                                    <button onClick={()=>confirmDelete(arc._id, index)} className="p-2 rounded text-xs text-white font-bold bg-rose-400 hover:bg-rose-600">Delete</button>
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