import Image from 'next/image'
import { FC, useState } from 'react'
import { createPortal } from 'react-dom'
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

    const toggleModal = (open: boolean) => {
        setFullScreen(open)
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

            {fullScreen
                ? createPortal(
                      <dialog
                          className={'w-full h-full bg-black bg-opacity-50 fixed top-0'}
                          onClick={() => toggleModal(false)}
                          open={fullScreen}
                      >
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
                      </dialog>,
                      document.body
                  )
                : null}
        </article>
    )
}
