'use client'

import Image from 'next/image'
import { FC, useState } from 'react'
import { deletePost, Post } from '@/entities/Post'
import { Button } from '@/shared/ui/Button'

export const PostCard: FC<{ post: Post }> = ({ post }) => {
    const [fullScreen, setFullScreen] = useState(false)

    return (
        <article
            className={'flex flex-col justify-between rounded shadow-lg p-2 bg-gray-900 cursor-pointer h-full'}
            onClick={() => setFullScreen((prev) => !prev)}
        >
            <Image alt={`Image posted by ${post.userUid}`} height={512} src={post.fileUrl} width={512} />
            <Button onClick={() => deletePost(post)}>delete</Button>
            <h6>leaked{post.userUid}</h6>

            {/*TODO portal*/}

            <dialog className={'w-full h-full bg-black bg-opacity-50 fixed top-0'} open={fullScreen}>
                <div className={'flex justify-center items-center h-full'}>
                    <Image alt={`Image posted by ${post.userUid}`} height={'1024'} src={post.fileUrl} width={1024} />
                </div>
            </dialog>
        </article>
    )
}
