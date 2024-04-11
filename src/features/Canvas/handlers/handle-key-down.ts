import { KeyboardEvent } from 'react'

type Args = {
    e: KeyboardEvent<HTMLDivElement>
    increaseBrushSize: () => void
    decreaseBrushSize: () => void
    historyBack: () => void
    clear: () => void
}

export const handleKeyDown = ({ e, increaseBrushSize, decreaseBrushSize, historyBack, clear }: Args) => {
    switch (e.code) {
        case 'ArrowUp': {
            if (!e.ctrlKey) break

            increaseBrushSize()
            break
        }

        case 'ArrowDown': {
            if (!e.ctrlKey) break

            decreaseBrushSize()
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
