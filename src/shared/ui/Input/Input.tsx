import { forwardRef, InputHTMLAttributes } from 'react'

type Props = {
    error?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(({ error, className, ...props }, ref) => {
    return (
        <div>
            <input
                className={
                    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 ' +
                    'focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ' +
                    'dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-0 ' +
                    `${error ? 'dark:border-red-700 border-2 ' : ''}` +
                    className
                }
                ref={ref}
                {...props}
            />
            {error ? <p className={'text-red-700'}>{error}</p> : null}
        </div>
    )
})

Input.displayName = 'Input'
