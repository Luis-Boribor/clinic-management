import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    position: string;
}

interface AuthState {
    user: UserData,
    getUser: (userData: UserData) => void;
    removeUser: ()=>void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: {
                    _id: '',
                    name: '',
                    email: '',
                    role: '',
                    position: '',
                },
                getUser: (userData) => set(()=>({ user: userData })),
                removeUser: () => set(()=>({ user: {
                    _id: '',
                    name: '',
                    email: '',
                    role: '',
                    position: ''
                } }))
            }),
            {
                name: 'auth-storage',
            }
        )
    )
)