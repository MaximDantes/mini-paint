'use client'

import { DragEvent, FC, MouseEvent, KeyboardEvent, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { drawShape } from '@/widgets/Canvas/draw-shape'
import { drawWithBrush } from '@/widgets/Canvas/draw-with-brush'
import { createPost } from '@/entities/Post'
import { useAuthRedirect, useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { Button } from '@/shared/ui/Button'
import { ColorPicker } from '@/shared/ui/ColorPicker'
import { RangePicker } from '@/shared/ui/RandePicker'
import { Select } from '@/shared/ui/Select'

export type BrushType = 'brush' | 'rectangle' | 'ellipse' | 'star'

const BRUSH_MIN_SIZE = 1
const BRUSH_MAX_SIZE = 100

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
        //TODO correct cursor position on cropped canvas
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
        const { x, y } = getCursorPosition(e)

        if (!isDrawing && brushType === 'brush') {
            previewContext?.clearRect(0, 0, canvasSize.width, canvasSize.height)

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

        if (!shapeStartPosition.current) return

        previewContext?.clearRect(0, 0, canvasSize.width, canvasSize.height)
        drawShape(
            previewContext,
            shapeStartPosition.current.x,
            shapeStartPosition.current.y,
            x,
            y,
            brushType,
            brushColor + '88'
        )
    }

    const stopDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        previewContext?.clearRect(0, 0, canvasSize.height, canvasSize.width)

        if (!isDrawing) return

        previousCursorPosition.current = null

        setIsDrawing(false)
        if (brushType === 'brush') return

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

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
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

    const save = () => {
        if (!canvas.current) return

        const link = document.createElement('a')
        link.download = 'image' + firebaseAuth.currentUser?.uid + Date.now()
        link.href = canvas.current.toDataURL()
        link.click()
        link.remove()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.code) {
            case 'ArrowUp': {
                if (!e.ctrlKey) break

                setBrushSize((prev) => (prev < BRUSH_MAX_SIZE ? prev + 1 : prev))
                break
            }

            case 'ArrowDown': {
                if (!e.ctrlKey) break

                setBrushSize((prev) => (prev > BRUSH_MIN_SIZE ? prev - 1 : prev))
                break
            }

            case 'KeyZ': {
                if (!e.ctrlKey) break

                historyBack()
                break
            }

            case 'KeyC': {
                clear()
                break
            }
        }
    }

    return (
        <div
            className={'grid min-h-[calc(100vh-6rem)] gap-2 md:grid-cols-4 lg:grid-cols-5 focus:outline-0'}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className={'grid gap-4 justify-between grid-cols-3 md:order-1 md:grid-cols-1'}>
                <div className={'flex flex-col gap-2 w-full col-span-2'}>
                    <ColorPicker
                        label={'Brush color'}
                        onChange={(e) => setBrushColor(e.currentTarget.value)}
                        value={brushColor}
                    />

                    <RangePicker
                        label={'Brush size'}
                        max={BRUSH_MAX_SIZE}
                        min={BRUSH_MIN_SIZE}
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

                    <Select onChange={(e) => setBrushType(e.currentTarget.value as BrushType)} value={brushType}>
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
                    <Button onClick={save}>save</Button>
                    <Button onClick={publish}>publish</Button>
                </div>
            </div>

            <div
                className={'md:col-span-3 lg:col-span-4 flex justify-center items-center'}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="relative">
                    <canvas
                        className={'bg-blue-900 max-w-full max-h-full'}
                        height={canvasSize.height}
                        ref={canvas}
                        width={canvasSize.width}
                    />
                    <canvas
                        className={'absolute top-0 left-0 max-w-full max-h-full'}
                        height={canvasSize.height}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={stopDrawing}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopDrawing}
                        ref={previewCanvas}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        width={canvasSize.width}
                    />
                </div>
            </div>
        </div>
    )
}
