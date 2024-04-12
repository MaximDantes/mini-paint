import { FC, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
    open: boolean
    onClose: () => void
    children: ReactNode
}

export const Modal: FC<Props> = ({ children, open, onClose }) => {
    useEffect(() => {
        if (open) {
            document.body.classList.add('overflow-hidden')
        }

        return () => document.body.classList.remove('overflow-hidden')
    }, [open])

    const modal = (
        <dialog className={'w-full h-full bg-black bg-opacity-50 fixed top-0'} onClick={onClose} open={open}>
            {children}
        </dialog>
    )

    return open ? createPortal(modal, document.body) : null
}
