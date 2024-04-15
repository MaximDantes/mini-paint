'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { FirebaseErrorCodes } from '@/shared/api/firebase-errors-messages'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type FormData = {
    email: string
    password: string
    repeatedPassword: string
}

const validationSchema: ZodType<FormData> = z
    .object({
        email: z.string().email({ message: 'Email is invalid' }),
        password: z.string().min(6, { message: 'Password is too short' }),
        repeatedPassword: z.string(),
    })
    .refine((data) => data.password === data.repeatedPassword, {
        message: "Passwords don't match",
        path: ['repeatedPassword'],
    })

export const SignUpForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>({ resolver: zodResolver(validationSchema) })

    const { setUser } = useUserContext()
    const [isPending, setIsPending] = useState(false)

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (isPending) return

        try {
            setIsPending(true)

            const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)

            setUser(userCredentials.user)
        } catch (e: unknown) {
            const firebaseError = e as FirebaseError

            switch (firebaseError.code) {
                case FirebaseErrorCodes.emailAlreadyInUse:
                    setError('email', { message: 'Email is already in use' })
                    break

                case FirebaseErrorCodes.invalidEmail:
                    setError('email', { message: 'Email is invalid' })
                    break

                default:
                    setError('root', { message: 'Registration error, try later' })
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-6rem)]'}>
            <form
                aria-errormessage={errors.root?.message}
                className={'flex flex-col gap-2 w-96'}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    aria-errormessage={errors.email?.message}
                    error={errors.email?.message}
                    placeholder={'Email'}
                    type={'email'}
                    {...register('email')}
                />

                <Input
                    aria-errormessage={errors.password?.message}
                    error={errors.password?.message}
                    placeholder={'Password'}
                    type={'password'}
                    {...register('password')}
                />

                <Input
                    aria-errormessage={errors.repeatedPassword?.message}
                    error={errors.repeatedPassword?.message}
                    placeholder={'Repeat password'}
                    type={'password'}
                    {...register('repeatedPassword')}
                />

                <p className={'text-center text-red-700'}>{errors.root?.message}</p>

                <div className={'flex justify-center gap-2'}>
                    <Button disabled={isPending} type={'submit'}>
                        submit
                    </Button>
                </div>
            </form>
        </div>
    )
}
