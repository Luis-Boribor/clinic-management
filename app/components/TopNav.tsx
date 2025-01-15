'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { FC, useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth";
import Image from "next/image";

interface TopNavProps {
    toggleMenu: ()=>void;
}

const TopNav: FC<TopNavProps> = ({ toggleMenu }) => {
    const router = useRouter()
    const store = useAuthStore()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [profileImage, setProfileImage] = useState<string>('')

    const handleLogout = async () => {
        const uid = store.user._id
        await axios.get(`/api/auth/logout?user_id=${uid}`)
        .then(response => {
            store.removeUser()
            console.log(response)
            router.push('/')
        })
        .catch(error => {
            console.log(error)
        })
    }

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
    }, [store.user])

    useEffect(() => {
        getImage()
    }, [getImage])

    const toggleProfile = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="fixed top-0 right-0 w-full md:w-5/6 bg-zinc-600 z-10 flex justify-between items-center p-2">
            <header>
                <h1 className="text-2xl text-white">Clinic Mangement</h1>
            </header>
            {/* <button onClick={handleLogout} type="button" className="hidden md:block">logout</button> */}
            <div className="relative inline-block text-left">
                            <button
                                onClick={toggleProfile}
                                className="flex items-center bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-full overflow-hidden focus:outline-none"
                            >
                                {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt="Profile"
                                    width={40} 
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                                ) : (
                                <span className="text-gray-500 text-sm">No Image</span>
                                )}
                            </button>
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-1">
                                        <li>
                                            <a
                                                href="/admin/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </a>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            </div>
            <button onClick={()=>toggleMenu()} className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
    )
}

export default TopNav