import { FC, MouseEvent } from 'react'

type Props = {
    pagesCount: number
    currentPage: number
    onChange: (pageNumber: number) => void
}

export const Pagination: FC<Props> = ({ pagesCount, currentPage, onChange }) => {
    const handlePageChange = (e: MouseEvent<HTMLAnchorElement>, pageNumber: number) => {
        e.preventDefault()
        onChange(pageNumber)
    }

    return (
        <nav className={'font-light'}>
            <ul>
                {new Array(pagesCount).map((item, index) => (
                    <li className={index === currentPage ? 'bg-gray-700' : 'bg-gray-400'} key={index}>
                        <a onClick={(e) => handlePageChange(e, index)}>{index + 1}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
