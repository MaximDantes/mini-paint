import { ButtonHTMLAttributes, FC } from 'react'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
    return (
        <button
            type={'button'}
            {...props}
            className={
                'bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase disabled:bg-gray-700 ' +
                'focus:ring-2 focus:bg-blue-700 outline-none '
            }
        >
            {children}
        </button>
    )
}
