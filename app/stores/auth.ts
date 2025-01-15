import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    position: string;
    profile_image: string;
}

interface AuthState {
    user: UserData,
    getUser: (userData: UserData) => void;
    removeUser: ()=>void;
    replaceImage: (image: string) => void;
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
                    profile_image: '',
                },
                getUser: (userData) => set(()=>({ user: userData })),
                removeUser: () => set(()=>({ user: {
                    _id: '',
                    name: '',
                    email: '',
                    role: '',
                    position: '',
                    profile_image: '',
                } })),
                replaceImage: (image) =>
                    set((state) => ({
                        user: { ...state.user, profile_image: image },
                })),
            }),
            {
                name: 'auth-storage',
            }
        )
    )
)