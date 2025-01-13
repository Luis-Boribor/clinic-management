'use client'

import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface PropState {
    imageUrl: string;
    patientId: string;
}

const ProfileImage: FC<PropState> = ({ imageUrl, patientId }) => {
    const [profileImage, setProfileImage] = useState<string>('')

    const getImage = useCallback(async () => {
        const image_url = imageUrl ?? 'default-patient-image.png'

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
    }, [imageUrl]);

    useEffect(() => {
        getImage();
    }, [getImage]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const imageObj = URL.createObjectURL(e.target.files[0])
        setProfileImage(imageObj)
        uploadImage(e.target.files[0])
    }

    const uploadImage = async (image: File) => {
        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('patient_id', patientId)
            toast.promise(
                axios.post('/api/images/patient', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }),
                {
                    pending: 'Uploading image...',
                    success: 'Image saved',
                    error: 'Error'
                }
            )
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

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-40 h-40 border-4 border-gray-300 rounded-full border overflow-hidden flex justify-center items-center mb-5">
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
            <div className="group max-w-32">
                <label 
                    htmlFor="profile_image" 
                    className="block p-1 rounded text-xs text-center text-white font-bold bg-blue-400 hover:bg-blue-600 cursor-pointer"
                >
                    choose image
                </label>
                <input 
                    onChange={handleOnChange} 
                    type="file" 
                    name="profile_image" 
                    id="profile_image" 
                    className="hidden" 
                />
            </div>
        </div>
    )
}

export default ProfileImage