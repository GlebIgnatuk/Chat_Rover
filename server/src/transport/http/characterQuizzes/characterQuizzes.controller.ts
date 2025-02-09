import { IAuthorizedRequestHandler } from '../types'

export const getToday: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const quiz = await repositories.characterQuiz.getToday()

        if (quiz) {
            res.json({ success: true, data: quiz })
        } else {
            res.json({ success: false, data: null, error: 'No quiz found' })
        }
    } catch (e) {
        next(e)
    }
}

export const getTomorrow: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const quiz = await repositories.characterQuiz.getTomorrow()

        if (quiz) {
            res.json({ success: true, data: quiz })
        } else {
            res.json({ success: false, data: null, error: 'No quiz found' })
        }
    } catch (e) {
        next(e)
    }
}

export const getGuess: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { id: quizId } = req.params
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        const guess = await repositories.characterQuiz.getGuess(user._id, quizId)

        res.json({ success: true, data: guess ? [guess] : [] })
    } catch (e) {
        next(e)
    }
}

export const guess: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { id: quizId } = req.params
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        const guess = await repositories.characterQuiz.guess(user._id, quizId, req.body.characterId)

        res.json({ success: true, data: guess })
    } catch (e) {
        next(e)
    }
}
