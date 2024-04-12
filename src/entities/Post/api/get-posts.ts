'use server'

import { Timestamp } from 'firebase/firestore'
import { Post } from '@/entities/Post'
import { firebaseAdminAuth, firebaseAdminFirestore } from '@/shared/api/firebase-admin'

export const getPosts = async (userUid: string, cursor?: number): Promise<{ posts: Post[]; nextCursor: number }> => {
    let collectionRef = firebaseAdminFirestore
        .collection('images')
        .where('userUid', '==', userUid)
        .orderBy('createdAt', 'desc')

    if (cursor === -1) return { posts: [], nextCursor: -1 }

    if (cursor) {
        collectionRef = collectionRef.startAfter(new Date(cursor))
    }

    const snapshot = await collectionRef.limit(4).get()

    const responses = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const postData = doc.data() as Omit<Post, 'createdAt' | 'user'> & {
                createdAt: Timestamp
                userUid: string
            }

            const user = await firebaseAdminAuth.getUser(postData.userUid)

            return {
                id: doc.id,
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                fileUrl: postData.fileUrl,
                createdAt: new Date(postData.createdAt.seconds * 1000),
            } as Post
        })
    )

    const posts = await Promise.all(responses)

    const nextCursor = posts[posts.length - 1]?.createdAt.getTime() || -1

    return { posts, nextCursor }
}
