'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FC, FormEvent, useState } from 'react'
import { useAuthRedirect, useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

const SignUpPage: FC = () => {
    //TODO extract to modules
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useUserContext()

    useAuthRedirect(true)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        //TODO validation
        const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password)

        setUser(userCredentials.user)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder={'email'}
                type={'email'}
                value={email}
            />
            <Input
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder={'password'}
                type={'password'}
                value={password}
            />
            <Button type={'submit'}>sign up</Button>
        </form>
    )
}

export default SignUpPage
