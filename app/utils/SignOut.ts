'use server'

import { signOut } from "@/auth";
// import { signOut } from "next-auth/react";

export async function SignOut() {
    await signOut({ redirect: true, redirectTo: '/' });
    // signOut({ callbackUrl: '/' })
}