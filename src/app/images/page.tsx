import { FC } from 'react'
import { getPosts, PostCard } from '@/entities/Post'

const Images: FC = async () => {
    const data = await getPosts()

    return (
        <ul className={'flex flex-col gap-2'}>
            {data.map((item) => (
                <li key={item.fileUrl}>
                    <PostCard post={item} />
                </li>
            ))}
        </ul>
    )
}

export default Images
