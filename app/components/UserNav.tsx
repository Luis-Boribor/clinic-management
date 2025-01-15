'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function UserNav() {
    const pathname = usePathname()
    const router = useRouter()
    const store = useAuthStore()
    const [profileImage, setProfileImage] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const isActiveLink = (link: string) => {
        return pathname.startsWith(link)
    }

    const logout = async () => {
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

    const toggleMenu = () => {
        setIsOpen(!isOpen)
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

    return (
        <div className="fixed w-full top-0 z-10 flex justify-between items-center bg-zinc-600 p-2">
            <div className="flex justify-center items-center gap-2 md:gap-5 w-full">
                <Link href={'/user/dashboard'} className={`p-1 ${isActiveLink('/user/dashboard') && 'text-rose-900 bg-white'}`}>
                    <MdDashboard className="text-base md:text-2xl 2xl:text-4xl" />
                </Link>
                <Link href={'/user/patient'} className={`p-1 ${isActiveLink('/user/patient') && 'text-rose-900 bg-white'}`}>
                    <RiHealthBookFill className="text-base md:text-2xl 2xl:text-4xl" />
                </Link>
                <Link href={'/user/schedule'} className={`p-1 ${isActiveLink('/user/schedule') && 'text-rose-900 bg-white'}`}>
                    <MdOutlineCalendarMonth className="text-base md:text-2xl 2xl:text-4xl" />
                </Link>
            </div>
            <div className="relative inline-block text-left">
                <button
                    onClick={toggleMenu}
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
                            href="/user/patient"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </a>
                        </li>
                        <li>
                        <a
                            href="/user/schedule"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Schedule
                        </a>
                        </li>
                        <li>
                        <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                        </li>
                    </ul>
                    </div>
                )}
                </div>
        </div>
    )
}