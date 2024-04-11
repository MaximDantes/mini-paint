'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import { FC, useState } from 'react'
import { AuthForm } from '@/features/AuthForm'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { firebaseErrorMessages } from '@/shared/api/firebase-errors-messages'

export const SignInForm: FC = () => {
    const { setUser } = useUserContext()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (email: string, password: string) => {
        try {
            setIsPending(true)
            const signInResult = await signInWithEmailAndPassword(firebaseAuth, email, password)

            if (!signInResult.user) return

            setUser(signInResult.user)
        } catch (e) {
            const firebaseError = e as FirebaseError

            setError(firebaseErrorMessages[firebaseError.code] ?? firebaseError.message)
        } finally {
            setIsPending(false)
        }
    }

    return <AuthForm error={error} isPending={isPending} isSignUp={false} onSubmit={handleSubmit} setError={setError} />
}
