import Image from 'next/image'
import { FC, useState } from 'react'
import { Post } from '@/entities/Post'
import { Button } from '@/shared/ui/Button'
import { Confirm } from '@/shared/ui/Confirm'
import { Modal } from '@/shared/ui/Modal'

type Props = {
    post: Post
    deletePost: (postId: Post) => void
}

export const PostCard: FC<Props> = ({ post, deletePost }) => {
    const [fullScreen, setFullScreen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDelete = () => {
        setConfirmOpen(true)
    }

    const toggleModal = (open: boolean) => {
        setFullScreen(open)
    }

    const handleConfirm = () => {
        deletePost(post)
        setConfirmOpen(false)
    }

    return (
        <article
            className={
                'flex flex-col items-center justify-between rounded shadow-lg p-2 bg-gray-900 cursor-pointer h-full'
            }
        >
            <h6 className={'self-start'}>{post.user.displayName ?? post.user.email}</h6>

            <Image
                alt={`Image posted by ${post.user.uid}`}
                height={512}
                onClick={() => toggleModal(true)}
                src={post.fileUrl}
                width={512}
            />

            <p className={'self-end'}>{post.createdAt.toDateString()}</p>

            <Modal onClose={() => setFullScreen(false)} open={fullScreen}>
                <div className={'flex justify-center items-center h-full relative'}>
                    <Image
                        alt={`Image posted by ${post.user.displayName ?? post.user.email}`}
                        height={1024}
                        src={post.fileUrl}
                        width={1024}
                    />

                    <div className={'absolute right-2 top-2'}>
                        <Button onClick={handleDelete}>delete</Button>
                    </div>
                </div>
            </Modal>

            <Confirm
                confirmButtonText={'delete'}
                message={'Delete this post?'}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                open={confirmOpen}
            />
        </article>
    )
}
