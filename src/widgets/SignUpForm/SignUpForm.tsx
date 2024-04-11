'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FC } from 'react'
import { AuthForm } from '@/features/AuthForm'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'

export const SignUpForm: FC = () => {
    const { setUser } = useUserContext()

    const handleSubmit = async (email: string, password: string) => {
        const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password)

        setUser(userCredentials.user)
    }

    return <AuthForm isSignUp={true} onSubmit={handleSubmit} />
}
