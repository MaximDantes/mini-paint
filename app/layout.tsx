import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Mini Paint',
    description: 'Mini Paint',
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}

export default RootLayout
