'use client'

import debounce from 'debounce'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FC, FormEvent, KeyboardEvent, useState } from 'react'
import { getUsers, User } from '@/entities/User'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

enum Keys {
    arrowUp = 'ArrowUp',
    arrowDown = 'ArrowDown',
}

const debouncedFetchUsers = debounce(
    async (
        searchText: string,
        setIsVariantsVisible: (isVisible: boolean) => void,
        setUsers: (users: User[]) => void,
        setIsNotFound: (isNotFound: boolean) => void
    ) => {
        const fetchedUsers = await getUsers(searchText)

        setIsVariantsVisible(true)
        setUsers(fetchedUsers)

        setIsNotFound(!fetchedUsers.length)
    },
    300
)

export const PostsSearch: FC = () => {
    const [searchText, setSearchText] = useState('')

    const [users, setUsers] = useState<User[]>([])
    const [selectedUserIndex, setSelectedUserIndex] = useState(-1)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    const [isVariantsVisible, setIsVariantsVisible] = useState(false)
    const [isNotFound, setIsNotFound] = useState(false)

    const router = useRouter()

    const search = () => {
        const userUid = selectedUserId ?? users[selectedUserIndex]?.uid

        if (!userUid) return

        setIsVariantsVisible(false)

        router.push(`/images/${userUid}`)
    }

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.currentTarget.value)

        debouncedFetchUsers(e.currentTarget.value, setIsVariantsVisible, setUsers, setIsNotFound)
    }

    const handleSelect = (user: User) => {
        setSearchText(user.email || '')
        setSelectedUserId(user.uid)
        setIsVariantsVisible(false)
        setUsers([])
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        search()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        switch (e.code) {
            case Keys.arrowDown: {
                e.preventDefault()

                const newSelectedIndex =
                    selectedUserIndex === -1 || selectedUserIndex === users.length - 1 ? 0 : selectedUserIndex + 1

                setSelectedUserIndex(newSelectedIndex)

                break
            }

            case Keys.arrowUp: {
                e.preventDefault()

                const newSelectedIndex =
                    selectedUserIndex === -1 || selectedUserIndex === 0 ? users.length - 1 : selectedUserIndex - 1

                setSelectedUserIndex(newSelectedIndex)

                break
            }
        }
    }

    return (
        <form className={'flex gap-2 relative'} onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
            <Input
                aria-autocomplete={'list'}
                aria-expanded={isVariantsVisible}
                onBlur={() => setIsVariantsVisible(false)}
                onChange={handleChange}
                onFocus={() => setIsVariantsVisible(true)}
                placeholder={'Search by user'}
                role={'combobox'}
                type={'text'}
                value={searchText}
            />

            <Button type={'submit'}>search</Button>

            {isVariantsVisible ? (
                <ul className={'absolute w-full top-12 bg-gray-700 rounded-md overflow-hidden'} role={'listbox'}>
                    {isNotFound ? (
                        <li className={'p-4 text-center'}>No users found</li>
                    ) : (
                        users.map((item, index) => (
                            <li
                                aria-selected={index === selectedUserIndex}
                                className={
                                    'p-2 hover:bg-gray-600' +
                                    (index === selectedUserIndex ? ' bg-gray-400 hover:bg-gray-400' : '')
                                }
                                key={item.uid}
                                onMouseDown={() => handleSelect(item)}
                                role={'option'}
                            >
                                {item.email}
                            </li>
                        ))
                    )}
                </ul>
            ) : null}
        </form>
    )
}
