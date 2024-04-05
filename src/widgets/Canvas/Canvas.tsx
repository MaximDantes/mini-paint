'use client'

import { DragEvent, FC, MouseEvent, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useAuthRedirect } from '@/entities/User'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'

type BrushType = 'brush' | 'rectangle' | 'circle' | 'star'

export const Canvas: FC = () => {
    useAuthRedirect()
    const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [brushColor, setBrushColor] = useState('#000000')
    const [brushSize, setBrushSize] = useState(10)
    const [brushType, setBrushType] = useState<BrushType>('brush')

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

    const save = () => {
        const url = canvas.current?.toDataURL('image/png')
        //TODO save
        console.log(url)
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
            if (!url) return

            console.log(url)
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

            <canvas
                className={'bg-blue-900'}
                height={canvasSize.height}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={canvas}
                width={canvasSize.width}
            />

            <Button onClick={save}>save</Button>
            <Button onClick={historyBack}>back</Button>
            <Button onClick={clear}>clear</Button>
            <Button onClick={publish}>publish</Button>
        </div>
    )
}
