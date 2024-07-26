import { faDropbox } from '@fortawesome/free-brands-svg-icons'
import { faAndroid } from '@fortawesome/free-brands-svg-icons/faAndroid'
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple'
import { faArchive, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ItemProps {
    icon: IconDefinition
    count: number
}

const format = new Intl.NumberFormat('en-US', {
    style: 'decimal',
})

const Item = ({ count, icon }: ItemProps) => {
    return (
        <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={icon} className="text-orange-500 w-5 h-5" />
            <span className="text-sm">{format.format(count)}</span>
        </div>
    )
}

export const TopRibbon = () => {
    return (
        <div className="bg-black/75 p-2 flex items-center gap-4">
            <Item icon={faApple} count={12130} />
            <Item icon={faAndroid} count={10} />
            <Item icon={faArchive} count={3110} />
            <Item icon={faDropbox} count={4310} />
        </div>
    )
}
