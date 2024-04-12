'use client'

import { FC, KeyboardEvent, MouseEvent, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Canvas } from '@/features/Canvas'
import { handleKeyDown, handleMouseDown, handleMouseMove, handleStopDrawing } from '@/features/Canvas/handlers'
import { DrawerControls } from '@/features/DrawerControls'
import { createPost } from '@/entities/Post'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'

export type BrushType = 'brush' | 'rectangle' | 'ellipse' | 'star'

const BRUSH_MIN_SIZE = 1
const BRUSH_MAX_SIZE = 100

export const Drawer: FC = () => {
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

    const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!canvas.current) return

        handleMouseDown({
            e,
            canvas: canvas.current,
            brushSize,
            brushType,
            brushColor,
            setIsDrawing,
            writeHistory,
            previousCursorPosition: previousCursorPosition.current,
            setPreviousCursorPosition: (position) => (previousCursorPosition.current = position),
            setShapeStartPosition: (position) => (shapeStartPosition.current = position),
        })
    }

    const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!canvas.current || !previewCanvas.current) return

        handleMouseMove({
            e,
            isDrawing,
            brushType,
            brushColor,
            canvas: canvas.current,
            previewCanvas: previewCanvas.current,
            brushSize,
            shapeStartPosition: shapeStartPosition.current,
            previousCursorPosition: previousCursorPosition.current,
            setPreviousCursorPosition: (args) => {
                previousCursorPosition.current = args
            },
        })
    }

    const stopDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!canvas.current || !previewCanvas.current) return

        handleStopDrawing({
            e,
            canvas: canvas.current,
            previewCanvas: previewCanvas.current,
            isDrawing,
            setIsDrawing,
            brushType,
            brushColor,
            shapeStartPosition: shapeStartPosition.current,
            clearPreviousCursorPosition: () => (previousCursorPosition.current = null),
        })
    }

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        handleKeyDown({
            e,
            increaseBrushSize: () => setBrushSize((prev) => (prev < BRUSH_MAX_SIZE ? prev + 1 : prev)),
            decreaseBrushSize: () => setBrushSize((prev) => (prev > BRUSH_MIN_SIZE ? prev - 1 : prev)),
            clear,
            historyBack,
        })
    }

    const historyBack = () => {
        const previousState = canvasHistory.current.pop()

        if (!previousState) return

        context?.putImageData(previousState, 0, 0)
    }

    const writeHistory = () => {
        if (!canvas.current || !context) return

        const canvasState = context.getImageData(0, 0, canvas.current.width, canvas.current.height)

        canvasHistory.current.push(canvasState)
    }

    const clear = () => {
        if (!canvas.current || !context) return

        writeHistory()
        context.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }

    const handleDrop = (imageFile: File) => {
        const url = URL.createObjectURL(imageFile)

        const image = new Image()
        image.src = url

        image.addEventListener('load', () => {
            if (!canvas.current || !context) return

            flushSync(() => {
                setCanvasSize({ width: image.width, height: image.height })
            })

            context.drawImage(image, 0, 0)
        })
    }

    const resizeCanvas = (size: { width?: number; height?: number }) => {
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
        const url = canvas.current?.toDataURL('image/png')

        if (!url || !user) return

        await createPost(url)
    }

    const save = () => {
        if (!canvas.current) return

        const link = document.createElement('a')
        link.download = 'image' + firebaseAuth.currentUser?.uid + Date.now()
        link.href = canvas.current.toDataURL()
        link.click()
        link.remove()
    }

    return (
        <div
            className={'grid min-h-[calc(100vh-6rem)] gap-2 md:grid-cols-4 lg:grid-cols-5 focus:outline-0'}
            onKeyDown={onKeyDown}
            tabIndex={-1}
        >
            <DrawerControls
                brushColor={brushColor}
                brushSize={brushSize}
                brushType={brushType}
                canvasSize={canvasSize}
                clear={clear}
                historyBack={historyBack}
                maxBrushSize={BRUSH_MAX_SIZE}
                minBrushSize={BRUSH_MIN_SIZE}
                publish={publish}
                resizeCanvas={resizeCanvas}
                save={save}
                setBrushColor={setBrushColor}
                setBrushSize={setBrushSize}
                setBrushType={setBrushType}
            />

            <Canvas
                canvasRef={canvas}
                canvasSize={canvasSize}
                onDrop={handleDrop}
                onMouseDown={onMouseDown}
                onMouseLeave={stopDrawing}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrawing}
                previewCanvasRef={previewCanvas}
            />
        </div>
    )
}
