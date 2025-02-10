import Checkbox from '@/components/Checkbox'
import { Timer } from '@/components/Timer'
import { buildAppPath, buildImageUrl } from '@/config/path'
import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { useMutation } from '@/hooks/common/useMutation'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { loadAssetAsync } from '@/services/AssetsCache'
import { ICharacterQuiz, ICharacterQuizGuess } from '@/store/types'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const Quiz = ({ quiz }: { quiz: ICharacterQuiz }) => {
    const quizzes = useStore((state) => state.characterQuizzes)
    const guesses = quizzes.guesses[quiz._id]

    const [zoomOut, setZoomOut] = useState(false)
    const [text, setText] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const wuwaCharacters = useWuwaCharacters((state) => state.items)

    const localize = useLocalize()

    const autocompleteOptions = Object.values(wuwaCharacters).filter(
        (c) =>
            text.trim().length !== 0 &&
            (!guesses || guesses.guesses.includes(c._id) === false) &&
            (c.name.toLowerCase().includes(text.toLowerCase()) ||
                localize('character__' + c.name.toLowerCase().replace(/\s+/g, '_'))
                    .toLowerCase()
                    .includes(text.toLowerCase())),
    )

    const guess = useMutation<ICharacterQuizGuess, [string]>({
        fn: (characterId) => {
            return api(`/characterQuizzes/${quiz._id}/guesses`, {
                method: 'POST',
                body: JSON.stringify({ characterId }),
            })
        },
        onSuccess: (guess) => {
            quizzes.setGuess(quiz._id, guess)
            setText('')
        },
        onError: () => {
            setText('')
        },
    })

    const draw = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const character = wuwaCharacters[quiz.characterId]
        if (!canvas || !ctx || !character) return

        loadAssetAsync('img', buildImageUrl(character.photoPath)).then((img) => {
            if (guesses?.guessedAt) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                const ratio = img.height / img.width
                ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    canvas.width,
                    canvas.height * ratio,
                    // canvas.width / 2 - ((canvas.width / 16) * 9) / 2,
                    // 0,
                    // (canvas.width / 16) * 9,
                    // canvas.height,
                )
            } else {
                const windowSize = 64

                const offset = zoomOut ? (guesses?.guesses.length ?? 0) * 10 : 0

                const sw = Math.min(windowSize + offset, img.width)
                const sh = Math.min(windowSize + offset, img.height)

                if (sw >= img.width || sh >= img.height) return

                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(
                    img,
                    Math.max(quiz.x * windowSize - offset, 0),
                    Math.max(quiz.y * windowSize - offset, 0),
                    sw,
                    sh,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                )
            }
        })
    }

    useEffect(() => {
        draw()
    }, [guesses, zoomOut])

    return (
        <div className="h-full grid grid-rows-[max-content,max-content,minmax(200px,1fr)] overflow-y-auto gap-4 bg-stone-800/70">
            <div className="pt-6">
                <div className="text-center mb-4">
                    {quizzes.tomorrow && guesses && guesses.guessedAt !== null && (
                        <div>
                            <span>{localize('guess_character__next_quiz_in')} </span>
                            <Timer end={new Date(quizzes.tomorrow.scheduledAt)} />
                        </div>
                    )}
                    <div className="font-bold text-primary-700 mb-2">{quiz.name}</div>
                    <div className="text-xs">
                        {quiz.guessedCount.toLocaleString()} {localize('guess_character__guessed')}
                    </div>
                </div>

                <canvas
                    width={512}
                    height={512}
                    className="w-48 h-48 border border-primary-700 bg-stone-800 rounded-md mx-auto"
                    ref={canvasRef}
                ></canvas>

                <label className="flex gap-2 items-center justify-center my-2">
                    <Checkbox checked={zoomOut} onChange={setZoomOut} className="w-6 h-6" />
                    <span className="text-primary-700 select-none">
                        {localize('guess_character__zoom_out')}
                    </span>
                </label>
            </div>

            <div className="relative grid grid-cols-[minmax(0,1fr),max-content] rounded-full border border-primary-700 mx-4">
                <input
                    type="text"
                    disabled={guess.isLoading || (guesses && guesses.guessedAt !== null)}
                    value={text}
                    placeholder="Guess..."
                    onChange={(e) => setText(e.target.value)}
                    className="text-black px-3 py-1 outline-none rounded-l-full"
                />
                <button
                    disabled={guess.isLoading || (guesses && guesses.guessedAt !== null)}
                    onClick={() => {
                        const option = autocompleteOptions[0]
                        if (!option) return
                        guess.send(option._id)
                    }}
                    className="bg-primary-700 text-stone-800 px-4 py-2 rounded-r-full disabled:bg-gray-400"
                >
                    <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                </button>

                {text.trim().length !== 0 && !guess.isLoading && (
                    <div className="absolute w-full translate-y-2 top-full max-h-40 overflow-y-auto left-0 bg-stone-800 rounded-lg">
                        {autocompleteOptions.map((option) => (
                            <div
                                key={option._id}
                                className="px-2 py-2 hover:bg-stone-700 flex gap-3 items-center select-none"
                                onClick={() => guess.send(option._id)}
                            >
                                <img
                                    src={buildImageUrl(option.photoPath)}
                                    className="w-10 h-10 object-cover object-top rounded-full bg-primary-700/70"
                                />
                                <span className="capitalize font-medium">
                                    {localize(
                                        'character__' +
                                            option.name.toLowerCase().replace(/\s+/g, '_'),
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mx-4 overflow-y-auto space-y-2 py-2">
                {guesses?.guesses.map((_, idx, arr) => {
                    // reverse
                    const characterId = arr[arr.length - idx - 1]!
                    const character = wuwaCharacters[characterId]

                    return (
                        <div
                            key={characterId}
                            className={cn('flex items-center gap-2 bg-red-900 p-2 rounded-md', {
                                'bg-green-700': characterId === quiz.characterId,
                            })}
                        >
                            <img
                                src={character ? buildImageUrl(character.photoPath) : ''}
                                className="w-10 h-10 object-cover object-top rounded-full bg-primary-700/70"
                            />
                            <span className="capitalize font-medium">
                                {character
                                    ? localize(
                                          'character__' +
                                              character.name.toLowerCase().replace(/\s+/g, '_'),
                                      )
                                    : '-'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const QuizScreen = () => {
    const quiz = useStore((state) => state.characterQuizzes.today)

    if (quiz) {
        return <Quiz quiz={quiz} />
    } else {
        return <Navigate to={buildAppPath('/mini-games')} />
    }
}
