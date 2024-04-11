import { MouseEvent } from 'react'

export const getCursorPosition = (e: MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const cropX = canvas.width / canvas.clientWidth
    const cropY = canvas.height / canvas.clientHeight

    const x = (e.clientX - rect.left) * cropX
    const y = (e.clientY - rect.top) * cropY

    return { x, y }
}
