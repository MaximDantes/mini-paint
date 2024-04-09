import { FC } from 'react'
import { getPosts, PostCard } from '@/entities/Post'

const Images: FC = async () => {
    const data = await getPosts()

    return (
        <ul className={'grid gap-2 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
            {data.map((item) => (
                <li key={item.fileUrl}>
                    <PostCard post={item} />
                </li>
            ))}
        </ul>
    )
}

export default Images
