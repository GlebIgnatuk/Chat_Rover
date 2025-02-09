import { buildAppPath } from '@/config/path'
import { useStore } from '@/context/app/useStore'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { faUserNinja } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'

const minigames = [
    { path: '/mini-games/character-quiz', name: 'mini_games__guess_character', icon: faUserNinja },
]

export const MiniGamesScreen = () => {
    const localize = useLocalize()

    const characterQuiz = useStore((state) => state.characterQuizzes.today)
    const characterQuizGuess = useStore((state) =>
        characterQuiz ? state.characterQuizzes.guesses[characterQuiz._id] : null,
    )
    const highlightCharacterQuiz =
        !!characterQuiz && (!characterQuizGuess || characterQuizGuess.guessedAt === null)

    return (
        <div className="flex flex-col gap-2 py-2 px-1 overflow-y-auto">
            {minigames.map((minigame, idx) => (
                <NavLink
                    key={idx}
                    to={buildAppPath(minigame.path)}
                    className="bg-stone-800/90 px-2 py-4 grid grid-cols-[max-content,minmax(0,1fr),max-content] gap-2 items-center text-white rounded-md"
                >
                    <div className="relative">
                        <FontAwesomeIcon icon={minigame.icon} className="w-6 h-6" />
                        {highlightCharacterQuiz && (
                            <div className="w-2 h-2 rounded-full bg-red-600 absolute -top-1 right-0"></div>
                        )}
                    </div>
                    <span>{localize(minigame.name)}</span>
                </NavLink>
            ))}
        </div>
    )
}
