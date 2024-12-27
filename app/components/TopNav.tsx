'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { FC } from "react";
import { useAuthStore } from "../stores/auth";

interface TopNavProps {
    toggleMenu: ()=>void;
}

const TopNav: FC<TopNavProps> = ({ toggleMenu }) => {
    const router = useRouter()
    const store = useAuthStore()

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

    return (
        <div className="fixed top-0 right-0 w-full md:w-5/6 bg-zinc-600 z-10 flex justify-between items-center p-2">
            <header>
                <h1 className="text-2xl text-white">Clinic Mangement</h1>
            </header>
            <button onClick={handleLogout} type="button" className="hidden md:block">logout</button>
            <button onClick={()=>toggleMenu()} className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
    )
}

export default TopNav