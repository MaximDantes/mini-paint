import { zodResolver } from '@hookform/resolvers/zod'
import { ForwardedRef, forwardRef, ReactElement, ReactNode, useImperativeHandle } from 'react'
import { DefaultValues, FormProvider, SubmitHandler, useForm, UseFormSetError } from 'react-hook-form'
import { ZodType } from 'zod'

type FormData = {
    [x: string]: string | undefined
}

export type SetErrorRef<T extends FormData> = {
    setError: UseFormSetError<T>
}

type Props<T extends FormData> = {
    defaultValues: DefaultValues<T>
    validationSchema: ZodType<T>
    onSubmit: SubmitHandler<T>
    children: ReactNode
}

const InnerForm = <T extends FormData>(
    { defaultValues, validationSchema, onSubmit, children }: Props<T>,
    ref: ForwardedRef<SetErrorRef<T>>
) => {
    const methods = useForm({
        defaultValues,
        resolver: zodResolver(validationSchema),
        shouldUseNativeValidation: false,
    })

    useImperativeHandle(
        ref,
        () => ({
            errors: methods.formState.errors,
            setError: methods.setError,
        }),
        [methods]
    )

    return (
        <FormProvider {...methods}>
            <form
                aria-errormessage={methods.formState.errors.root?.message}
                className={'flex flex-col gap-2 w-96'}
                noValidate
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                {children}
            </form>
        </FormProvider>
    )
}

export const BaseForm = forwardRef(InnerForm) as <T extends FormData>(
    props: Props<T> & { ref?: ForwardedRef<SetErrorRef<T>> }
) => ReactElement
