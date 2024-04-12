'use server'

import { firebaseAdminAuth } from '@/shared/api/firebase-admin'

export const getUsers = async (searchEmail: string) => {
    const users = await firebaseAdminAuth.listUsers(100)

    return users.users.filter((item) => item.email?.includes(searchEmail))
}
