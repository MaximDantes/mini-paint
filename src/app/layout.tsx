import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import { UserContext } from '@/app/(context)'
import { Header } from '@/widgets/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Mini Paint',
    description: 'Mini Paint',
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang="en">
            <body className={inter.className}>
                <UserContext>
                    <Header />

                    <main className={'p-4'}>
                        <div className={'max-w-7xl mx-auto'}>{children}</div>
                    </main>
                </UserContext>
            </body>
        </html>
    )
}

export default RootLayout
