import { collection, getDocs, query } from 'firebase/firestore'
import { Post } from '@/entities/Post'
import { firebaseFirestore } from '@/shared/api/firebase'

export const getPosts = async () => {
    const imagesCollection = collection(firebaseFirestore, 'images')
    const q = query(imagesCollection)

    const querySnapshot = await getDocs(q)

    const data: Post[] = []

    querySnapshot.forEach((doc) => {
        const postData = doc.data() as Post

        data.push({
            id: doc.id,
            userUid: postData.userUid,
            fileUrl: postData.fileUrl,
        })
    })

    return data
}
