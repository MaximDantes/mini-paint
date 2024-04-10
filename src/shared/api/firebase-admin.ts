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

const firebaseAdminApp = getApps().length > 0 ? getApp() : initializeApp(firebaseAdminConfig)

export const firebaseAdminFirestore = getFirestore(firebaseAdminApp)

export const firebaseAdminAuth = getAuth(firebaseAdminApp)
