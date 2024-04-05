'use server'

import { getAuth } from 'firebase/auth'
// eslint-disable-next-line boundaries/element-types
import { getFirebaseApp } from '@/shared/api/firebase'

//TODO move to endpoint
//TODO keep authorized
export const getCurrentUser = async () => {
    const auth = getAuth(getFirebaseApp())

    if (!auth.currentUser?.email || !auth.currentUser.uid) throw new Error('not authorized')

    return {
        email: auth.currentUser.email ?? '',
        uid: auth.currentUser.uid ?? '',
    }
}
