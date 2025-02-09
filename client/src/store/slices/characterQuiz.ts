import { StateCreator } from 'zustand'
import { ICharacterQuizzesState } from '../state'
import * as R from 'ramda'
import { ICharacterQuiz, ICharacterQuizGuess, ITomorrowCharacterQuiz } from '../types'

type IState = ICharacterQuizzesState

export const createCharacterQuizzesSlice =
    (
        today: ICharacterQuiz | null,
        todaysGuess: ICharacterQuizGuess | null,
        tomorrow: ITomorrowCharacterQuiz | null,
    ): StateCreator<IState, [], [], ICharacterQuizzesState> =>
    (set) => ({
        characterQuizzes: {
            today,
            setToday: (quiz) => {
                set((state) => R.assocPath(['characterQuizzes', 'today'], quiz, state))
            },

            tomorrow,
            setTomorrow: (quiz) => {
                set((state) => R.assocPath(['characterQuizzes', 'tomorrow'], quiz, state))
            },

            guesses: todaysGuess ? { [todaysGuess.quizId]: todaysGuess } : {},
            setGuess: (quizId, guess) => {
                set((state) => R.assocPath(['characterQuizzes', 'guesses', quizId], guess, state))
            },
        },
    })
