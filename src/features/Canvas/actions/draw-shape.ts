import type { Brush } from '@/shared/model/Brush'

export const drawShape = (
    context: CanvasRenderingContext2D | null | undefined,
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    shapeType: Brush,
    brushColor: string
) => {
    if (!context) return

    context.fillStyle = brushColor
    context.beginPath()

    switch (shapeType) {
        case 'rectangle': {
            context.moveTo(startX, startY)
            context.lineTo(currentX, startY)
            context.lineTo(currentX, currentY)
            context.lineTo(startX, currentY)
            context.lineTo(startX, startY)

            break
        }

        case 'ellipse': {
            const radiusX = (currentX - startX) / 2
            const radiusY = (currentY - startY) / 2
            const centerX = startX + radiusX
            const centerY = startY + radiusY
            const step = 0.01
            const pi2 = Math.PI * 2 - step

            context.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0))

            let a = step
            for (; a < pi2; a += step) {
                context.lineTo(centerX + radiusX * Math.cos(a), centerY + radiusY * Math.sin(a))
            }

            break
        }

        case 'star': {
            const radiusX = (currentX - startX) / 2
            const radiusY = (currentY - startY) / 2
            const centerX = startX + radiusX
            const centerY = startY + radiusY

            const outerRadius = (radiusX + radiusY) / 2
            const innerRadius = outerRadius / 2

            const spikes = 5
            const step = Math.PI / spikes

            let x = centerX
            let y = centerY
            let rotation = (Math.PI / 2) * 3

            context.moveTo(centerX, centerY - outerRadius)
            for (let i = 0; i < spikes; i++) {
                x = centerX + Math.cos(rotation) * outerRadius
                y = centerY + Math.sin(rotation) * outerRadius
                context.lineTo(x, y)
                rotation += step

                x = centerX + Math.cos(rotation) * innerRadius
                y = centerY + Math.sin(rotation) * innerRadius
                context.lineTo(x, y)
                rotation += step
            }
            context.lineTo(centerX, centerY - outerRadius)
            break
        }
    }

    context.fill()
    context.closePath()
}
