import { FC } from 'react'
import { Drawer } from '@/widgets/Drawer'
import { AuthRedirect } from '@/features/AuthRedirect'

export const MainPage: FC = () => {
    return (
        <AuthRedirect>
            <Drawer />
        </AuthRedirect>
    )
}
