import Image from 'next/image'
import { FC } from 'react'
import { Post } from '@/entities/Post'

export const PostCard: FC<{ post: Post }> = ({ post }) => {
    return (
        <article className={'max-w-sm rounded shadow-lg p-2 bg-gray-900 cursor-pointer'}>
            <div className={'relative w-full h-64'}>
                <Image alt={`Image posted by ${post.userUid}`} fill objectFit={'contain'} src={post.fileUrl} />
            </div>
            <h6>{post.userUid}</h6>
        </article>
    )
}
