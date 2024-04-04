'use server'

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getFirebaseApp } from '@/shared/api/firebase'

export const signUp = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp())

    return await createUserWithEmailAndPassword(auth, email, password)
}
