import { FC } from 'react'
import { PostsView } from '@/widgets/PostsView'
import { getPosts } from '@/entities/Post'

const Images: FC = async () => {
    const postsData = await getPosts()

    return <PostsView initialPosts={postsData.posts} nextCursor={postsData.nextCursor} />
}

export default Images
