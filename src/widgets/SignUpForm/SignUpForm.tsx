'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import { FC, useRef, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { FirebaseErrorCodes } from '@/shared/api/firebase-errors-messages'
import { BaseForm, SetErrorRef } from '@/shared/ui/BaseForm'
import { Button } from '@/shared/ui/Button'
import { FormError } from '@/shared/ui/FormError'
import { FormInput } from '@/shared/ui/FormInput'

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

const defaultValues: FormData = {
    email: '',
    password: '',
    repeatedPassword: '',
}

export const SignUpForm: FC = () => {
    const { setUser } = useUserContext()
    const [isPending, setIsPending] = useState(false)

    const setFormErrorRef = useRef<SetErrorRef<FormData>>(null)

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
                    setFormErrorRef.current?.setError('email', { message: 'Email is already in use' })
                    break

                case FirebaseErrorCodes.invalidEmail:
                    setFormErrorRef.current?.setError('email', { message: 'Email is invalid' })
                    break

                default:
                    setFormErrorRef.current?.setError('root', { message: 'Registration error, try later' })
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-6rem)]'}>
            <BaseForm
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                ref={setFormErrorRef}
                validationSchema={validationSchema}
            >
                <FormInput name={'email'} placeholder={'Email'} type={'email'} />

                <FormInput name={'password'} placeholder={'Password'} type={'password'} />

                <FormInput name={'repeatedPassword'} placeholder={'Repeat password'} type={'password'} />

                <FormError />

                <div className={'flex justify-center gap-2'}>
                    <Button disabled={isPending} type={'submit'}>
                        submit
                    </Button>
                </div>
            </BaseForm>
        </div>
    )
}
