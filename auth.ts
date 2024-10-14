import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(dbConnect),
    providers: [
        Google({
            profile(profile) {
                return { role: profile.role ?? "user", ...profile }
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/user')) {
                return baseUrl
            } 
            return baseUrl + '/user/dashboard'
        },
    }
})