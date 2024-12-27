'use client'

import { FormEvent } from "react"
import { SignInWithGoogle } from "../utils/GoogleSignIn"

export default function GoogleSignIn() {
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await SignInWithGoogle()
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" className="p-2 rounded w-full bg-white text-black hover:ring ring-zinc-600">Sign in with Google</button>
        </form>
    )
}