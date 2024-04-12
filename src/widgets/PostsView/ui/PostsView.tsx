'use client'

import { FC, useState } from 'react'
import { flushSync } from 'react-dom'
import { PostsSearch } from '@/features/PostsSearch'
import { deletePost, getPosts, Post, PostCard } from '@/entities/Post'
import { useUserContext } from '@/entities/User'
import { Button } from '@/shared/ui/Button'
import { Message } from '@/shared/ui/Message'

type Props = {
    initialPosts: Post[]
    nextCursor: number
}

export const PostsView: FC<Props> = ({ initialPosts, nextCursor }) => {
    const [posts, setPosts] = useState(initialPosts)
    const [cursor, setCursor] = useState(nextCursor)

    const [messageOpen, setMessageOpen] = useState(false)
    const [messageError, setMessageError] = useState(true)
    const [messageText, setMessageText] = useState('')

    const { user } = useUserContext()

    const showMessage = (message: string, error?: boolean) => {
        if (messageOpen) {
            flushSync(() => setMessageOpen(false))
        }

        setMessageError(!!error)
        setMessageText(message)
        setMessageOpen(true)
    }

    const fetchNextPosts = async (userId?: string) => {
        if (!user) return

        const response = await getPosts(userId ?? user.uid, cursor)

        setPosts([...posts, ...response.posts])
        setCursor(response.nextCursor)
    }

    const handleDelete = async (post: Post) => {
        try {
            await deletePost(post)

            setPosts(posts.filter((item) => item.id !== post.id))
            showMessage('Successfully deleted')
        } catch (e) {
            showMessage('Error while deleting image', true)
        }
    }

    return (
        <section>
            <PostsSearch />

            <ul className={'grid gap-3 py-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                {posts.map((item) => (
                    <li key={item.fileUrl}>
                        <PostCard deletePost={handleDelete} post={item} />
                    </li>
                ))}
            </ul>

            <Button onClick={() => fetchNextPosts()}>next</Button>

            <Message
                error={messageError}
                message={messageText}
                onClose={() => setMessageOpen(false)}
                open={messageOpen}
            />
        </section>
    )
}
