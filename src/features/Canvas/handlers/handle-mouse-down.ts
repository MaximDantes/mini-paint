import { MouseEvent } from 'react'
import { drawWithBrush, getCursorPosition } from '@/features/Canvas/actions'
import { Brush } from '@/shared/model/Brush'

type Args = {
    e: MouseEvent<HTMLCanvasElement>
    canvas: HTMLCanvasElement
    brushColor: string
    brushSize: number
    brushType: Brush
    previousCursorPosition: { x: number; y: number } | null
    writeHistory: () => void
    setIsDrawing: (isDrawing: boolean) => void
    setShapeStartPosition: (position: { x: number; y: number }) => void
    setPreviousCursorPosition: (position: { x: number; y: number }) => void
}

export const handleMouseDown = ({
    e,
    canvas,
    brushColor,
    brushSize,
    brushType,
    previousCursorPosition,
    writeHistory,
    setIsDrawing,
    setShapeStartPosition,
    setPreviousCursorPosition,
}: Args) => {
    const context = canvas.getContext('2d')
    if (!context) return

    writeHistory()
    setIsDrawing(true)

    const { x, y } = getCursorPosition(e, canvas)
    setShapeStartPosition({ x, y })

    if (brushType === 'brush') {
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
    }
}
