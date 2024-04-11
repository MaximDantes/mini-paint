import { MouseEvent } from 'react'
import { drawShape, getCursorPosition } from '@/features/Canvas/actions'
import { Brush } from '@/shared/model/Brush'

type Args = {
    e: MouseEvent<HTMLCanvasElement>
    canvas: HTMLCanvasElement
    previewCanvas: HTMLCanvasElement
    isDrawing: boolean
    setIsDrawing: (isDrawing: boolean) => void
    brushType: Brush
    brushColor: string
    shapeStartPosition: { x: number; y: number } | null
    clearPreviousCursorPosition: () => void
}

export const handleStopDrawing = ({
    e,
    canvas,
    previewCanvas,
    isDrawing,
    setIsDrawing,
    brushType,
    brushColor,
    shapeStartPosition,
    clearPreviousCursorPosition,
}: Args) => {
    const context = canvas.getContext('2d')
    const previewContext = previewCanvas.getContext('2d')

    previewContext?.clearRect(0, 0, canvas.width, canvas.height)

    if (!isDrawing) return

    clearPreviousCursorPosition()

    setIsDrawing(false)
    if (brushType === 'brush') return

    if (!shapeStartPosition) return
    const { x, y } = getCursorPosition(e, canvas)

    drawShape(context, shapeStartPosition.x, shapeStartPosition.y, x, y, brushType, brushColor)
}
