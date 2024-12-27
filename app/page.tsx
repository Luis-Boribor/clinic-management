'use client'

import Image from "next/image";
import logo from "@/assets/images/sorsu-logo.png";
import { FormEvent, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuthStore } from "./stores/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  position: string;
}

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()
  const store = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = toast.promise<AxiosResponse<any>>(
        axios.post('/api/auth/sign-in', {
          email: email,
          password: password,
        }),
        {
          pending: 'Logging in...',
          success: 'Logged in',
          error: 'Error'
        }
      )
      const user: User = (await response).data?.user
      store.getUser(user)
      if (user?.role==='admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
          Swal.fire({
              title: 'Sign In Error',
              text: error.response?.data?.message ?? error.message,
              icon: 'error',
          });
      }
  }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-zinc-600">
      <ToastContainer />
      <section className="w-full md:w-1/2">
        <div className="w-full flex flex-col justify-center items-center">
          <Image src={logo} alt="logo" width={100} height={100} />
          <h1 className="text-2xl text-white font-bold">Clinic Management App</h1>
          <p className="text-xl text-white">SORSOGON STATE UNIVERSITY BULAN CAMPUS</p>
        </div>
      </section>
      <section className="w-96 p-5 rounded-lg shadow-xl bg-red-900 text-white">
        <div className="">
          <p className="text-xl text-center">Login your account</p>
          <form onSubmit={handleSubmit}>
            <div className="w-full px-5 pt-5 space-y-2">
              <input 
                type="text" 
                name="email" 
                id="email" 
                className="w-full p-2 rounded bg-white/80 border border-white placeholder:text-white text-black" 
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                name="password" 
                id="password" 
                className="w-full p-2 rounded bg-white/80 border border-white placeholder:text-white text-black" 
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
              <button type="submit" className="w-full p-2 text-black shadow-md bg-gray-300 hover:bg-gray-400 border border-black">Sign in</button>
            </div>
          </form>
        </div>
        <div className="w-full p-5">
          <div className="flex items-center mb-5">
            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
            <div className="flex-grow-0 mx-5 text dark:text-white">or</div>
            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
          </div>
          <div className="space-y-2">
            {/* <GoogleSignIn /> */}
            <Link href={'/sign-up'} className="p-2 w-full block text-center text-black shadow-md bg-gray-300 hover:bg-gray-400 border border-black">Sign up</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
