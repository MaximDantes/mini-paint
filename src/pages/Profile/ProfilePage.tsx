import { FC } from 'react'
import { Profile } from '@/widgets/Profile/Profile'
import { AuthRedirect } from '@/features/AuthRedirect'

export const ProfilePage: FC = () => {
    return (
        <>
            <AuthRedirect />
            <Profile />
        </>
    )
}
