import { signOut as firebaseSignOut } from 'firebase/auth'
import { firebaseAuth } from '@/shared/api/firebase'
//TODO remove
export const signOut = () => {
    firebaseSignOut(firebaseAuth)
}
