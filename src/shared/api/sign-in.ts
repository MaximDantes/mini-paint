'use server'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseApp } from '@/shared/api/firebase'
export const signIn = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp())

    const result = await signInWithEmailAndPassword(auth, email, password)

    return { email: result.user.email, uid: result.user.uid }
}
