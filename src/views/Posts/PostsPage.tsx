import { FC } from 'react'
import { PostsView } from '@/widgets/PostsView'
import { AuthRedirect } from '@/features/AuthRedirect'
import { getPosts } from '@/entities/Post'

type Props = {
    params: {
        slug: string
    }
}

export const PostsPage: FC<Props> = async ({ params }) => {
    const postsData = await getPosts(params.slug)

    return (
        <AuthRedirect>
            <PostsView initialPosts={postsData.posts} nextCursor={postsData.nextCursor} />
        </AuthRedirect>
    )
}
