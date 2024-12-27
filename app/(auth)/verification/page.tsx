'use client'

import { useAuthStore } from "@/app/stores/auth";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

export default function Verification() {
    const [verificationCode, setVerificationCode] = useState<string>('')
    const store = useAuthStore()
    const router = useRouter()
    const [countdown, setCountdown] = useState<number>(5 * 60); 
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
  
    useEffect(() => {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        setIsDisabled(false)
      }
    }, [countdown])

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    const verifyAccount = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const uid = store.user._id
            const response = toast.promise(
                axios.put(`/api/auth/otp-verification?user_id=${uid}`, { code_pass: verificationCode }),
                {
                    pending: 'Verifying...',
                    success: 'Success',
                    error: 'Error'
                }
            )
            const user = (await response).data?.user
            store.getUser(user)
            router.push('/user/dashboard')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error)
                Swal.fire({
                    title: 'Email Verification Error',
                    text: error.response?.data?.message ?? error.message,
                    icon: 'error',
                });
            }
        }
    }

    const resendVerificationCode = async () => {
        setCountdown(5*60)
        toast.promise(
            axios.post('/api/auth/otp-verification', { user: store.user.name, email: store.user.email }),
            {
                pending: 'Resending OTP...',
                success: 'OTP Sent',
                error: {
                    render({ data }: { data: AxiosError<{message: string}> }) {
                        console.log(data)
                        Swal.fire({
                            title: 'OTP Resend Error',
                            text: data.response?.data?.message ?? data.message,
                            icon: 'error'
                        })
                        return 'Error'
                    }
                }
            }   
        )
    }

    return(
        <div className="w-full min-h-screen flex justify-center items-center bg-zinc-600">
            <ToastContainer />
            <section className="w-full md:w-3/5 rounded-lg shadow-xl p-10 bg-red-900">
                <header className="mb-5 text-white">
                    <h1 className="text-2xl font-bold">Account Verification</h1>
                    <p className="font-semibold">
                        Please verify your account with a one-time password we have sent to your email.
                    </p>
                </header>
                <form onSubmit={verifyAccount}>
                    <div className="space-y-2 w-full">
                        <input 
                            type="text" 
                            name="verification_code" 
                            id="verification_code" 
                            className="w-full p-2 rounded text-sm" 
                            onChange={(e)=>setVerificationCode(e.target.value)}
                            placeholder="Verification Code"
                            required
                        />
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded text-xs text-white font-bold bg-blue-400 hover:bg-blue-600">
                                submit
                            </button>
                            <button type="button" onClick={resendVerificationCode} disabled={isDisabled} className="p-2 rounded text-xs text-white font-bold bg-indigo-400 hover:bg-indigo-600">
                                resend <span>{isDisabled && formatTime(countdown)}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}