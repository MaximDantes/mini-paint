import Link from 'next/link'
import { FC } from 'react'
import { HeaderAuth } from '@/features/HeaderAuth'

export const Header: FC = () => {
    return (
        <header className={'bg-gray-900 p-4 flex justify-between'}>
            <nav>
                <Link href={'/'}>Main</Link>
            </nav>
            <HeaderAuth />
        </header>
    )
}
