'use client'

import PatientFinder from "@/app/components/PatientFinder";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import Exports from "@/app/utils/Exports";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
}

export default function Consultation() {
    const [isHidden, setIsHidden] = useState<boolean>(true)
    const [consultations, setConsultations] = useState<MedexState[]>([])
    const [medexArr, setMedexArr] = useState<MedexState[]>([])
    const { exportConsultation, exportMedicalExamination, exportDentalConsultation } = Exports()
    const [isMounted, setIsMounted] = useState<boolean>(false)

    const togglePatientFinder = () => {
        setIsHidden(!isHidden)
    }

    const getConsultations = useCallback(async () => {
        await axios.get('/api/medical-record')
        .then(response => {
            console.log(response)
            const con = response.data?.medex
            setConsultations(con)
            setMedexArr(con)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setIsMounted(true)
        getConsultations()
    }, [getConsultations])

    const confirmArchive = (id: string, index: number) => {
        Swal.fire({
            title: 'Archive Record',
            text: 'Are you sure you want to move record to archive?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                archiveRecord(id, index)
            }
        })
    }

    const archiveRecord = async (id: string, index: number) => {
        toast.promise(
            axios.patch(`/api/medical-record?record_id=${id}`),
            {
                pending: 'Moving record...',
                success: {
                    render() {
                        const temp = [...consultations]
                        temp.splice(index, 1)
                        setConsultations(temp)
                        return 'Record archived'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError<{message: string}> }) {
                        console.log(data)
                        Swal.fire({
                            title: 'Archive Error',
                            text: data.response?.data?.message
                        })
                        return 'Error'
                    }
                }
            }
        )
    }

    const handleSearch = (key: string) => {
        const temp = medexArr.filter(medx => 
            medx.patient.first_name.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.middle_name.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.last_name.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.extension?.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.position.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.email.toLowerCase().includes(key.toLowerCase()) ||
            medx.patient.address.toLowerCase().includes(key.toLowerCase()) ||
            medx.consultation_type.toLowerCase().includes(key.toLowerCase())
        )
        setConsultations(temp)
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="w-full flex justify-center items-center">
            <ToastContainer position="bottom-right" />
            <PatientFinder isHidden={isHidden} goTo={'consultation'} toggle={togglePatientFinder} />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Consultations</h1>
                    <input type="text" onChange={e=>handleSearch(e.target.value)} className="p-2 text-sm w-1/3 rounded" placeholder="Search" />
                    <div className="flex flex-wrap gap-2">
                        <Link href={'/admin/consultation/archive'} className="p-2 rounded text-white text-center font-semibold bg-cyan-400 hover:bg-cyan-600">Archive</Link>
                    </div>
                </header>
                <div className="relative w-full h-96 overflow-auto">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600 sticky top-0">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                consultations.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="py-2 border-b border-gray-200">
                                                {item?.patient?.first_name} {item?.patient?.middle_name} {item?.patient?.last_name} {item?.patient?.extension}

                                            </td>
                                            <td className="py-2 border-b border-gray-200">{item?.patient?.position}</td>
                                            <td className="py-2 border-b border-gray-200">{item?.consultation_type}</td>
                                            <td className="py-2 border-b border-gray-200">{new Date(item?.createdAt).toLocaleDateString('en-PH')}</td>
                                            <td className="py-2 border-b border-gray-200">
                                                <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                    {
                                                        item.consultation_type=='consultation' && 
                                                        <button onClick={()=>exportConsultation(item?.consultation, item?.patient)} className="p-2 text-sm text-white font-bold bg-blue-400 hover:bg-blue-600 rounded">export</button>
                                                    }
                                                    
                                                    {
                                                        item.consultation_type=='medical-examination' && 
                                                        <button onClick={()=>exportMedicalExamination(item?.medical_examination, item?.patient)} className="p-2 text-sm text-white font-bold bg-blue-400 hover:bg-blue-600 rounded">export</button>
                                                    }
                                                    {
                                                        item.consultation_type=='dental-consultation' && 
                                                        <button onClick={()=>exportDentalConsultation(item?.dental_consultation, item?.patient)} className="p-2 text-sm text-white font-bold bg-blue-400 hover:bg-blue-600 rounded">export</button>
                                                    }
                                                    {/* <button onClick={()=>consultationExport(item?.consultation?._id)} className="p-2 text-sm text-white font-bold bg-blue-400 hover:bg-blue-600 rounded">export</button> */}
                                                    <button onClick={()=>confirmArchive(item._id, index)} className="p-2 text-sm text-white font-bold bg-rose-400 hover:bg-rose-600 rounded">archive</button>
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