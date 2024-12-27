'use client'

import MedicineDispenser from "@/app/components/MedicineDispenser";
import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
// import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

interface IllnessOption {
    value: string;
    label: string;
}

interface Patient {
    _id: string
    first_name: string;
    middle_name: string;
    last_name: string;
    extension?: string;
    position: 'student' | 'teacher' | 'non-teaching-staff';
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
    patient: string;
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
}

interface Medicine {
    _id: string;
    medicine_name: string;
    quantity: number;
}

export default function Consultation({ params }: { params: { slug: string }}) {
    // const router = useRouter()
    const [patient, setPatient] = useState<Patient>({
        _id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        position: 'student',
        department: '',
        id_number: '',
        birthdate: new Date(),
        nationality: '',
        religion: '',
        sex: 'male',
        contact: '',
        email: '',
        address: '',
        father_name: '',
        father_birthdate: new Date(),
        father_occupation: '',
        mother_name: '',
        mother_birthdate: new Date(),
        mother_occupation: '',
        blood_type: '',
        height: '',
        weight: '',
        person_to_be_notified: '',
        emergency_contact: '',
        other_person_name: '',
        other_person_contact: '',
        relation: '',
        food_allergy: [''],
        medicine_allergy: [''],
        other_allergy: [''],
    })
    const [consultation, setConsultation] = useState<ConsultationState>({
        patient: '',
        address: '',
        father_name: '',
        father_birthdate: new Date(),
        father_occupation: '',
        mother_name: '',
        mother_birthdate: new Date(),
        mother_occupation: '',
        height: '',
        weight: '',
        person_to_be_notified: '',
        emergency_contact: '',
        other_person_name: '',
        other_person_contact: '',
        relation: '',
        food_allergy: [''],
        medicine_allergy: [''],
        other_allergy: [''],
        asthma_history: null,
        illness_history: [],
        person_with_disability: [],
        current_illness: [],
        surgical_operation: null,
        operation_date: new Date(),
        operation_type: '',
        operation_hospital: '',
        hospitalized: null,
        hospital_name: '',
        attending_physician: '',
        diagnosis: '',
    })
    const [illnessHistory, setIllnessHistory] = useState<IllnessOption[]>([])
    const [selectedIllness, setSelectedIllness] = useState<IllnessOption[]>([])
    const [pwd, setPWD] = useState<IllnessOption[]>([])
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [hideDispenser, setHideDispenser] = useState<boolean>(true)
    const [medicineOptions, setMedicineOptions] = useState<Medicine[]>([])
    const [recordId, setRecordId] = useState<string>('')


    const getPatient = useCallback(async () => {
        await axios.get(`/api/patient?id_number=${params.slug}`)
        .then(response => {
            const p = response.data?.patient
            setPatient(p)
            setConsultation({
                ...consultation,
                patient: p?._id,
                address: p?.address,
                father_name: p?.father_name,
                father_birthdate: new Date(p?.father_birthdate),
                father_occupation: p?.father_occupation,
                mother_name: p?.mother_name,
                mother_birthdate: new Date(p?.mother_birthdate),
                mother_occupation: p?.mother_occupation,
                height: p?.height,
                weight: p?.weight,
                person_to_be_notified: p?.person_to_be_notified,
                emergency_contact: p?.emergency_contact,
                other_person_name: p?.other_person_name,
                other_person_contact: p?.other_person_contact,
                relation: p?.relation,
                food_allergy: p?.food_allergy,
                medicine_allergy: p?.medicine_allergy,
                other_allergy: p?.other_allergy,
            })
        })
        .catch(error => {
            console.log(error)
        }) 
    }, [])

    const getMedicines = useCallback(async () => {
        await axios.get('/api/medicine')
        .then(response => {
            const meds = response.data?.medicines
            // setMedicine(meds)
            setMedicineOptions(meds)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setIsMounted(true)
        getPatient()
        getMedicines()
    }, [getPatient, getMedicines])

    // const setMedicine = (meds: Medicine[]) => {
    //     const temp = meds.map(item => ({
    //         value: item._id,
    //         label: item.medicine_name
    //     }))
    //     setMedicineOptions(temp)
    // }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setConsultation({
            ...consultation,
            [name]: value
        })
    }

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        type: 'food_allergy' | 'medicine_allergy' | 'other_allergy'
      ) => {
        const updatedAllergies = [...consultation[type]];
        updatedAllergies[index] = e.target.value;
        setConsultation((prevConsultation) => ({
          ...prevConsultation,
          [type]: updatedAllergies,
        }));
      }

    const addItem = (type: 'food_allergy' | 'medicine_allergy' | 'other_allergy') => {
        setConsultation((prevConsultation) => ({
            ...prevConsultation,
            [type]: [...prevConsultation[type], ''],
        }))
    }

    const deleteItem = (type: 'food_allergy' | 'medicine_allergy' | 'other_allergy', index: number) => {
        const allergy = [...consultation[type]]
        allergy.splice(index, 1)
        setConsultation((prevConsultation) => ({
            ...prevConsultation,
            [type]: allergy
        }))
    }

    const illnessOptions = [
        { value: 'asthma', label: 'Asthma' },
        { value: 'measles', label: 'Measles' },
        { value: 'bronchitis', label: 'Bronchitis' },
        { value: 'muscles spasm', label: 'Muscles Spasm' },
        { value: 'chicken pox', label: 'Chicken Pox' },
        { value: 'pneumonia', label: 'Pneumonia' },
        { value: 'epilepsy', label: 'Epilepsy' },
        { value: 'skin allergy', label: 'Skin Allergy' },
        { value: 'tonsilitis', label: 'Tonsilitis' },
        { value: 'gastritis', label: 'Gastritis' },
        { value: 'heart disease', label: 'Heart Disease' },
        { value: 'tuberculosis', label: 'Tuberculosis' },
        { value: 'hypertension', label: 'Hypertension' },
        { value: 'uti', label: 'UTI' },
    ]

    const disabilityOptions = [
        { value: 'blind', label: 'Blind or Visually Impaired' },
        { value: 'autism', label: 'Autism' },
        { value: 'deaf/mute', label: 'Deaf/Mute' },
        { value: 'chronic illness', label: 'Chronic Illness (stroke, diabetes, etc.)' },
        { value: 'orthopedically challenged', label: 'Orthopedically Challenged' },
        { value: 'congenital defects', label: 'Congenital Defects' },
        { value: 'communication disorder', label: 'Communication Disorder, Speech & Language Impairment (cleft lip/palate)' },
    ]

    const currentIllnessOptions: IllnessOption[] = [
        { value: 'headache', label: 'Headache' },
        { value: 'cough', label: 'Cough' },
        { value: 'cold', label: 'Cold' },
        { value: 'flu', label: 'Flu' },
        { value: 'allergies', label: 'Allergies' },
        { value: 'stomach ache', label: 'Stomach ache' },
        { value: 'uti', label: 'UTI' },
        { value: 'tootache', label: 'Tootache' },
        { value: 'injury', label: 'Injury' },
        { value: 'infected wounds', label: 'Infected Wounds' },
        { value: 'tuberculosis', label: 'Tuberculosis' },
        { value: 'menstrual cramps', label: 'Menstrual Cramps' },
    ]

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const updatedConsultation: ConsultationState = {
                ...consultation,
                illness_history: illnessHistory.map((illness) => illness.value),
                person_with_disability: pwd.map((disability) => disability.value),
                current_illness: selectedIllness.map((ill) => ill.value),
            }
            const response = toast.promise(
                axios.post('/api/consultation', updatedConsultation),
                {
                    pending: 'Submitting form...',
                    success: 'Form submitted',
                    error: 'Error'
                }
            )
            const rec = (await response).data?.record
            setRecordId(rec?._id)
            setHideDispenser(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error)
                Swal.fire({
                    title: 'Sign Up Error',
                    text: error.response?.data?.message ?? error.message,
                    icon: 'error',
                });
            }
        }
    }

    if (!isMounted) {
        return null
    }

    const toggleDispenser = () => {
        setHideDispenser(!hideDispenser)
    }

    return (
        <div className="w-full flex justify-center items-center py-10">
            <ToastContainer position="bottom-right" />
            <MedicineDispenser isHidden={hideDispenser} toggle={toggleDispenser} medicines={medicineOptions} record={recordId} />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Consultations</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <div className="w-full">
                            <p className="font-semibold">Patient Information:</p>
                            <div className="flex justify-center items-center gap-2">
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
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="sex" className="text-xs font-semibold">Sex:</label>
                                    <div className="flex justify-center items-center">
                                        <div className="w-full">
                                            <input 
                                                type="checkbox" 
                                                name="male" 
                                                id="male"
                                                checked={patient.sex === 'male'}
                                                readOnly
                                            />
                                            <label htmlFor="male" className="text-xs">Male</label>
                                        </div>
                                        <div className="w-full">
                                            <input 
                                                type="checkbox" 
                                                name="female" 
                                                id="female"
                                                checked={patient.sex === 'female'}
                                                readOnly
                                            />
                                            <label htmlFor="female" className="text-xs">Female</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="contact" className="text-xs font-semibold">Cellphone Number:</label>
                                    <input 
                                        type="text" 
                                        name="contact" 
                                        id="contact" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Cellphone Number"
                                        value={patient.contact}
                                        readOnly
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="email" className="text-xs font-semibold">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Email"
                                        value={patient.email}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="address" className="text-xs font-semibold">Address:</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    id="address" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Address"
                                    value={patient.address}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center my-5">
                                <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                                <div className="flex-grow-0 mx-5 text-sm font-semibold dark:text-white">modifiable</div>
                                <div className="flex-grow bg bg-gray-300 h-0.5"></div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <div className="w-full">
                                        <label htmlFor="height" className="text-xs font-semibold">Height:</label>
                                        <input 
                                            type="text" 
                                            name="height" 
                                            id="height" 
                                            className="w-full p-2 rounded text-sm" 
                                            placeholder="Height"
                                            value={consultation.height}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="weight" className="text-xs font-semibold">Weight:</label>
                                        <input 
                                            type="text" 
                                            name="weight" 
                                            id="weight" 
                                            className="w-full p-2 rounded text-sm" 
                                            placeholder="Weight"
                                            value={consultation.weight}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="father_name" className="text-xs font-semibold">Father&#39;s name:</label>
                                    <input 
                                        type="text" 
                                        name="father_name" 
                                        id="father_name" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Father's name"
                                        value={consultation.father_name}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="father_birthdate" className="text-xs font-semibold">Father&#39;s Date of Birth:</label>
                                    <input 
                                        type="date" 
                                        name="father_birthdate" 
                                        id="father_birthdate" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Father's Date of Birth"
                                        value={consultation.father_birthdate ? new Date(consultation.father_birthdate).toISOString().substring(0, 10) : ''}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="father_occupation" className="text-xs font-semibold">Father&#39;s Occupation:</label>
                                    <input 
                                        type="text" 
                                        name="father_occupation" 
                                        id="father_occupation" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Father's Occupation"
                                        value={patient.father_occupation}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                <div className="w-full">
                                    <label htmlFor="mother_name" className="text-xs font-semibold">Mother&#39;s name:</label>
                                    <input 
                                        type="text" 
                                        name="mother_name" 
                                        id="mother_name" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Mother's name"
                                        value={consultation.mother_name}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="mother_birthdate" className="text-xs font-semibold">Mother&#39;s Date of Birth:</label>
                                    <input 
                                        type="date" 
                                        name="mother_birthdate" 
                                        id="mother_birthdate" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Mother's Date of Birth"
                                        value={consultation.mother_birthdate ? new Date(consultation.mother_birthdate).toISOString().substring(0, 10) : ''}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="mother_occupation" className="text-xs font-semibold">Mother&#39;s Occupation:</label>
                                    <input 
                                        type="text" 
                                        name="mother_occupation" 
                                        id="mother_occupation" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Mother's Occupation"
                                        value={consultation.mother_occupation}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
                                <div className="w-full">
                                    <p className="font-semibold text-sm">IN CASE OF EMERGENCY:</p>
                                    <label htmlFor="" className="text-xs font-semibold">Person to be notified:</label>
                                    <div className="w-full flex justify-center items-center">
                                        <div className="w-full flex justify-center items-center">
                                            <input 
                                                type="checkbox" 
                                                name="person_to_be_notified" 
                                                id="person_to_be_notified" 
                                                className="w-full p-2 rounded text-sm" 
                                                checked={consultation.person_to_be_notified === 'father'}
                                                onChange={()=>setConsultation({
                                                    ...consultation,
                                                    person_to_be_notified: consultation.person_to_be_notified === 'father' ? '' : 'father'
                                                })}
                                            />
                                            <label htmlFor="" className="text-xs font-semibold">Father</label>
                                        </div>
                                        <div className="w-full flex justify-center items-center">
                                            <input 
                                                type="checkbox" 
                                                name="person_to_be_notified" 
                                                id="person_to_be_notified" 
                                                className="w-full p-2 rounded text-sm" 
                                                checked={consultation.person_to_be_notified === 'mother'}
                                                onChange={()=>setConsultation({
                                                    ...consultation,
                                                    person_to_be_notified: consultation.person_to_be_notified === 'mother' ? '' : 'mother'
                                                })}
                                            />
                                            <label htmlFor="" className="text-xs font-semibold">Mother</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="emergency_contact" className="text-xs font-semibold">Cellphone Number:</label>
                                    <input 
                                        type="text" 
                                        name="emergency_contact" 
                                        id="emergency_contact" 
                                        className="w-full p-2 rounded text-sm" 
                                        placeholder="Cellphone Number"
                                        value={consultation.emergency_contact}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full mt-4">
                                <p className="text-sm font-semibold">(If parents cannot be reached)</p>
                                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                    <div className="w-full">
                                        <label htmlFor="other_person_name" className="text-xs font-semibold">Name:</label>
                                        <input 
                                            type="text" 
                                            name="other_person_name" 
                                            id="other_person_name" 
                                            className="w-full p-2 rounded text-sm" 
                                            placeholder="Name"
                                            value={consultation.other_person_name}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="other_person_contact" className="text-xs font-semibold">Cellphone Number:</label>
                                        <input 
                                            type="text" 
                                            name="other_person_contact" 
                                            id="other_person_contact" 
                                            className="w-full p-2 rounded text-sm" 
                                            placeholder="Cellphone Number"
                                            value={consultation.other_person_contact}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="relation" className="text-xs font-semibold">Relation to the patient:</label>
                                        <input 
                                            type="text" 
                                            name="relation" 
                                            id="relation" 
                                            className="w-full p-2 rounded text-sm" 
                                            placeholder="Relation to the patient"
                                            value={consultation.relation}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <header className="mt-5 mb-1">
                                        <h1 className="font-semibold">Medical History</h1>
                                    </header>
                                    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                                        <div className="w-full">
                                            <label htmlFor="illness_history" className="text-xs font-semibold">Past/Present Illness: (can select multiple)</label>
                                            <Select 
                                                isMulti
                                                name="illness_history"
                                                options={illnessOptions}
                                                value={illnessHistory}
                                                onChange={(e: MultiValue<IllnessOption>) => setIllnessHistory([...e])}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="person_with_disability" className="text-xs font-semibold">For PWD (Person With Disability):</label>
                                            <Select 
                                                isMulti
                                                name="person_with_disability"
                                                options={disabilityOptions}
                                                value={pwd}
                                                onChange={(e: MultiValue<IllnessOption>) => setPWD([...e])}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="food_allergy" className="text-xs font-semibold">Food Allergy:</label>
                                        <div className="space-y-2">
                                            {
                                                consultation.food_allergy.map((food, index) => {
                                                    return(
                                                        <div className="flex justify-center items-center gap-2" key={index}>
                                                            <input 
                                                                type="text"  
                                                                name={`food_allergy${index}`} 
                                                                id={`food_allergy${index}`} 
                                                                className="w-full p-2 rounded text-sm" 
                                                                value={consultation.food_allergy[index]}
                                                                onChange={(e)=>handleInputChange(e,index,'food_allergy')}
                                                            />
                                                            {
                                                                index === 0 ?
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-green-300 hover:bg-green-400"
                                                                    onClick={()=>addItem('food_allergy')}
                                                                >
                                                                    +
                                                                </button>
                                                                :
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-rose-300 hover:bg-rose-400"
                                                                    onClick={()=>deleteItem('food_allergy', index)}
                                                                >
                                                                    -
                                                                </button>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="w-full mt-2">
                                        <label htmlFor="medicine_allergy" className="text-xs font-semibold">Medicine Allergy:</label>
                                        <div className="space-y-2">
                                            {
                                                consultation.medicine_allergy.map((medicine,index) => {
                                                    return (
                                                        <div className="flex justify-center items-center gap-2" key={index}>
                                                            <input 
                                                                type="text"  
                                                                name={`medicine_allergy${index}`} 
                                                                id={`medicine_allergy${index}`} 
                                                                className="w-full p-2 rounded text-sm" 
                                                                value={consultation.medicine_allergy[index]}
                                                                onChange={(e)=>handleInputChange(e,index,'medicine_allergy')}
                                                            />
                                                            {
                                                                index === 0 ?
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-green-300 hover:bg-green-400"
                                                                    onClick={()=>addItem('medicine_allergy')}
                                                                >
                                                                    +
                                                                </button>
                                                                :
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-rose-300 hover:bg-rose-400"
                                                                    onClick={()=>deleteItem('medicine_allergy', index)}
                                                                >
                                                                    -
                                                                </button>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="w-full mt-2">
                                        <label htmlFor="other_allergy" className="text-xs font-semibold">Other Allergy:</label>
                                        <div className="space-y-2">
                                            {
                                                consultation.other_allergy.map((other,index) => {
                                                    return (
                                                        <div className="flex justify-center items-center gap-2" key={index}>
                                                            <input 
                                                                type="text"  
                                                                name={`other_allergy${index}`} 
                                                                id={`other_allergy${index}`} 
                                                                className="w-full p-2 rounded text-sm" 
                                                                value={consultation.other_allergy[index]}
                                                                onChange={(e)=>handleInputChange(e,index,'other_allergy')}
                                                            />
                                                            {
                                                                index === 0 ?
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-green-300 hover:bg-green-400"
                                                                    onClick={()=>addItem('other_allergy')}
                                                                >
                                                                    +
                                                                </button>
                                                                :
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded text-sm text-white bg-rose-300 hover:bg-rose-400"
                                                                    onClick={()=>deleteItem('other_allergy', index)}
                                                                >
                                                                    -
                                                                </button>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="w-full flex flex-col justify-center items-center gap-2">
                                    <div className="w-full">
                                        <label htmlFor="current_illness" className="text-xs font-semibold">Are you suffering from an illness at the moment? Which do you think?</label>
                                        {/* <textarea 
                                            name="current_illness"
                                            id="current_illness"
                                            className="w-full text-sm p-2 rounded resize-none" 
                                            rows={2} 
                                            placeholder="Type here..."
                                            value={consultation.current_illness}
                                            onChange={(e)=>setConsultation({
                                                ...consultation,
                                                current_illness: e.target.value
                                            })}
                                            required
                                        /> */}
                                        <Select 
                                            options={currentIllnessOptions}
                                            value={selectedIllness}
                                            onChange={(e: MultiValue<IllnessOption>)=>setSelectedIllness([...e])}
                                            isMulti
                                        />
                                    </div>
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <div className="w-full">
                                            <p className="font-semibold text-xs">Did you undergo surgical operation?</p>
                                            <div className="w-full flex justify-center items-center">
                                                <div className="w-full flex justify-center items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        name="surgical_operation" 
                                                        id="surgical_operation" 
                                                        checked={consultation.surgical_operation !== null ? consultation.surgical_operation : false}
                                                        onChange={()=>setConsultation({
                                                            ...consultation,
                                                            surgical_operation: true
                                                        })}
                                                    />
                                                    <label htmlFor="surgical_operation" className="text-xs font-semibold">YES</label>
                                                </div>
                                                <div className="w-full flex justify-center items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        name="surgical_operation" 
                                                        id="surgical_operation" 
                                                        checked={consultation.surgical_operation !== null ? consultation.surgical_operation : false}
                                                        onChange={()=>setConsultation({
                                                            ...consultation,
                                                            surgical_operation: false
                                                        })}
                                                    />
                                                    <label htmlFor="surgical_operation" className="text-xs font-semibold">NO</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="operation_date" className="text-xs font-semibold">Date of Operation:</label>
                                            <input 
                                                type="date" 
                                                name="operation_date" 
                                                id="operation_date" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.operation_date ? new Date(consultation.operation_date).toISOString().substring(0, 10) : ''}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="operation_type" className="text-xs font-semibold">Type of Operation:</label>
                                            <input 
                                                type="text" 
                                                name="operation_type" 
                                                id="operation_type" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.operation_type}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="operation_hospital" className="text-xs font-semibold">Hospital:</label>
                                            <input 
                                                type="text" 
                                                name="operation_hospital" 
                                                id="operation_hospital" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.operation_hospital}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <div className="w-full">
                                            <p className="font-semibold text-xs">Have you been hospitalized for the past 6 months?</p>
                                            <div className="w-full flex justify-center items-center">
                                                <div className="w-full flex justify-center items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        name="hospitalized" 
                                                        id="hospitalized" 
                                                        checked={consultation.hospitalized !== null ? consultation.hospitalized : false}
                                                        onChange={()=>setConsultation({
                                                            ...consultation,
                                                            hospitalized: true
                                                        })}
                                                    />
                                                    <label htmlFor="surgical_operation" className="text-xs font-semibold">YES</label>
                                                </div>
                                                <div className="w-full flex justify-center items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        name="hospitalized" 
                                                        id="hospitalized" 
                                                        checked={consultation.hospitalized !== null ? consultation.hospitalized : false}
                                                        onChange={()=>setConsultation({
                                                            ...consultation,
                                                            hospitalized: false
                                                        })}
                                                    />
                                                    <label htmlFor="surgical_operation" className="text-xs font-semibold">NO</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="hospital_name" className="text-xs font-semibold">Hospital:</label>
                                            <input 
                                                type="text" 
                                                name="hospital_name" 
                                                id="hospital_name" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.hospital_name}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="attending_physician" className="text-xs font-semibold">Attending Physician:</label>
                                            <input 
                                                type="text" 
                                                name="attending_physician" 
                                                id="attending_physician" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.attending_physician}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="diagnosis" className="text-xs font-semibold">Diagnosis:</label>
                                            <input 
                                                type="text" 
                                                name="diagnosis" 
                                                id="diagnosis" 
                                                className="w-full p-2 rounded text-sm" 
                                                value={consultation.diagnosis}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <button type="submit" className="p-2 text-sm text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded">Submit</button>
                    </div>
                </form>
            </section>
        </div>
    )
}