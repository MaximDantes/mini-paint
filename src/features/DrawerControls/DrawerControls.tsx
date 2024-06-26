import { FC, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Brush } from '@/shared/model/Brush'
import { Button } from '@/shared/ui/Button'
import { ColorPicker } from '@/shared/ui/ColorPicker'
import { Confirm } from '@/shared/ui/Confirm'
import { Message } from '@/shared/ui/Message'
import { RangePicker } from '@/shared/ui/RandePicker'
import { Select } from '@/shared/ui/Select'

type Props = {
    brushColor: string
    setBrushColor: (color: string) => void
    brushSize: number
    minBrushSize: number
    maxBrushSize: number
    setBrushSize: (size: number) => void
    canvasSize: { width: number; height: number }
    resizeCanvas: (size: { width?: number; height?: number }) => void
    brushType: Brush
    setBrushType: (brushType: Brush) => void
    historyBack: () => void
    clear: () => void
    publish: () => Promise<void>
    save: () => void
}

export const DrawerControls: FC<Props> = ({
    brushColor,
    setBrushColor,
    brushSize,
    minBrushSize,
    maxBrushSize,
    setBrushSize,
    canvasSize,
    resizeCanvas,
    brushType,
    setBrushType,
    historyBack,
    clear,
    publish,
    save,
}) => {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [messageOpen, setMessageOpen] = useState(false)
    const [messageError, setMessageError] = useState(true)
    const [messageText, setMessageText] = useState('')

    const showMessage = (message: string, error?: boolean) => {
        if (messageOpen) {
            flushSync(() => setMessageOpen(false))
        }

        setMessageError(!!error)
        setMessageText(message)
        setMessageOpen(true)
    }

    const handleConfirm = async () => {
        try {
            await publish()

            showMessage('Image published successfully')
        } catch (e) {
            showMessage('Error while publishing image', true)
        }
    }

    return (
        <div className={'grid gap-4 justify-between grid-cols-3 md:order-1 md:grid-cols-1'}>
            <div className={'flex flex-col gap-2 w-full col-span-2'}>
                <ColorPicker
                    label={'Brush color'}
                    onChange={(e) => setBrushColor(e.currentTarget.value)}
                    value={brushColor}
                />

                <RangePicker
                    label={'Brush size'}
                    max={maxBrushSize}
                    min={minBrushSize}
                    onChange={(value) => setBrushSize(value)}
                    value={brushSize}
                />

                <RangePicker
                    label={'Width'}
                    max={2048}
                    min={128}
                    onChange={(value) => resizeCanvas({ width: value })}
                    step={8}
                    value={canvasSize.width}
                />

                <RangePicker
                    label={'Height'}
                    max={2048}
                    min={128}
                    onChange={(value) => resizeCanvas({ height: value })}
                    step={8}
                    value={canvasSize.height}
                />

                <Select onChange={(e) => setBrushType(e.currentTarget.value as Brush)} value={brushType}>
                    {['brush', 'rectangle', 'ellipse', 'star'].map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
            </div>

            <div className={'flex flex-col gap-2 justify-center md:justify-end'}>
                <Button onClick={historyBack}>back</Button>
                <Button onClick={clear}>clear</Button>
                <Button onClick={() => setConfirmOpen(true)}>publish</Button>
                <Button onClick={save}>save</Button>
            </div>

            <Confirm
                confirmButtonText={'publish'}
                message={'Publish this image?'}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                open={confirmOpen}
            />

            <Message
                error={messageError}
                message={messageText}
                onClose={() => setMessageOpen(false)}
                open={messageOpen}
            />
        </div>
    )
}
