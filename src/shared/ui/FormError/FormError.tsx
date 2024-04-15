import { useFormContext } from 'react-hook-form'

export const FormError = () => {
    const {
        formState: { errors },
    } = useFormContext()

    const error = errors['root']?.message as string

    return <p className={'text-center text-red-700'}>{error}</p>
}
