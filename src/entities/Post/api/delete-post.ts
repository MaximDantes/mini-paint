import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { Post } from '@/entities/Post'
import { firebaseAuth, firebaseFirestore, firebaseStorage } from '@/shared/api/firebase'

export const deletePost = async (post: Post) => {
    if (post.userUid !== firebaseAuth.currentUser?.uid) throw new Error('You can delete only your images')

    const fileRef = ref(firebaseStorage, post.fileUrl)

    await deleteObject(fileRef)

    await deleteDoc(doc(firebaseFirestore, 'images', post.id))
}
