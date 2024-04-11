import { FC } from 'react'
import { SignUpForm } from '@/widgets/SignUpForm'
import { AuthRedirect } from '@/features/AuthRedirect'

export const SignUpPage: FC = () => {
    return (
        <AuthRedirect toMainPage={true}>
            <SignUpForm />
        </AuthRedirect>
    )
}
