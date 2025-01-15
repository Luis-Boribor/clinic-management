'use client'

import { ChangeEvent, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useAuthStore } from "@/app/stores/auth"
import axios from "axios"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function Profile() {
    const [profileImage, setProfileImage] = useState<string>('')
    const store = useAuthStore()

    const getImage = useCallback(async () => {
        const image_url = store.user.profile_image ?? 'default-patient-image.png'

        try {
            const response = await axios.get(`/api/images/patient?fileName=${image_url}`, {
                responseType: 'blob', 
            })
            const imageObj = URL.createObjectURL(response.data)
            setProfileImage(imageObj)
        }  catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error)
            }
        }
    }, [store.user]);

    useEffect(() => {
        getImage()
    }, [getImage])

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const imageObj = URL.createObjectURL(e.target.files[0])
        setProfileImage(imageObj)
        uploadImage(e.target.files[0])
    }

    const uploadImage = async (image: File) => {
        try {
            const uid = store.user._id
            const formData = new FormData()
            formData.append('image', image)
            formData.append('uid', uid)
            const response = toast.promise(
                axios.post('/api/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }),
                {
                    pending: 'Uploading image...',
                    success: 'Image saved',
                    error: 'Error'
                }
            )
            const newProfileImage = (await response).data?.fileName
            store.replaceImage(newProfileImage)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error)
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message ?? error.message,
                    icon: 'error',
                });
            }
        }
    }

    return(
        <div className="flex flex-col py-20 justify-center items-center w-full gap-10">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl bg-zinc-400 p-5">
                <header className="mb-5">
                    <h1 className="text-xl font-semibold">Profile</h1>
                </header>
                <div className="w-full flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
                        <div className="w-40 md:w-60 h-40 md:h-60 border-4 border-gray-300 rounded-full border overflow-hidden flex justify-center items-center mb-5">
                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt="Profile Picture"
                                    width={100}
                                    height={100}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <div className="group">
                            <label 
                                htmlFor="upload" 
                                className="text-xs text-white font-semibold p-2 rounded bg-blue-400 hover:bg-blue-600 cursor-pointer"
                            >
                                choose image
                            </label>
                            <input onChange={handleOnChange} type="file" name="upload" id="upload" className="hidden" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-2">
                        <div className="w-full group">
                            <label htmlFor="email" className="text-xs font-bold">Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="w-full p-2 rounded text-sm" 
                            />
                        </div>
                        <div className="w-full group">
                            <label htmlFor="first_name" className="text-xs font-bold">First Name:</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                id="first_name" 
                                className="w-full p-2 rounded text-sm" 
                            />
                        </div>
                        <div className="w-full group">
                            <label htmlFor="middle_name" className="text-xs font-bold">Middle Name:</label>
                            <input 
                                type="text" 
                                name="middle_name" 
                                id="middle_name" 
                                className="w-full p-2 rounded text-sm" 
                            />
                        </div>
                        <div className="w-full group">
                            <label htmlFor="last_name" className="text-xs font-bold">Last Name:</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                id="last_name" 
                                className="w-full p-2 rounded text-sm" 
                            />
                        </div>
                        <div className="w-full group">
                            <label htmlFor="extension" className="text-xs font-bold">Extension:</label>
                            <input 
                                type="text" 
                                name="extension" 
                                id="extension" 
                                className="w-full p-2 rounded text-sm" 
                            />
                        </div>
                    </div>
                </div>
                <button className="p-2 mt-2 rounded text-sm text-white font-bold bg-slate-600 hover:bg-slate-900">
                    save
                </button>
            </section>
            <section className="w-full md:w-2/3 rounded-lg shadow-xl bg-zinc-400 p-5">
                <header className="mb-5">
                    <h1 className="text-xl font-semibold">Change Password</h1>
                </header>
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
                    <div className="w-full group">
                        <label htmlFor="current_password" className="text-xs font-bold">Current Password:</label>
                        <input 
                            type="password" 
                            name="current_password" 
                            id="current_password" 
                            className="w-full p-2 rounded text-sm" 
                        />
                    </div>
                    <div className="w-full group">
                        <label htmlFor="new_password" className="text-xs font-bold">New Password:</label>
                        <input 
                            type="password" 
                            name="new_password" 
                            id="new_password" 
                            className="w-full p-2 rounded text-sm" 
                        />
                    </div>
                    <div className="w-full group">
                        <label htmlFor="confirm_password" className="text-xs font-bold">Confirm Password:</label>
                        <input 
                            type="password" 
                            name="confirm_password" 
                            id="confirm_password" 
                            className="w-full p-2 rounded text-sm" 
                        />
                    </div>
                </div>
                <button className="p-2 mt-2 rounded text-sm text-white font-bold bg-slate-600 hover:bg-slate-900">save</button>
            </section>
        </div>
    )
}