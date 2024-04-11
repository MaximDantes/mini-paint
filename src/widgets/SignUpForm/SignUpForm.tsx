'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import { FC, useState } from 'react'
import { AuthForm } from '@/features/AuthForm'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { firebaseErrorMessages } from '@/shared/api/firebase-errors-messages'

export const SignUpForm: FC = () => {
    const { setUser } = useUserContext()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (email: string, password: string) => {
        try {
            if (password.length < 6) {
                throw new Error('Password should be at least 6 characters')
            }

            setIsPending(true)

            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password)

            setUser(userCredentials.user)
        } catch (e: unknown) {
            const firebaseError = e as FirebaseError

            setError(firebaseErrorMessages[firebaseError.code] ?? firebaseError.message)
        } finally {
            setIsPending(false)
        }
    }

    return <AuthForm error={error} isPending={isPending} isSignUp={true} onSubmit={handleSubmit} setError={setError} />
}
