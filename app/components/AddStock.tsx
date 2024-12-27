'use client'

import axios, { AxiosError, AxiosResponse } from "axios";
import { FC, FormEvent, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface Medicine {
    _id: string;
    medicine_name: string;
    description?: string[];
    stock: number;
    createdAt: Date;
}

interface Props {
    isHidden: boolean;
    toggle: ()=>void;
    setStock: (med: Medicine[])=>void;
    medicine?: string;
}

const AddStock: FC<Props> = ({ isHidden, toggle, medicine, setStock }) => {
    const [quantity, setQuantity] = useState<number>(0)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        toast.promise(
            axios.put(`/api/medicine?medicine_id=${medicine}`, { quantity: quantity }),
            {
                pending: 'Adding stock...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const med = data.data?.medicines
                        setStock(med)
                        setQuantity(0)
                        return 'Added'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError }) {
                        console.log(data)
                        Swal.fire(data.message)
                        return 'Error'
                    }
                }
            }
        )
        await toggle()
    }

    return(
        <div className={`${isHidden ? 'fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50 backdrop-blur-md z-10' : 'hidden'}`}>
            <section className="w-full md:w-96 rounded-lg bg-white p-5">
                <header className="mb-5 w-full flex justify-between items-center">
                    <h1 className="text-xl font-bold">Add Stock</h1>
                    <button onClick={toggle} className="p-1 border border-white hover:border-rose-400 hover:text-rose-400 active:ring-2 ring-rose-400 rounded">
                        <MdClose className="text-xl" />
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full group mb-2">
                        <label htmlFor="quantity" className="text-xs font-bold">Quantity:</label>
                        <input 
                            type="number" 
                            name="quantity" 
                            id="quantity" 
                            className="w-full p-2 text-sm ring-2 ring-black rounded" 
                            value={quantity}
                            onChange={e=>setQuantity(Number(e.target.value))}
                            required
                        />
                    </div>
                    <button className="p-2 rounded text-white text-sm font-bold bg-indigo-600 hover:bg-indigo-900">submit</button>
                </form>
            </section>
        </div>
    )
}

export default AddStock