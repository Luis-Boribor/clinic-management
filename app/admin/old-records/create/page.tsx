'use client'

import Link from "next/link"
import RecordsForm from '@/app/components/RecordsForm'

export default function Create() {
    
    return(
        <div className="w-full flex justify-center items-center">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl bg-zinc-400 p-5">
                <header className="mb-5">
                    <div className="flex items-center gap-2">
                        <Link href={'/admin/dashboard'} className="p-2 rounded text-white text-sm bg-blue-600 hover:bg-blue-900">back</Link>
                        <h1 className="text-xl font-semibold">Manage Old Records</h1>
                    </div>
                </header>
                <RecordsForm />
            </section>
        </div>
    )
}