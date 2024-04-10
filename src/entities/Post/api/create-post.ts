import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { firebaseAuth, firebaseFirestore, firebaseStorage } from '@/shared/api/firebase'

export const createPost = async (dataUrl: string) => {
    if (!firebaseAuth.currentUser) throw new Error('Not authorized')

    const userUid = firebaseAuth.currentUser.uid

    const storageRef = ref(firebaseStorage, 'image' + userUid + Date.now())

    const uploadedImage = await uploadString(storageRef, dataUrl, 'data_url')

    const downloadUrl = await getDownloadURL(uploadedImage.ref)

    const post = await addDoc(collection(firebaseFirestore, 'images'), {
        userUid: userUid,
        fileUrl: downloadUrl,
        createdAt: serverTimestamp(),
    })

    return post
}
