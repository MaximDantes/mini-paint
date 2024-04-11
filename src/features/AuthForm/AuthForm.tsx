import Link from 'next/link'
import { FC, FormEvent, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type Props = {
    onSubmit: (email: string, password: string) => void
    isSignUp: boolean
}

export const AuthForm: FC<Props> = ({ onSubmit, isSignUp }) => {
    //TODO remove initial
    const [email, setEmail] = useState('mfetisov2002@gmail.com')
    const [password, setPassword] = useState('111111')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSubmit(email, password)
    }

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-6rem)]'}>
            <form className={'flex flex-col gap-2 w-96'} onSubmit={handleSubmit}>
                <Input onChange={(e) => setEmail(e.currentTarget.value)} type={'email'} value={email} />
                <Input onChange={(e) => setPassword(e.currentTarget.value)} type={'password'} value={password} />

                <div className={'flex gap-2 mt-3'}>
                    <Button type={'submit'}>{isSignUp ? 'sign un' : 'sign in'}</Button>
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
