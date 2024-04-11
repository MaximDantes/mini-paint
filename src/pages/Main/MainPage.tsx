import { FC } from 'react'
import { AuthRedirect } from '@/features/AuthRedirect'
import { Drawer } from '../../widgets/Drawer'

export const MainPage: FC = () => {
    return (
        <>
            <AuthRedirect />
            <Drawer />
        </>
    )
}
