'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase-admin'
import Link from 'next/link'
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
}

const validationSchema: ZodType<FormData> = z.object({
    email: z.string(),
    password: z.string(),
})

const defaultValues: FormData = {
    email: '',
    password: '',
}

export const SignInForm: FC = () => {
    const { setUser } = useUserContext()
    const [isPending, setIsPending] = useState(false)

    const setFormErrorRef = useRef<SetErrorRef<FormData>>(null)

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
                    setFormErrorRef.current?.setError('email', { message: 'Invalid email' })
                    break

                case FirebaseErrorCodes.invalidCredential:
                    setFormErrorRef.current?.setError('root', { message: 'Incorrect email or password' })
                    break

                default:
                    setFormErrorRef.current?.setError('root', { message: 'Authentication error, try later' })
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

                <FormError />

                <div className={'flex justify-center gap-2'}>
                    <Button disabled={isPending} type={'submit'}>
                        submit
                    </Button>

                    <Button>
                        <Link href={'/sign-up'}>sign up</Link>
                    </Button>
                </div>
            </BaseForm>
        </div>
    )
}
