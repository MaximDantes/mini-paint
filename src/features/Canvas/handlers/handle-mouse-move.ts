import { MouseEvent } from 'react'
import { drawShape, drawWithBrush, getCursorPosition } from '@/features/Canvas/actions'
import { Brush } from '@/shared/model/Brush'

type Args = {
    e: MouseEvent<HTMLCanvasElement>
    isDrawing: boolean
    brushType: Brush
    brushSize: number
    brushColor: string
    canvas: HTMLCanvasElement
    previewCanvas: HTMLCanvasElement
    setPreviousCursorPosition: (position: { x: number; y: number }) => void
    previousCursorPosition: { x: number; y: number } | null
    shapeStartPosition: { x: number; y: number } | null
}

export const handleMouseMove = ({
    e,
    isDrawing,
    brushType,
    brushSize,
    brushColor,
    canvas,
    previewCanvas,
    setPreviousCursorPosition,
    previousCursorPosition,
    shapeStartPosition,
}: Args) => {
    const context = canvas.getContext('2d')
    const previewContext = previewCanvas.getContext('2d')

    if (!previewContext || !canvas) return

    const { x, y } = getCursorPosition(e, canvas)

    if (!isDrawing && brushType === 'brush') {
        previewContext?.clearRect(0, 0, canvas.width, canvas.height)

        drawShape(
            previewContext,
            x - brushSize,
            y - brushSize,
            x + brushSize,
            y + brushSize,
            'ellipse',
            brushColor + '88'
        )
    }

    if (!isDrawing) return

    if (brushType === 'brush') {
        const { x, y } = getCursorPosition(e, canvas)
        drawWithBrush({
            previousX: previousCursorPosition?.x,
            previousY: previousCursorPosition?.y,
            currentX: x,
            currentY: y,
            context,
            brushColor,
            brushSize,
        })
        setPreviousCursorPosition({ x, y })

        return
    }

    if (!shapeStartPosition) return

    previewContext?.clearRect(0, 0, canvas.width, canvas.height)

    drawShape(previewContext, shapeStartPosition.x, shapeStartPosition.y, x, y, brushType, brushColor + '88')
}
