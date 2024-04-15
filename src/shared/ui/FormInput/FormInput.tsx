import { FC, InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'

type Props = {
    name: string
} & InputHTMLAttributes<HTMLInputElement>

export const FormInput: FC<Props> = ({ name, ...props }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const error = errors[name]?.message as string

    return <Input aria-errormessage={error} error={error} {...props} {...register(name)} />
}
