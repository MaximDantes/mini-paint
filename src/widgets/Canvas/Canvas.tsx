'use client'

import { FC, useRef, useState, MouseEvent } from 'react'
import { Button } from '@/shared/ui/Button'

export const Canvas: FC = () => {
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushColor, setBrushColor] = useState('#000000')

    const canvas = useRef<HTMLCanvasElement>(null)
    const canvasHistory = useRef<ImageData[]>([])

    const handleMouseDown = () => {
        writeHistory()
        setIsDrawing(true)
    }

    const handleMouseUp = () => {
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
        context.fillRect(x, y, 10, 10)
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
        if (!context) return
        if (!canvas.current) return

        const canvasState = context.getImageData(0, 0, canvas.current.width, canvas.current.height)

        canvasHistory.current.push(canvasState)
    }

    return (
        <div>
            <input onChange={(e) => setBrushColor(e.currentTarget.value)} type="color" value={brushColor} />

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
        </div>
    )
}
