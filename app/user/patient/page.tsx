'use client'

import PatientForm from "@/app/components/PatientForm"
import { useSession } from "next-auth/react"

export default function Patient() {
    const session = useSession()
    const userData = session.data?.user

    return (
        <div className="w-full flex justify-center items-center py-10 mt-10">
            <PatientForm email_address={userData?.email} />
        </div>
    )
}