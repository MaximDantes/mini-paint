import { FC } from 'react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

type Props = {
    open: boolean
    message: string
    confirmButtonText: string
    onConfirm: () => void
    onCancel: () => void
}

export const Confirm: FC<Props> = ({ open, message, confirmButtonText, onConfirm, onCancel }) => {
    return (
        <Modal onClose={onCancel} open={open}>
            <div className={'w-full h-full flex justify-center items-center'}>
                <div className={'flex flex-col gap-8 bg-gray-900 text-white rounded-3xl p-6 min-w-72 sm:min-w-96'}>
                    <h2 className={'text-2xl text-center'}>{message}</h2>
                    <div className={'flex justify-around'}>
                        <Button autoFocus onClick={onCancel}>
                            cancel
                        </Button>
                        <Button onClick={onConfirm}>{confirmButtonText}</Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
