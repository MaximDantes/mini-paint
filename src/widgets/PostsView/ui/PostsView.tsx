'use client'

import { FC, useState } from 'react'
import { deletePost, getPosts, Post, PostCard } from '@/entities/Post'
import { useUserContext } from '@/entities/User'
import { Button } from '@/shared/ui/Button'

type Props = {
    initialPosts: Post[]
    nextCursor: number
}

export const PostsView: FC<Props> = ({ initialPosts, nextCursor }) => {
    const [posts, setPosts] = useState(initialPosts)
    const [cursor, setCursor] = useState(nextCursor)
    const { user } = useUserContext()

    const fetchNextPosts = async () => {
        if (!user) return

        const response = await getPosts(user.uid, cursor)

        setPosts([...posts, ...response.posts])
        setCursor(response.nextCursor)
    }

    const handleDelete = async (post: Post) => {
        await deletePost(post)

        setPosts(posts.filter((item) => item.id !== post.id))
    }

    return (
        <section>
            <ul className={'grid gap-3 py-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                {posts.map((item) => (
                    <li key={item.fileUrl}>
                        <PostCard deletePost={handleDelete} post={item} />
                    </li>
                ))}
            </ul>

            <Button onClick={fetchNextPosts}>next</Button>
        </section>
    )
}
