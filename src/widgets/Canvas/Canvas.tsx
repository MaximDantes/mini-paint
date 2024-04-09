'use client'

import { DragEvent, FC, MouseEvent, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { createPost } from '@/entities/Post'
import { useAuthRedirect, useUserContext } from '@/entities/User'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'

type BrushType = 'brush' | 'rectangle' | 'circle' | 'star'

export const Canvas: FC = () => {
    useAuthRedirect()
    const { user } = useUserContext()
    const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushColor, setBrushColor] = useState('#000000')
    const [brushSize, setBrushSize] = useState(10)
    const [brushType, setBrushType] = useState<BrushType>('brush')

    const canvas = useRef<HTMLCanvasElement>(null)
    const previewCanvas = useRef<HTMLCanvasElement>(null)
    const canvasHistory = useRef<ImageData[]>([])
    const previousCursorPosition = useRef<{ x: number; y: number } | null>(null)
    const shapeStartPosition = useRef<{ x: number; y: number } | null>(null)

    const drawShape = (e: MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const context = canvas.current?.getContext('2d')
        if (!context) return

        context.fillStyle = brushColor
        context.strokeStyle = brushColor

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

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        writeHistory()
        setIsDrawing(true)

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        shapeStartPosition.current = { x, y }

        if (brushType === 'brush') {
            drawShape(e)
        }
    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        if (brushType === 'brush') {
            drawShape(e)
            return
        }

        const rect = e.currentTarget.getBoundingClientRect()

        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const previewContext = previewCanvas.current?.getContext('2d')
        if (!previewContext || !shapeStartPosition.current) return

        previewContext.clearRect(0, 0, canvasSize.width, canvasSize.height)
        previewContext.strokeStyle = brushColor
        previewContext.beginPath()

        const { x, y } = shapeStartPosition.current

        if (brushType === 'rectangle') {
            previewContext.moveTo(x, y)
            previewContext.lineTo(currentX, y)
            previewContext.lineTo(currentX, currentY)
            previewContext.lineTo(x, currentY)
            previewContext.lineTo(x, y)
        }

        previewContext.lineWidth = 2
        previewContext.stroke()
    }

    const stopDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        previousCursorPosition.current = null
        setIsDrawing(false)

        if (brushType === 'brush') return

        const rect = e.currentTarget.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const context = canvas.current?.getContext('2d')
        const previewContext = previewCanvas.current?.getContext('2d')

        if (!context || !previewContext || !shapeStartPosition.current) return

        context.fillStyle = brushColor
        context.beginPath()
        context.rect(
            shapeStartPosition.current.x,
            shapeStartPosition.current.y,
            x - shapeStartPosition.current.x,
            y - shapeStartPosition.current.y
        )
        context.fill()

        previewContext.clearRect(0, 0, canvasSize.height, canvasSize.width)
    }

    const historyBack = () => {
        const previousState = canvasHistory.current.pop()

        if (!previousState) return

        const context = canvas.current?.getContext('2d')

        context?.putImageData(previousState, 0, 0)
    }

    const writeHistory = () => {
        const context = canvas.current?.getContext('2d', { willReadFrequently: true })
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
                onChange={(e) => resizeCanvas({ height: +e.currentTarget.value })}
                type={'number'}
                value={canvasSize.height}
            />
            <Input
                onChange={(e) => resizeCanvas({ width: +e.currentTarget.value })}
                type={'number'}
                value={canvasSize.width}
            />
            <Select onChange={(e) => setBrushType(e.currentTarget.value as BrushType)} value={brushType}>
                {['brush', 'rectangle', 'circle', 'star'].map((item) => (
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
