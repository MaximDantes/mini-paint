import { DragEvent, MouseEvent, FC, RefObject } from 'react'

type Props = {
    canvasSize: { width: number; height: number }
    onDrop: (imageFile: File) => void
    canvasRef: RefObject<HTMLCanvasElement>
    previewCanvasRef: RefObject<HTMLCanvasElement>
    onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void
    onMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void
    onMouseUp: (e: MouseEvent<HTMLCanvasElement>) => void
    onMouseLeave: (e: MouseEvent<HTMLCanvasElement>) => void
}

export const Canvas: FC<Props> = ({
    canvasSize,
    onDrop,
    canvasRef,
    previewCanvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
}) => {
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        const file = e.dataTransfer.files[0]

        if (file.type !== 'image/jpeg' && file.type !== 'image/png') return

        onDrop(file)
    }

    return (
        <div
            className={'md:col-span-3 lg:col-span-4 flex justify-center items-center'}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="relative">
                <canvas
                    className={'bg-blue-900 max-w-full max-h-full'}
                    height={canvasSize.height}
                    ref={canvasRef}
                    width={canvasSize.width}
                />
                <canvas
                    className={'absolute top-0 left-0 max-w-full max-h-full'}
                    height={canvasSize.height}
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    ref={previewCanvasRef}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    width={canvasSize.width}
                />
            </div>
        </div>
    )
}
