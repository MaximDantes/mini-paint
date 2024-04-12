import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'

const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    }),
}

const createApp = () => {
    if (typeof window !== 'undefined') {
        throw new Error('Firebase admin app can be used only on server')
    }

    return initializeApp(firebaseAdminConfig)
}

const firebaseAdminApp = getApps().length > 0 ? getApp() : createApp()

export const firebaseAdminFirestore = getFirestore(firebaseAdminApp)

export const firebaseAdminAuth = getAuth(firebaseAdminApp)
