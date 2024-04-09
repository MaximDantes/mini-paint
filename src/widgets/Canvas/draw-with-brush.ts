type Args = {
    previousX?: number
    previousY?: number
    currentX: number
    currentY: number
    context: CanvasRenderingContext2D | null | undefined
    brushColor: string
    brushSize: number
}

export const drawWithBrush = ({ previousX, previousY, currentX, currentY, context, brushColor, brushSize }: Args) => {
    if (!context) return

    context.fillStyle = brushColor
    context.strokeStyle = brushColor

    context.beginPath()
    context.arc(currentX, currentY, brushSize, 0, 2 * Math.PI)
    context.fill()

    if (previousX && previousY) {
        context.beginPath()
        context.moveTo(previousX, previousY)
        context.lineTo(currentX, currentY)
        context.lineWidth = brushSize * 2
        context.stroke()
    }
}
