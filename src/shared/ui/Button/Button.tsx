import { ButtonHTMLAttributes, FC } from 'react'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
    return (
        <button
            type={'button'}
            {...props}
            className={'bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}
        >
            Button
        </button>
    )
}
