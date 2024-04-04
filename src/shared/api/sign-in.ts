'use server'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseApp } from '@/shared/api/firebase'
export const signIn = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp())

    return await signInWithEmailAndPassword(auth, email, password)
}
