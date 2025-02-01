import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
    onClick: () => void
}

export const FloatingCartButton = ({ onClick }: Props) => {
    return (
        <button
            className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-stone-800 border-dashed border-2 border-stone-800"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faCartArrowDown} className="w-8 h-8 animate-bounce" />
        </button>
    )
}
