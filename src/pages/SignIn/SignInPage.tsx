import { FC } from 'react'
import { SignInForm } from '@/widgets/SignInForm'
import { AuthRedirect } from '@/features/AuthRedirect'

export const SignInPage: FC = () => {
    return (
        <AuthRedirect toMainPage>
            <SignInForm />
        </AuthRedirect>
    )
}
