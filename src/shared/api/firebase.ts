import { getAuth } from 'firebase/auth'
import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)

export { firebaseApp, firebaseAuth }
