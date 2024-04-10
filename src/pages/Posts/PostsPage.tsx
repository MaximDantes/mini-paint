import { FC } from 'react'
import { PostsView } from '@/widgets/PostsView'
import { AuthRedirect } from '@/features/AuthRedirect'
import { getPosts } from '@/entities/Post'

export const PostsPage: FC = async () => {
    const postsData = await getPosts()

    return (
        <>
            <AuthRedirect />

            <PostsView initialPosts={postsData.posts} nextCursor={postsData.nextCursor} />
        </>
    )
}
