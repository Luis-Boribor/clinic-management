'use client'

import axios from "axios";
import { FC, FormEvent, useState } from "react";
import { MdClose } from "react-icons/md";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { toast } from "react-toastify";

interface Props {
    isHidden: boolean;
    toggle: ()=>void;
    medicines: IMedicine[] | [];
    record?: string;
}

interface Medicine {
    medicine: { id: string, quantity: number, dosage: number, dosage_unit: string, dosage_total: number }[];
    record: string;
}

interface IMedicine {
    _id: string;
    medicine_name: string;
    quantity: number;
}

const MedicineDispenser: FC<Props> = ({ isHidden, toggle, medicines, record }) => {
    const [medicineForm, setMedicineForm] = useState<Medicine>({
        medicine: [{ id: '', quantity: 0, dosage: 0, dosage_unit: '', dosage_total: 0 }],
        record: record ?? '',
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await axios.post('/api/medicine-dispensed', {
            medicine: medicineForm.medicine,
            record: record
        })
        .then(() => {
            toast.success('Success')
            setMedicineForm({
                medicine: [{ id: '', quantity: 0, dosage: 0, dosage_unit: '', dosage_total: 0 }],
                record: '',
            })
            toggle()
        })
        .catch(error => {
            console.log(error)
            toast.error('Error')
        })
    }

    const addItem = () => {
        setMedicineForm((prevForm) => ({
            ...prevForm,
            medicine: [...prevForm.medicine, { id: '', quantity: 0, dosage: 0, dosage_unit: '', dosage_total: 0 }],
        }));
    };
    
    const deleteItem = (index: number) => {
        setMedicineForm((prevForm) => ({
            ...prevForm,
            medicine: prevForm.medicine.filter((_, idx) => idx !== index),
        }));
    };

    const handleMedicineChange = (index: number, key: 'id' | 'quantity' | 'dosage' | 'dosage_unit' | 'dosage_total', value: string | number) => {
        setMedicineForm((prevForm) => {
            const updatedMedicine = [...prevForm.medicine];
            updatedMedicine[index] = { ...updatedMedicine[index], [key]: value };
            return { ...prevForm, medicine: updatedMedicine };
        });
    }

    return(
        <div className={`${isHidden ? 'hidden' : 'w-full h-full fixed top-0 left-0 bg-black/50 backdrop-blur-md z-10 flex justify-center items-center'}`}>
            <section className="w-full md:w-[550px] rounded-lg bg-white p-5">
                <header className="mb-5 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dispense Medicine</h1>
                    <button onClick={toggle} className="p-1 rounded border border-white hover:border-rose-400 hover:text-rose-400 active:ring-2 ring-rose-400">
                        <MdClose />
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full mb-2">
                        {/* <label htmlFor="medicine_name" className="text-xs font-bold">Medicine:</label> */}
                        {
                            medicineForm.medicine.map((med, index) => {
                                const availableMedicines = medicines.filter(
                                    (item) =>
                                        !medicineForm.medicine.some(
                                            (selectedMed, idx) => selectedMed.id === item._id && idx !== index
                                        )
                                );

                                return (
                                    <div key={index} className="w-full flex justify-center items-center gap-2 mb-2">
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-xs font-bold">Medicine:</label>
                                            <select
                                                className="p-2 rounded ring-2 ring-black text-sm w-full"
                                                value={med.id}
                                                onChange={(e) =>
                                                    handleMedicineChange(index, 'id', e.target.value)
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select a medicine
                                                </option>
                                                {availableMedicines.map((item) => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.medicine_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-1/3 flex flex-col">
                                            <label htmlFor="" className="text-xs font-bold">Quantity:</label>
                                            <input
                                                type="number"
                                                className="p-2 rounded ring-2 ring-black text-sm w-full"
                                                value={med.quantity}
                                                onChange={(e) =>
                                                    handleMedicineChange(index, 'quantity', parseInt(e.target.value, 10))
                                                }
                                            />
                                        </div>
                                        <div className="w-1/3 flex flex-col">
                                            <label htmlFor={`dosage${index}`} className="text-xs font-bold">Dosage:</label>
                                            <input 
                                                type="number" 
                                                value={med.dosage} 
                                                onChange={e=>
                                                    handleMedicineChange(index, 'dosage', parseInt(e.target.value, 10))
                                                } 
                                                className="p-2 rounded ring-2 ring-black text-sm w-full" 
                                            />
                                        </div>
                                        <div className="w-1/3 flex flex-col">
                                            <label htmlFor={`unit${index}`} className="text-xs font-bold">Unit:</label>
                                            <input 
                                                type="text" 
                                                className="p-2 rounded ring-2 ring-black text-sm w-full" 
                                                value={med.dosage_unit}
                                                onChange={e=>
                                                    handleMedicineChange(index, 'dosage_unit', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="w-1/3 flex flex-col">
                                            <label htmlFor={`total${index}`} className="text-xs font-bold">Recommended:</label>
                                            <input 
                                                type="number"  
                                                className="p-2 rounded ring-2 ring-black text-sm w-full" 
                                                value={med.dosage_total}
                                                onChange={e=>
                                                    handleMedicineChange(index, 'dosage_total', parseInt(e.target.value, 10))
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="" className="text-xs font-bold">Action</label>
                                            {index === 0 ? (
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="p-2 rounded text-white bg-green-400 hover:bg-green-600"
                                            >
                                                <IoMdAdd className="text-xl" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => deleteItem(index)}
                                                className="p-2 rounded text-white bg-rose-400 hover:bg-rose-600"
                                            >
                                                <IoMdTrash className="text-xl" />
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                );
                            })
                        }

                    </div>
                    <button className="p-2 rounded text-white text-sm font-bold bg-indigo-400 hover:bg-indigo-600">submit</button>
                </form>
            </section>
        </div>
    )
}

export default MedicineDispenser