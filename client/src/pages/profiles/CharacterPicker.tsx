import { ICharacter } from '@/context/characters/CharactersContext'
import { faRefresh, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@material-ui/core'
import { useEffect, useState } from 'react'

interface Props {
    charactersPool: ICharacter[]
    allCharacters: Record<string, ICharacter>
    selected?: string
    onSelect?: (id: string | null) => void
}

export const CharacterPicker = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string | null>(props.selected ?? null)

    const select = (id: string | null) => {
        setSelected(id)
        props.onSelect?.(id)
    }

    useEffect(() => {
        setSelected(props.selected ?? null)
    }, [props.selected])

    return (
        <div className="relative w-full h-full">
            {selected ? (
                <>
                    <img
                        src={props.allCharacters[selected]?.photoUrl}
                        className="w-full h-full object-cover object-bottom select-none"
                        style={{
                            backgroundColor:
                                props.allCharacters[selected]?.accentColor ?? '#000000',
                        }}
                    />

                    <FontAwesomeIcon
                        icon={faRefresh}
                        className="absolute top-0 right-4 text-white text-sm bg-black/70 w-2 h-2 p-1 rounded-bl-lg cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    />
                    <FontAwesomeIcon
                        icon={faX}
                        className="absolute top-0 right-0 text-red-500 text-sm bg-black/70 w-2 h-2 p-1 cursor-pointer"
                        onClick={() => select(null)}
                    />
                </>
            ) : (
                <div
                    className="w-full h-full bg-gradient-to-t from-gray-500 to-gray-700 text-8xl flex items-center justify-center"
                    onClick={() => {
                        setIsOpen(true)
                    }}
                >
                    <span className="rotate-45 select-none">×</span>
                </div>
            )}

            <Modal open={isOpen} onClose={() => setIsOpen(false)} className="Mui-Modal relative">
                <>
                    <div className="relative w-4/5 h-full overflow-y-auto mx-auto py-10">
                        <div className="mx-auto grid grid-cols-3 gap-1">
                            {props.charactersPool.map((character) => (
                                <div
                                    key={character._id}
                                    className="relative overflow-hidden rounded-lg"
                                    style={{ backgroundColor: character.accentColor }}
                                    onClick={() => {
                                        select(character._id)
                                        setIsOpen(false)
                                    }}
                                >
                                    <img
                                        src={character.photoUrl}
                                        className="w-full h-32 object-cover object-top"
                                    />

                                    <span className="absolute bottom-0 left-0 w-full bg-black/50 text-white px-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                        <span className="text-sm capitalize">
                                            {character.name}{' '}
                                        </span>
                                        <span
                                            className="text-[10px]"
                                            style={{ color: character.accentColor }}
                                        >
                                            ({character.element})
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FontAwesomeIcon
                        icon={faX}
                        className="absolute cursor-pointer w-3 h-3 top-3 right-3 text-white rounded-full bg-black p-1 border border-red-500"
                        onClick={() => setIsOpen(false)}
                    />
                </>
            </Modal>
        </div>
    )
}
