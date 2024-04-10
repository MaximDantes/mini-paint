'use client'

import Image from 'next/image'
import { FC, useState } from 'react'
import { Post } from '@/entities/Post'
import { Button } from '@/shared/ui/Button'

type Props = {
    post: Post
    deletePost: (postId: Post) => void
}

export const PostCard: FC<Props> = ({ post, deletePost }) => {
    const [fullScreen, setFullScreen] = useState(false)

    const handleDelete = () => {
        //TODO confirm view
        const confirmed = confirm('delete?')

        if (confirmed) {
            deletePost(post)
        }
    }

    return (
        <article className={'flex flex-col justify-between rounded shadow-lg p-2 bg-gray-900 cursor-pointer h-full'}>
            <Image
                alt={`Image posted by ${post.user.uid}`}
                height={512}
                onClick={() => setFullScreen((prev) => !prev)}
                src={post.fileUrl}
                width={512}
            />

            <Button onClick={handleDelete}>delete</Button>

            <h6>Image posted by {post.user.displayName ?? post.user.email}</h6>
            <p>{post.createdAt.toUTCString()}</p>

            {/*TODO portal*/}

            <dialog className={'w-full h-full bg-black bg-opacity-50 fixed top-0'} open={fullScreen}>
                <div className={'flex justify-center items-center h-full'}>
                    <Image
                        alt={`Image posted by ${post.user.displayName ?? post.user.email}`}
                        height={1024}
                        src={post.fileUrl}
                        width={1024}
                    />
                </div>
            </dialog>
        </article>
    )
}
