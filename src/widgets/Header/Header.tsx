import { FC } from 'react'
import { HeaderAuth } from '@/features/HeaderAuth'
import { HeaderNav } from '@/features/HeaderNav'

export const Header: FC = () => {
    return (
        <header className={'bg-gray-900 p-4'}>
            <div className={'max-w-7xl mx-auto flex justify-between gap-4'}>
                <HeaderNav />

                <HeaderAuth />
            </div>
        </header>
    )
}
