'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import Link from 'next/link'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { FirebaseErrorCodes } from '@/shared/api/firebase-errors-messages'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type FormData = {
    email: string
    password: string
}

export const SignInForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>()

    const { setUser } = useUserContext()
    const [isPending, setIsPending] = useState(false)

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (isPending) return

        try {
            setIsPending(true)

            const signInResult = await signInWithEmailAndPassword(firebaseAuth, data.email, data.password)

            if (!signInResult.user) return

            setUser(signInResult.user)
        } catch (e) {
            const firebaseError = e as FirebaseError

            switch (firebaseError.code) {
                case FirebaseErrorCodes.invalidEmail:
                    setError('email', { message: 'Invalid email' })
                    break

                case FirebaseErrorCodes.invalidCredential:
                    setError('root', { message: 'Invalid email or password' })
                    break

                default:
                    setError('root', { message: 'Authentication error, try later' })
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-6rem)]'}>
            <form className={'flex flex-col gap-2 w-96'} noValidate onSubmit={handleSubmit(onSubmit)}>
                <Input error={errors.email?.message} placeholder={'Email'} type={'email'} {...register('email')} />

                <Input
                    error={errors.password?.message}
                    placeholder={'Password'}
                    type={'password'}
                    {...register('password')}
                />

                <p className={'text-center text-red-700'}>{errors.root?.message}</p>

                <div className={'flex justify-center gap-2'}>
                    <Button disabled={isPending} type={'submit'}>
                        submit
                    </Button>

                    <Button>
                        <Link href={'/sign-up'}>sign up</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
