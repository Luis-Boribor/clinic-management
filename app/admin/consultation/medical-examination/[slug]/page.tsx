'use client'

import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { useRouter } from "next/navigation";

interface Option {
    value: string;
    label: string;
}

interface Patient {
    _id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    extension: string;
    birthdate: Date;
    nationality: string;
    religion: string;
}

interface MedicalExamination {
    patient: string;
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
}

const correctionOptions = [
    { value: 'skin disease', label: 'Skin Disease' },
    { value: 'dental defects', label: 'Dental Defects' },
    { value: 'anemia', label: 'Anemia' },
    { value: 'poor vision', label: 'Poor Vision' },
    { value: 'urinary track infection', label: 'Urinary Track Infection' },
    { value: 'intestinal parasitism', label: 'Intestinal Parasitism' },
    { value: 'mild hypertension', label: 'Mild Hypertension' },
    { value: 'diabetes', label: 'Diabetes' },
]

export default function MedicalExamination({ params }: { params: { slug: string } }) {
    const [medicalExam, setMedicalExam] = useState<MedicalExamination>({
        patient: '',
        civil_status: '',
        purpose: '',
        past_medical_history: '',
        family_history: '',
        occupational_history: '',
        body_mass_index: '',
        skin: '',
        heads: '',
        eyes: '',
        ears: '',
        mouth: '',
        neck: '',
        chest: '',
        abdomen: '',
        rectal: '',
        musculo_skeletal: '',
        extremeties: '',
        other: '',
        blood_pressure: '',
        temperature: '',
        hr: '',
        rr: '',
        height: '',
        weight: '',
        hearing: '',
        vision: '',
        vision_l: '',
        vision_r: '',
        chest_xray: '',
        xray_type: '',
        complete_blood_count: '',
        routine_urinalysis: '',
        fecalysis: '',
        hepatitis_b_screening: '',
        metaphetamine: '',
        tetrahydrocannabinol: '',
        image: '',
        classification: '',
        needs_treatment: [''],
        remarks: '',
    })
    const [patient, setPatient] = useState<Patient>({
        _id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        birthdate: new Date(),
        nationality: '',
        religion: '',
    })
    const [correction, setCorrection] = useState<Option[]>([])
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const router = useRouter()

    const getPatient = useCallback(async () => {
        await axios.get(`/api/patient?id_number=${params.slug}`)
        .then(response => {
            const p = response.data?.patient
            setPatient(p)
            setMedicalExam({
                ...medicalExam,
                patient: p?._id
            })
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setIsMounted(true)
        getPatient()
    }, [getPatient])

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setMedicalExam({
            ...medicalExam,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const updatedMedicalExamination: MedicalExamination = {
            ...medicalExam,
            needs_treatment: correction.map((item)=>item.value)
        }
        await axios.post('/api/medical-examination', updatedMedicalExamination)
        .then(() => {
            router.push('/admin/consultation')
        })
        .catch(error => {
            console.log(error)
        })
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="w-full flex justify-center items-center py-10">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Medical Examination</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full">
                        <div className="w-full space-y-2">
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
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="birthdate" className="text-xs font-semibold">Birthdate:</label>
                                    <input 
                                        type="date" 
                                        name="birthdate" 
                                        id="birthdate" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={patient.birthdate ? new Date(patient.birthdate).toISOString().substring(0, 10) : ''}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="nationality" className="text-xs font-semibold">Nationality:</label>
                                    <input 
                                        type="text" 
                                        name="nationality" 
                                        id="nationality" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Nationality"
                                        value={patient.nationality}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="religion" className="text-xs font-semibold">Religion:</label>
                                    <input 
                                        type="text" 
                                        name="religion" 
                                        id="religion" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Religion"
                                        value={patient.religion}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                            <div className="flex-grow-0 mx-5 text-sm font-semibold dark:text-white">modifiable</div>
                            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                            <div className="w-full">
                                <label htmlFor="civil_status" className="text-xs font-semibold">Civil Status:</label>
                                <input 
                                    type="text" 
                                    name="civil_status" 
                                    id="civil_status" 
                                    className="w-full p-2 rounded text-sm" 
                                    value={medicalExam.civil_status}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="purpose" className="text-xs font-semibold">Purpose:</label>
                                <input 
                                    type="text" 
                                    name="purpose" 
                                    id="purpose" 
                                    className="w-full p-2 rounded text-sm" 
                                    value={medicalExam.purpose}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                            <div className="w-full">
                                <label htmlFor="past_medical_history" className="text-xs font-semibold">Past Medical History:</label>
                                <textarea 
                                    name="past_medical_history"
                                    id="past_medical_history"
                                    rows={2}
                                    className="w-full p-2 rounded text-sm resize-none"
                                    placeholder="Type here..."
                                    value={medicalExam.past_medical_history}
                                    onChange={(e)=>setMedicalExam({
                                        ...medicalExam,
                                        past_medical_history: e.target.value
                                    })}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="family_history" className="text-xs font-semibold">Past Medical History:</label>
                                <textarea 
                                    name="family_history"
                                    id="family_history"
                                    rows={2}
                                    className="w-full p-2 rounded text-sm resize-none"
                                    value={medicalExam.family_history}
                                    placeholder="Type here..."
                                    onChange={(e)=>setMedicalExam({
                                        ...medicalExam,
                                        family_history: e.target.value
                                    })}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="occupational_history" className="text-xs font-semibold">Past Medical History:</label>
                                <textarea 
                                    name="occupational_history"
                                    id="occupational_history"
                                    rows={2}
                                    className="w-full p-2 rounded text-sm resize-none"
                                    placeholder="Type here..."
                                    value={medicalExam.occupational_history}
                                    onChange={(e)=>setMedicalExam({
                                        ...medicalExam,
                                        occupational_history: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                        <div className="w-full mt-2">
                            <div className="w-full grid md:grid-cols-2 font-semibold text-center">
                                <p>PHYSICAL EXAMINATION</p>
                                <p className="hidden md:block">FINDINGS</p>
                            </div>
                            <div className="w-full text-center space-y-2">
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">General Appearance/Body Mass Index</p>
                                    <input 
                                        type="text" 
                                        name="body_mass_index" 
                                        id="body_mass_index" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.body_mass_index}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Skin</p>
                                    <input 
                                        type="text" 
                                        name="skin" 
                                        id="skin" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.skin}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Head</p>
                                    <input 
                                        type="text" 
                                        name="heads" 
                                        id="heads" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.heads}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Eyes</p>
                                    <input 
                                        type="text" 
                                        name="eyes" 
                                        id="eyes" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.eyes}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Ears</p>
                                    <input 
                                        type="text" 
                                        name="ears" 
                                        id="ears" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.ears}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Mouth</p>
                                    <input 
                                        type="text" 
                                        name="mouth" 
                                        id="mouth" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.mouth}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Neck</p>
                                    <input 
                                        type="text" 
                                        name="neck" 
                                        id="neck" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.neck}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Chest</p>
                                    <input 
                                        type="text" 
                                        name="chest" 
                                        id="chest" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.chest}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Abdomen</p>
                                    <input 
                                        type="text" 
                                        name="abdomen" 
                                        id="abdomen" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.abdomen}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Rectal</p>
                                    <input 
                                        type="text" 
                                        name="rectal" 
                                        id="rectal" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.rectal}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Musculo-Skeletal</p>
                                    <input 
                                        type="text" 
                                        name="musculo_skeletal" 
                                        id="musculo_skeletal" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.musculo_skeletal}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Extremeties</p>
                                    <input 
                                        type="text" 
                                        name="extremeties" 
                                        id="extremeties" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.extremeties}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-center items-center w-full">
                                    <p className="text-sm w-full md:w-1/2">Other</p>
                                    <input 
                                        type="text" 
                                        name="other" 
                                        id="other" 
                                        className="w-full md:w-1/2 p-2 text-sm rounded" 
                                        value={medicalExam.other}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <p className="font-semibold">DIAGNOSTIC EXAMINATION</p>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="blood_pressure" className="text-xs font-semibold">Blood Pressure:</label>
                                    <input  
                                        type="text" 
                                        name="blood_pressure" 
                                        id="blood_pressure" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.blood_pressure}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="temperature" className="text-xs font-semibold">Temperature:</label>
                                    <input  
                                        type="text" 
                                        name="temperature" 
                                        id="temperature" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.temperature}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="hr" className="text-xs font-semibold">HR:</label>
                                    <input  
                                        type="text" 
                                        name="hr" 
                                        id="hr" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.hr}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="rr" className="text-xs font-semibold">RR:</label>
                                    <input  
                                        type="text" 
                                        name="rr" 
                                        id="rr" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.rr}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="height" className="text-xs font-semibold">Height:</label>
                                    <input  
                                        type="text" 
                                        name="height" 
                                        id="height" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.height}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="weight" className="text-xs font-semibold">Weight:</label>
                                    <input  
                                        type="text" 
                                        name="weight" 
                                        id="weight" 
                                        className="w-full p-2 text-sm rounded" 
                                        value={medicalExam.weight}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-5">
                                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <p className="text-xs font-bold">HEARING:</p>
                                    <div className="w-full flex justify-center items-center">
                                        <input 
                                            type="checkbox" 
                                            name="hearing" 
                                            id="hearing_normal"
                                            checked={medicalExam.hearing === 'normal'}
                                            value={'normal'}
                                            onChange={()=>setMedicalExam({
                                                ...medicalExam,
                                                hearing: medicalExam.hearing === 'normal' ? '' : 'normal'
                                            })}
                                        />
                                        <label htmlFor="hearing_normal" className="text-xs font-semibold">Normal</label>
                                    </div>
                                    <div className="w-full flex justify-center items-center">
                                        <input 
                                            type="checkbox" 
                                            name="hearing" 
                                            id="hearing_impaired"
                                            checked={medicalExam.hearing === 'hearing impaired'}
                                            value={'hearing impaired'}
                                            onChange={()=>setMedicalExam({
                                                ...medicalExam,
                                                hearing: medicalExam.hearing === 'hearing impaired' ? '' : 'hearing impaired'
                                            })}
                                        />
                                        <label htmlFor="hearing_impaired" className="text-xs font-semibold">Hearing Impaired</label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-5">
                                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <p className="text-xs font-bold">VISION:</p>
                                    <div className="w-full flex justify-center items-center">
                                        <input 
                                            type="checkbox" 
                                            name="vision" 
                                            id="vision_normal"
                                            checked={medicalExam.vision === 'with glasses'}
                                            value={'with glasses'}
                                            onChange={()=>setMedicalExam({
                                                ...medicalExam,
                                                vision: medicalExam.vision === 'with glasses' ? '' : 'with glasses'
                                            })}
                                        />
                                        <label htmlFor="vision_normal" className="text-xs font-semibold">With Glasses</label>
                                    </div>
                                    <div className="w-full flex justify-center items-center">
                                        <input 
                                            type="checkbox" 
                                            name="vision" 
                                            id="vision_impaired"
                                            checked={medicalExam.hearing === 'without glasses'}
                                            value={'without glasses'}
                                            onChange={()=>setMedicalExam({
                                                ...medicalExam,
                                                vision: medicalExam.vision === 'without glasses' ? '' : 'without glassess'
                                            })}
                                        />
                                        <label htmlFor="vision_impaired" className="text-xs font-semibold">Without Glasses</label>
                                    </div>
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <label htmlFor="vision_l" className="text-xs font-semibold">L:</label>
                                        <input 
                                            type="text" 
                                            name="vision_l" 
                                            id="vision_l" 
                                            className="w-full p-2 rounded text-sm" 
                                            value={medicalExam.vision_l}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <label htmlFor="vision_r" className="text-xs font-semibold">R:</label>
                                        <input 
                                            type="text" 
                                            name="vision_r" 
                                            id="vision_r" 
                                            className="w-full p-2 rounded text-sm" 
                                            value={medicalExam.vision_r}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
                                <div className="w-full">
                                    <label htmlFor="xray_type" className="text-xs font-bold">CHEST XRAY:</label>
                                    <select
                                        name="xray_type"
                                        className="w-full p-2 rounded text-sm"
                                        onChange={handleOnChange}
                                        value={medicalExam.xray_type}
                                    >
                                        <option value=""></option>
                                        <option value="pa view">PA View</option>
                                        <option value="lordotic view">Lordotic View</option>
                                    </select>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="chest_xray" className="text-xs font-semibold">Findings:</label>
                                    <input 
                                        type="text" 
                                        name="chest_xray" 
                                        id="chest_xray" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={medicalExam.chest_xray}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
                                <div className="w-full">
                                    <label htmlFor="complete_blood_count" className="text-xs font-bold">COMPLETE BLOOD COUNT:</label>
                                    <input 
                                        type="text" 
                                        name="complete_blood_count" 
                                        id="complete_blood_count" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={medicalExam.complete_blood_count}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="routine_urinalysis" className="text-xs font-bold">ROUTINE URINALYSIS:</label>
                                    <input 
                                        type="text" 
                                        name="routine_urinalysis" 
                                        id="routine_urinalysis" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={medicalExam.routine_urinalysis}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
                                <div className="w-full">
                                    <label htmlFor="fecalysis" className="text-xs font-bold">FECALYSIS:</label>
                                    <input 
                                        type="text" 
                                        name="fecalysis" 
                                        id="fecalysis" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={medicalExam.fecalysis}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="hepatitis_b_screening" className="text-xs font-bold">HEPATITIS B SCREENING:</label>
                                    <input 
                                        type="text" 
                                        name="hepatitis_b_screening" 
                                        id="hepatitis_b_screening" 
                                        className="w-full p-2 rounded text-sm" 
                                        value={medicalExam.hepatitis_b_screening}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full mt-5">
                                <p className="text-xs font-bold">DRUG TEST:</p>
                                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <div className="w-full">
                                        <label htmlFor="metaphetamine" className="text-xs font-semibold">Metaphetamine:</label>
                                        <input 
                                            type="text" 
                                            name="metaphetamine" 
                                            id="metaphetamine" 
                                            className="w-full p-2 rounded text-sm" 
                                            value={medicalExam.metaphetamine}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="tetrahydrocannabinol" className="text-xs font-semibold">Tetrahydrocannabinol:</label>
                                        <input 
                                            type="text" 
                                            name="tetrahydrocannabinol" 
                                            id="tetrahydrocannabinol" 
                                            className="w-full p-2 rounded text-sm" 
                                            value={medicalExam.tetrahydrocannabinol}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-5">
                                <p className="font-semibold">CERTIFICATION</p>
                                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <div className="w-full">
                                        <label htmlFor="classification" className="text-xs font-semibold">Classification:</label>
                                        <select 
                                            name="classification" 
                                            value={medicalExam.classification}
                                            onChange={handleOnChange}
                                            className="w-full p-2 rounded text-sm"
                                        >
                                            <option value=""></option>
                                            <option value="class a">CLASS A</option>
                                            <option value="class b">CLASS B</option>
                                            <option value="class c">CLASS C</option>
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="correction" className="text-xs font-semibold">Needs treatment or correction of:</label>
                                        <Select 
                                            isMulti
                                            name="correction"
                                            id="correction"
                                            options={correctionOptions}
                                            value={correction}
                                            onChange={(e: MultiValue<Option>) => setCorrection([...e])}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="remarks" className="text-xs font-semibold">Remarks:</label>
                                <textarea 
                                    name="remarks"
                                    id="remarks"
                                    rows={5}
                                    className="w-full p-2 rounded text-sm resize-none"
                                    value={medicalExam.remarks}
                                    onChange={(e)=>setMedicalExam({
                                        ...medicalExam,
                                        remarks: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                        <button className="p-2 rounded text-sm text-white font-bold bg-indigo-600 hover:bg-indigo-700">Submit</button>
                    </div>
                </form>
            </section>
        </div>
    )
}