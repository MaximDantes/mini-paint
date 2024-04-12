'use server'

import type { User } from '@/entities/User'
import { firebaseAdminAuth } from '@/shared/api/firebase-admin'

export const getUsers = async (searchEmail: string) => {
    const users: User[] = []
    let pageToken: string | undefined = 'initial'

    while (users.length < 50 && pageToken) {
        const usersList = await firebaseAdminAuth.listUsers(1000, pageToken === 'initial' ? undefined : pageToken)

        const filteredUsers = usersList.users
            .filter((item) => item.email?.includes(searchEmail))
            .map((item) => ({ uid: item.uid, email: item.email }))

        users.push(...filteredUsers)

        pageToken = usersList.pageToken
    }

    return users
}
