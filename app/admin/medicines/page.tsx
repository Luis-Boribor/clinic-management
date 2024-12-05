'use client'

import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { MdOutlineNoteAdd, MdClose, MdOutlineAdd } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import AddStock from "@/app/components/AddStock";

interface Medicine {
    _id: string;
    medicine_name: string;
    description?: string[];
    stock: number;
    createdAt: Date;
}

export default function Medicine() {
    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [medicineArr, setMedicineArr] = useState<Medicine[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showStock, setShowStock] = useState<boolean>(false)
    const [selectedMedicine, setSelectedMedicine] = useState<string>('')
    const [medicineForm, setMedicineForm] = useState<{
        medicine_name: string;
        description: string[];
        stock: number;
    }>({
        medicine_name: '',
        description: [''],
        stock: 0,
    })

    const getMeds = useCallback(async () => {
        await axios.get('/api/medicine')
        .then(response => {
            const med = response.data?.medicines
            setMedicines(med)
            setMedicineArr(med)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        toast.promise(
            axios.post('/api/medicine', medicineForm),
            {
                pending: 'Creating medicine...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const med = data.data?.medicines
                        setMedicines(med)
                        return 'Success'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError }) {
                        Swal.fire({
                            title: 'Error',
                            text: data.message
                        })
                        return 'Error'
                    }
                }
            }
        )
    }

    useEffect(() => {
        getMeds()
    }, [getMeds])

    const addDescription = () => {
        const temp = [...medicineForm.description]
        temp.push('')
        setMedicineForm({
            ...medicineForm,
            description: temp
        })
    }

    const deleteDescription = (index: number) => {
        const temp = [...medicineForm.description]
        temp.splice(index, 1)
        setMedicineForm({
            ...medicineForm,
            description: temp
        })
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedDescriptions = [...medicineForm.description];
        updatedDescriptions[index] = e.target.value;
        setMedicineForm({ ...medicineForm, description: updatedDescriptions });
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setMedicineForm({
            ...medicineForm,
            [name]: value
        })
    }

    const addStock = (id: string) => {
        setSelectedMedicine(id)
        setShowStock(true)
    }

    const handleStock = (med: Medicine[]) => {
        setMedicines(med)
    }

    const handleSearch = (key: string) => {
        const temp = medicineArr.filter(p => 
            p.medicine_name.toLowerCase().includes(key.toLowerCase()) 
        )
        setMedicines(temp)
    }

    return(
        <div className="w-full flex justify-center items-center">
            <ToastContainer position="bottom-right" />
            <AddStock isHidden={showStock} toggle={()=>setShowStock(!showStock)} medicine={selectedMedicine} setStock={handleStock} />
            <div className={`${showModal ? 'fixed w-full h-full z-10 bg-black/50 backdrop-blur-md left-0 top-0 flex justify-center items-center' : 'hidden'}`}>
                <section className="w-full md:w-96 rounded-lg bg-white p-5">
                    <header className="mb-5 flex justify-between items-center">
                        <h1 className="text-xl font-bold">Add Medicine</h1>
                        <button
                            onClick={()=>setShowModal(false)} 
                            className="p-1 rounded border border-white hover:border-rose-400 hover:text-rose-400 active:ring-2 ring-rose-400"
                        >
                            <MdClose />
                        </button>
                    </header>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full space-y-2">
                            <div className="group w-full">
                                <label htmlFor="medicine_name" className="text-xs font-bold">Medicine:</label>
                                <input 
                                    type="text" 
                                    name="medicine_name" 
                                    id="medicine_name" 
                                    className="w-full p-2 rounded text-sm ring-2 ring-black" 
                                    value={medicineForm.medicine_name}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="group w-full">
                                <label htmlFor="description" className="text-xs font-bold">Description:</label>
                                {
                                    medicineForm.description?.map((med,dx) => {
                                        return(
                                            <div key={dx} className="w-full flex justify-center items-center gap-2 mb-2">
                                                <input 
                                                    type="text" 
                                                    name={`desc${dx}`} 
                                                    id={`desc${dx}`} 
                                                    className="w-full p-2 rounded text-sm ring-2 ring-black" 
                                                    onChange={e=>handleDescriptionChange(e,dx)}
                                                    value={med}
                                                />
                                                {
                                                    dx === 0 ? (
                                                        <button 
                                                            type="button"
                                                            onClick={addDescription} 
                                                            className="p-2 rounded text-white bg-green-400 hover:bg-green-600"
                                                        >
                                                            <MdOutlineAdd className="text-xl" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            type="button"
                                                            onClick={()=>deleteDescription(dx)} 
                                                            className="p-2 rounded text-white bg-rose-400 hover:bg-rose-600"
                                                        >
                                                            <FaTrashAlt className="text-xl" />
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <button className="p-2 rounded text-white text-sm font-bold bg-blue-400 hover:bg-blue-600">submit</button>
                        </div>
                    </form>
                </section>
            </div>
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Medicines</h1>
                    <input type="text" onChange={e=>handleSearch(e.target.value)} className="p-2 text-sm w-1/3 rounded" placeholder="Search" />
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <button 
                            onClick={()=>setShowModal(true)}
                            className="p-2 rounded text-white text-sm font-semibold bg-blue-600 hover:bg-blue-900 active:ring-2 ring-cyan-400 flex gap-2 items-center"
                        >
                            <MdOutlineNoteAdd className="text-xl" />
                            Add
                        </button>
                    </div>
                </header>
                <div className="relative w-full h-96">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Medicine Name</th>
                                <th>Description</th>
                                <th>Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                medicines.map((item,index) => {
                                    return(
                                        <tr key={index}>
                                            <td className="p-2 border-b border-gray-100 font-bold">{item.medicine_name}</td>
                                            <td className="p-2 border-b border-gray-100">{item.description?.map((desc, idx) => {
                                                return (
                                                    <p key={idx}>{desc}</p>
                                                )
                                            })}</td>
                                            <td className="p-2 border-b border-gray-100 font-bold">
                                            {
                                                item.stock > 0 ? (
                                                    <span className="text-teal-900">{item.stock}</span>
                                                ) : (
                                                    <span className="text-rose-900">{item.stock}</span>
                                                )
                                            }
                                            </td>
                                            <td className="p-2 border-b border-gray-100">
                                                <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                    <button 
                                                        onClick={()=>addStock(item._id)}
                                                        className="p-2 rounded text-xs text-white font-bold bg-indigo-600 hover:bg-indigo-900"
                                                    >
                                                        add stock
                                                    </button>
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