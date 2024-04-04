import { FirebaseApp, initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
}

let firebaseApp: FirebaseApp

export const getFirebaseApp = () => {
    if (typeof window !== 'undefined') {
        throw new Error('Firebase must be used only on server side')
    }

    if (!firebaseApp) {
        firebaseApp = initializeApp(firebaseConfig)
    }

    return firebaseApp
}
