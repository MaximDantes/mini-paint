import { signOut as firebaseSignOut } from 'firebase/auth'
import { firebaseAuth } from '@/shared/api/firebase'

export const signOut = () => {
    firebaseSignOut(firebaseAuth)
}
