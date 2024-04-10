'use client'

import { FC, useState } from 'react'
import { getPosts, Post, PostCard } from '@/entities/Post'
import { Button } from '@/shared/ui/Button'

type Props = {
    initialPosts: Post[]
    nextCursor: number
}

export const PostsView: FC<Props> = ({ initialPosts, nextCursor }) => {
    const [posts, setPosts] = useState(initialPosts)
    const [cursor, setCursor] = useState(nextCursor)

    const fetchNextPosts = async () => {
        const response = await getPosts(cursor)

        setPosts([...posts, ...response.posts])
        setCursor(response.nextCursor)
    }

    return (
        <section>
            <ul className={'grid gap-2 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                {posts.map((item) => (
                    <li key={item.fileUrl}>
                        <PostCard post={item} />
                    </li>
                ))}
            </ul>

            <Button onClick={fetchNextPosts}>next</Button>
        </section>
    )
}
