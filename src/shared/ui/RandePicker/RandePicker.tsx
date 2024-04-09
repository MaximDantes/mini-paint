import { ChangeEvent, FC } from 'react'
import { Input } from '@/shared/ui/Input'

type Props = {
    value: number
    onChange: (value: number) => void
    label: string
    min?: number
    max?: number
    step?: number
}

export const RangePicker: FC<Props> = ({ value, onChange, label, min, max, step }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const minRange = min ?? -Infinity
        const maxRange = max ?? Infinity

        if (+e.currentTarget.value >= minRange && +e.currentTarget.value <= maxRange) {
            onChange(+e.currentTarget.value)
        }
    }

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                <div className={'flex justify-between items-center gap-2'}>
                    <span>{label}</span>

                    <Input
                        className={'h-1 w-20'}
                        max={max}
                        min={min}
                        onChange={handleChange}
                        step={step}
                        type={'number'}
                        value={value}
                    />
                </div>

                <input
                    className={'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'}
                    max={max}
                    min={min}
                    onChange={handleChange}
                    step={step}
                    type={'range'}
                    value={value}
                />
            </label>
        </div>
    )
}
