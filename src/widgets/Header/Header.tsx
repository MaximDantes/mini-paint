import Link from 'next/link'
import { FC } from 'react'
import { HeaderAuth } from '@/features/HeaderAuth'

export const Header: FC = () => {
    return (
        <header className={'bg-gray-900 p-4'}>
            <div className={'max-w-7xl mx-auto flex justify-between gap-4'}>
                <nav className={'flex gap-4'}>
                    <Link href={'/'}>Main</Link>
                    <Link href={'/images'}>Images</Link>
                </nav>
                <HeaderAuth />
            </div>
        </header>
    )
}
