'use client'

import { FC, useRef, useState, MouseEvent } from 'react'
import { Button } from '@/shared/ui/Button'

export const Canvas: FC = () => {
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushColor, setBrushColor] = useState('#000000')
    const [brushSize, setBrushSize] = useState(10)

    const canvas = useRef<HTMLCanvasElement>(null)
    const canvasHistory = useRef<ImageData[]>([])
    const previousCursorPosition = useRef<{ x: number; y: number } | null>(null)

    const handleMouseDown = () => {
        writeHistory()
        setIsDrawing(true)
    }

    const handleMouseUp = () => {
        previousCursorPosition.current = null
        setIsDrawing(false)
    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const rect = e.currentTarget.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const context = canvas.current?.getContext('2d')

        if (!context) return
        context.fillStyle = brushColor

        if (previousCursorPosition.current) {
            context.beginPath()
            context.moveTo(previousCursorPosition.current.x, previousCursorPosition.current.y)
            context.lineTo(x, y)
            context.lineWidth = brushSize * 2
            context.stroke()
        }

        previousCursorPosition.current = { x, y }

        context.beginPath()
        context.arc(x, y, brushSize, 0, 2 * Math.PI)
        context.fill()
    }

    const save = () => {
        const url = canvas.current?.toDataURL('image/png')

        console.log(url)
    }

    const historyBack = () => {
        const previousState = canvasHistory.current.pop()

        if (!previousState) return

        const context = canvas.current?.getContext('2d')

        context?.putImageData(previousState, 0, 0)
    }

    const writeHistory = () => {
        const context = canvas.current?.getContext('2d')
        if (!canvas.current || !context) return

        const canvasState = context.getImageData(0, 0, canvas.current.width, canvas.current.height)

        canvasHistory.current.push(canvasState)
    }

    const clear = () => {
        const context = canvas.current?.getContext('2d')
        if (!canvas.current || !context) return

        writeHistory()
        context.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }

    return (
        <div>
            <input onChange={(e) => setBrushColor(e.currentTarget.value)} type="color" value={brushColor} />
            <input
                max={100}
                min={1}
                onChange={(e) => setBrushSize(+e.currentTarget.value)}
                type="number"
                value={brushSize}
            />

            <canvas
                className={'bg-blue-300'}
                height={512}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={canvas}
                width={512}
            />

            <Button onClick={save}>save</Button>
            <Button onClick={historyBack}>back</Button>
            <Button onClick={clear}>clear</Button>
        </div>
    )
}
