'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"
// import { SignOut } from "../utils/SignOut";
import { useRouter } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
// import { useSession } from "next-auth/react";
// import Image from "next/image";

export default function UserNav() {
    // const session = useSession()
    
    const pathname = usePathname()
    const router = useRouter()
    const store = useAuthStore()

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
            <div className="">
                <button onClick={logout} className="text-gray-200 hover:text-white">logout</button>
            </div>
        </div>
    )
}