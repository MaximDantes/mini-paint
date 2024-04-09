import { ChangeEvent, FC } from 'react'

type Props = {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    label: string
}

export const ColorPicker: FC<Props> = ({ value, onChange, label }) => {
    return (
        <label className={'flex justify-between items-center gap-2 text-gray-900 text-sm dark:text-white'}>
            <span>{label}</span>
            <input
                className={
                    'p-1 h-10 w-16 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 ' +
                    'disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700'
                }
                onChange={onChange}
                title={label}
                type={'color'}
                value={value}
            />
        </label>
    )
}
