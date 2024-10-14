'use client'

import axios from "axios";
import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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


export default function Edit({ params }: { params: { slug: string } }) {

    const [patient, setPatient] = useState<Patient>({
        _id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        position: '',
        department: '',
        id_number: '',
        birthdate: null, 
        nationality: '',
        religion: '',
        sex: 'male',
        contact: '',
        email: '',
        address: '',
        father_name: '',
        father_birthdate: null, 
        father_occupation: '',
        mother_name: '',
        mother_birthdate: null, 
        mother_occupation: '',
        blood_type: '',
        height: '',
        weight: '',
        person_to_be_notified: null,
        emergency_contact: '',
        other_person_name: '',
        other_person_contact: '',
        relation: '',
        food_allergy: [''],
        medicine_allergy: [''],
        other_allergy: [''],
    })

    const handleOnChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setPatient({
            ...patient,
            [name]: value
        })
    }

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        type: 'food_allergy' | 'medicine_allergy' | 'other_allergy'
      ) => {
        const updatedAllergies = [...patient[type]];
        updatedAllergies[index] = e.target.value;
        setPatient((prevPatient) => ({
          ...prevPatient,
          [type]: updatedAllergies,
        }));
      }

    const addItem = (type: 'food_allergy' | 'medicine_allergy' | 'other_allergy') => {
        setPatient((prevPatient) => ({
            ...prevPatient,
            [type]: [...prevPatient[type], ''],
        }))
    }

    const deleteItem = (type: 'food_allergy' | 'medicine_allergy' | 'other_allergy', index: number) => {
        const allergy = [...patient[type]]
        allergy.splice(index, 1)
        setPatient((prevPatient) => ({
            ...prevPatient,
            [type]: allergy
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await axios.put(`/api/patient?id_number=${params.slug}`, patient)
        .then(()=>{
            toast.success('Patient submitted')
        })
        .catch(error => {
            toast.error('Error')
            console.log(error)
        })
    }

    const getPatient = useCallback(async () => {
        await axios.get(`/api/patient?id_number=${params.slug}`)
        .then(response => {
            const p = response.data?.patient
            setPatient(p)
        })
        .catch(error => {
            console.log(error)
            toast.error(error?.response?.data?.message)
        })
    }, [])

    useEffect(() => {
        getPatient()
    }, [getPatient])

    return (
        <div className="w-full flex justify-center items-center py-10">
            <ToastContainer position="bottom-right" />
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-start items-center gap-2">
                    <Link href={'/admin/patient'} className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white font-semibold">back</Link>
                    <h1 className="text-2xl">Edit Patient Information</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                            <div className="w-full">
                                <label htmlFor="first_name" className="text-xs font-semibold">First name:</label>
                                <input 
                                    type="text" 
                                    name="first_name" 
                                    id="first_name" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="First name"
                                    value={patient.first_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="middle_name" className="text-xs font-semibold">Middle name:</label>
                                <input 
                                    type="text" 
                                    name="middle_name" 
                                    id="middle_name" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Middle name"
                                    value={patient.middle_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="last_name" className="text-xs font-semibold">Last name:</label>
                                <input 
                                    type="text" 
                                    name="last_name" 
                                    id="last_name" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Last name"
                                    value={patient.last_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="extension" className="text-xs font-semibold">Extension:</label>
                                <input 
                                    type="text" 
                                    name="extension" 
                                    id="extension" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Extension"
                                    value={patient.extension}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                            <div className="w-full">
                                <label htmlFor="position" className="text-xs font-semibold">Position:</label>
                                <select 
                                    name="position" 
                                    id="position" 
                                    className="w-full p-2 rounded text-sm"
                                    value={patient.position}
                                    onChange={handleOnChange}
                                >
                                    <option value="">Select Position</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="non-teaching-staff">Non Teaching Staff</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="department" className="text-xs font-semibold">Department:</label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    id="department" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Department"
                                    value={patient.department}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="id_number" className="text-xs font-semibold">ID Number:</label>
                                <input 
                                    type="text" 
                                    name="id_number" 
                                    id="id_number" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="ID Number"
                                    value={patient.id_number}
                                    onChange={handleOnChange}
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
                                    onChange={handleOnChange}
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
                                    onChange={handleOnChange}
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
                                    onChange={handleOnChange}
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
                                            onChange={() =>
                                                setPatient({ ...patient, sex: patient.sex === 'male' ? 'female' : 'male' })
                                            } 
                                        />
                                        <label htmlFor="male" className="text-xs">Male</label>
                                    </div>
                                    <div className="w-full">
                                        <input 
                                            type="checkbox" 
                                            name="female" 
                                            id="female"
                                            checked={patient.sex === 'female'}
                                            onChange={() =>
                                                setPatient({ ...patient, sex: patient.sex === 'female' ? 'male' : 'female' })
                                            } 
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
                                    onChange={handleOnChange}
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
                                    onChange={handleOnChange}
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
                                onChange={handleOnChange}
                            />
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
                                    value={patient.father_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="father_birthdate" className="text-xs font-semibold">Father&#39;s Date of Birth:</label>
                                <input 
                                    type="text" 
                                    name="father_birthdate" 
                                    id="father_birthdate" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Father's Date of Birth"
                                    value={patient.father_birthdate ? new Date(patient.father_birthdate).toISOString().substring(0, 10) : ''}
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
                                    value={patient.mother_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="mother_birthdate" className="text-xs font-semibold">Mother&#39;s Date of Birth:</label>
                                <input 
                                    type="text" 
                                    name="mother_birthdate" 
                                    id="mother_birthdate" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Mother's Date of Birth"
                                    value={patient.mother_birthdate ? new Date(patient.mother_birthdate).toISOString().substring(0, 10) : ''}
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
                                    value={patient.mother_occupation}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                            <div className="w-full">
                                <label htmlFor="blood_type" className="text-xs font-semibold">Blood Type:</label>
                                <select 
                                    name="blood_type" 
                                    id="blood_type" 
                                    className="w-full p-2 rounded text-sm"
                                    value={patient.blood_type}
                                    onChange={handleOnChange}
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="ab">AB</option>
                                    <option value="o">O</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="height" className="text-xs font-semibold">Height:</label>
                                <input 
                                    type="text" 
                                    name="height" 
                                    id="height" 
                                    className="w-full p-2 rounded text-sm" 
                                    placeholder="Height"
                                    value={patient.height}
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
                                    value={patient.weight}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
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
                                            checked={patient.person_to_be_notified === 'father'}
                                            onChange={()=>setPatient({
                                                ...patient,
                                                person_to_be_notified: patient.person_to_be_notified === 'father' ? null : 'father'
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
                                            checked={patient.person_to_be_notified === 'mother'}
                                            onChange={()=>setPatient({
                                                ...patient,
                                                person_to_be_notified: patient.person_to_be_notified === 'mother' ? null : 'mother'
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
                                    value={patient.emergency_contact}
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="w-full">
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
                                        value={patient.other_person_name}
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
                                        value={patient.other_person_contact}
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
                                        value={patient.relation}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <header className="mt-5 mb-1">
                                <h1 className="font-semibold">History of Allergy</h1>
                            </header>
                            <div className="w-full">
                                <label htmlFor="food_allergy" className="text-xs font-semibold">Food Allergy:</label>
                                <div className="space-y-2">
                                    {
                                        patient.food_allergy.map((food, index) => {
                                            return(
                                                <div className="flex justify-center items-center gap-2" key={index}>
                                                    <input 
                                                        type="text"  
                                                        name={`food_allergy${index}`} 
                                                        id={`food_allergy${index}`} 
                                                        className="w-full p-2 rounded text-sm" 
                                                        value={patient.food_allergy[index]}
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
                                        patient.medicine_allergy.map((medicine,index) => {
                                            return (
                                                <div className="flex justify-center items-center gap-2" key={index}>
                                                    <input 
                                                        type="text"  
                                                        name={`medicine_allergy${index}`} 
                                                        id={`medicine_allergy${index}`} 
                                                        className="w-full p-2 rounded text-sm" 
                                                        value={patient.medicine_allergy[index]}
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
                                        patient.other_allergy.map((other,index) => {
                                            return (
                                                <div className="flex justify-center items-center gap-2" key={index}>
                                                    <input 
                                                        type="text"  
                                                        name={`other_allergy${index}`} 
                                                        id={`other_allergy${index}`} 
                                                        className="w-full p-2 rounded text-sm" 
                                                        value={patient.other_allergy[index]}
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
                        <button type="submit" className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white font-bold">Submit</button>
                    </div>
                </form>
            </section>
        </div>
    )
}