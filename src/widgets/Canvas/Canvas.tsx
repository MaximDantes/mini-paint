'use client'

import { DragEvent, FC, MouseEvent, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { drawShape } from '@/widgets/Canvas/draw-shape'
import { drawWithBrush } from '@/widgets/Canvas/draw-with-brush'
import { createPost } from '@/entities/Post'
import { useAuthRedirect, useUserContext } from '@/entities/User'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'

export type BrushType = 'brush' | 'rectangle' | 'ellipse' | 'star'

export const Canvas: FC = () => {
    useAuthRedirect()
    const { user } = useUserContext()
    const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushColor, setBrushColor] = useState('#000000')
    const [brushSize, setBrushSize] = useState(10)
    const [brushType, setBrushType] = useState<BrushType>('brush')

    const canvasHistory = useRef<ImageData[]>([])
    const previousCursorPosition = useRef<{ x: number; y: number } | null>(null)
    const shapeStartPosition = useRef<{ x: number; y: number } | null>(null)

    const canvas = useRef<HTMLCanvasElement>(null)
    const previewCanvas = useRef<HTMLCanvasElement>(null)
    const context = canvas.current?.getContext('2d')
    const previewContext = previewCanvas.current?.getContext('2d')

    const getCursorPosition = (e: MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        writeHistory()
        setIsDrawing(true)

        const { x, y } = getCursorPosition(e)
        shapeStartPosition.current = { x, y }

        if (brushType === 'brush') {
            drawWithBrush({
                previousX: previousCursorPosition.current?.x,
                previousY: previousCursorPosition.current?.y,
                currentX: x,
                currentY: y,
                context,
                brushColor,
                brushSize,
            })
            previousCursorPosition.current = { x, y }
        }
    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        if (brushType === 'brush') {
            const { x, y } = getCursorPosition(e)
            drawWithBrush({
                previousX: previousCursorPosition.current?.x,
                previousY: previousCursorPosition.current?.y,
                currentX: x,
                currentY: y,
                context,
                brushColor,
                brushSize,
            })
            previousCursorPosition.current = { x, y }

            return
        }

        const { x, y } = getCursorPosition(e)
        if (!shapeStartPosition.current) return

        previewContext?.clearRect(0, 0, canvasSize.width, canvasSize.height)
        drawShape(
            previewContext,
            shapeStartPosition.current.x,
            shapeStartPosition.current.y,
            x,
            y,
            brushType,
            brushColor
        )
    }

    const stopDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        previousCursorPosition.current = null
        setIsDrawing(false)

        if (brushType === 'brush') return

        previewContext?.clearRect(0, 0, canvasSize.height, canvasSize.width)

        if (!shapeStartPosition.current) return
        const { x, y } = getCursorPosition(e)

        drawShape(context, shapeStartPosition.current.x, shapeStartPosition.current.y, x, y, brushType, brushColor)
    }

    const historyBack = () => {
        const previousState = canvasHistory.current.pop()

        if (!previousState) return

        context?.putImageData(previousState, 0, 0)
    }

    const writeHistory = () => {
        const context = canvas.current?.getContext('2d', { willReadFrequently: true })
        if (!canvas.current || !context) return

        const canvasState = context.getImageData(0, 0, canvas.current.width, canvas.current.height)

        canvasHistory.current.push(canvasState)
    }

    const clear = () => {
        if (!canvas.current || !context) return

        writeHistory()
        context.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }

    const handleDragOver = (e: DragEvent<HTMLCanvasElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLCanvasElement>) => {
        e.preventDefault()

        const file = e.dataTransfer.files[0]

        if (file.type !== 'image/jpeg' && file.type !== 'image/png') return

        const url = URL.createObjectURL(file)

        const image = new Image()
        image.src = url

        image.addEventListener('load', () => {
            const context = canvas.current?.getContext('2d')
            if (!canvas.current || !context) return

            flushSync(() => {
                setCanvasSize({ width: image.width, height: image.height })
            })

            context.drawImage(image, 0, 0)
        })
    }

    const resizeCanvas = (size: { width?: number; height?: number }) => {
        const context = canvas.current?.getContext('2d')
        if (!canvas.current || !context) return

        const newSize = {
            width: size.width ?? canvasSize.width,
            height: size.height ?? canvasSize.height,
        }

        const canvasState = context.getImageData(0, 0, canvas.current.width, canvas.current.height)

        flushSync(() => {
            setCanvasSize(newSize)
        })
        context.putImageData(canvasState, 0, 0)
    }

    const publish = async () => {
        try {
            const url = canvas.current?.toDataURL('image/png')

            if (!url || !user) return

            await createPost(url)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <input onChange={(e) => setBrushColor(e.currentTarget.value)} type="color" value={brushColor} />

            <Input onChange={(e) => setBrushSize(+e.currentTarget.value)} type={'number'} value={brushSize} />
            <Input
                max={4096}
                min={128}
                onChange={(e) => resizeCanvas({ height: +e.currentTarget.value })}
                type={'number'}
                value={canvasSize.height}
            />
            <Input
                max={4096}
                min={128}
                onChange={(e) => resizeCanvas({ width: +e.currentTarget.value })}
                type={'number'}
                value={canvasSize.width}
            />
            <Select onChange={(e) => setBrushType(e.currentTarget.value as BrushType)} value={brushType}>
                {['brush', 'rectangle', 'ellipse', 'star'].map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </Select>

            <div className="relative">
                <canvas
                    className={'bg-blue-900 cursor-pointer'}
                    height={canvasSize.height}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={stopDrawing}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDrawing}
                    ref={canvas}
                    width={canvasSize.width}
                />
                <canvas
                    className={'absolute top-0'}
                    height={canvasSize.height}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={stopDrawing}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDrawing}
                    ref={previewCanvas}
                    width={canvasSize.width}
                />
            </div>

            <Button onClick={publish}>publish</Button>
            <Button onClick={historyBack}>back</Button>
            <Button onClick={clear}>clear</Button>
        </div>
    )
}
