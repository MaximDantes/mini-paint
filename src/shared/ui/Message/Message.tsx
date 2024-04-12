import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
    message: string
    open: boolean
    onClose: () => void
    error?: boolean
}

export const Message: FC<Props> = ({ message, open, onClose, error }) => {
    useEffect(() => {
        if (!open) return

        const timeout = setTimeout(() => {
            onClose()
        }, 5100)

        return () => clearTimeout(timeout)
    }, [onClose, open])

    const element = (
        <div className={'fixed bottom-0 m-4'}>
            <div
                className={
                    'animate-show-message p-4 bg-gray-600 rounded-xl font-semibold' + (error ? ' bg-red-600' : '')
                }
            >
                <h4>{message}</h4>
            </div>
        </div>
    )

    return open ? createPortal(element, document.body) : null
}
