import { FC } from 'react'
import { Canvas } from '@/widgets/Canvas'
import { AuthRedirect } from '@/features/AuthRedirect'

export const MainPage: FC = () => {
    return (
        <>
            <AuthRedirect />
            <Canvas />
        </>
    )
}
