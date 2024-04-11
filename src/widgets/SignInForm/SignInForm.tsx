'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { FC } from 'react'
import { AuthForm } from '@/features/AuthForm'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'

export const SignInForm: FC = () => {
    const { setUser } = useUserContext()

    const handleSubmit = async (email: string, password: string) => {
        const signInResult = await signInWithEmailAndPassword(firebaseAuth, email, password)

        if (!signInResult.user) return

        setUser(signInResult.user)
    }

    return <AuthForm isSignUp={false} onSubmit={handleSubmit} />
}
