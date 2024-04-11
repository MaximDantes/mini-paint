import Link from 'next/link'
import { FC, FormEvent, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type Props = {
    onSubmit: (email: string, password: string) => void
    isSignUp: boolean
    error: string
    setError: (error: string) => void
    isPending: boolean
}

export const AuthForm: FC<Props> = ({ onSubmit, isSignUp, error, setError, isPending }) => {
    const [email, setEmail] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isSignUp && repeatedPassword !== password) {
            setError('Repeated password does not match')
            return
        }

        onSubmit(email, password)
    }

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-6rem)]'}>
            <form className={'flex flex-col gap-2 w-96'} onSubmit={handleSubmit}>
                <h2 className={'text-4xl text-center mb-6'}>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</h2>

                <Input
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder={'Email'}
                    type={'email'}
                    value={email}
                />

                <Input
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    placeholder={'Password'}
                    type={'password'}
                    value={password}
                />

                {isSignUp ? (
                    <Input
                        onChange={(e) => setRepeatedPassword(e.currentTarget.value)}
                        placeholder={'Repeated password'}
                        type={'password'}
                        value={repeatedPassword}
                    />
                ) : null}

                <p className={'text-red-700'}>{error}</p>

                <div className={'flex justify-center gap-2'}>
                    <Button disabled={isPending} type={'submit'}>
                        submit
                    </Button>

                    {!isSignUp ? (
                        <Button>
                            <Link href={'/sign-up'}>sign up</Link>
                        </Button>
                    ) : null}
                </div>
            </form>
        </div>
    )
}
