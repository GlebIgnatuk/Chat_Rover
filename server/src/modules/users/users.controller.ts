import { UserModel } from '@/models/user'
import { validateUserPayload } from '@/services/telegram'
import { Handler } from 'express'
import { IAuthorizedRequestHandler } from '../types'

export const getAuthenticated: IAuthorizedRequestHandler = async (_, res, next) => {
    try {
        const { repositories, identity } = res.locals

        // @todo remove delay
        await new Promise((res) => setTimeout(res, 2000))

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(404).json({ success: false, error: 'NOT_FOUND' })
        }

        res.json({ success: true, data: { user, identity } })
    } catch (e) {
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        // @todo remove delay
        await new Promise((res) => setTimeout(res, 2000))

        const user = await repositories.user.create({
            externalId: identity.user.id,
            language: req.body.language,
            nickname: req.body.nickname
        })

        res.json({ success: true, data: { user, identity } })
    } catch (e) {
        next(e)
    }
}

export const deleteAuthenticated: IAuthorizedRequestHandler = async (_, res, next) => {
    try {
        const { identity, repositories } = res.locals

        // @todo remove delay
        await new Promise((res) => setTimeout(res, 1000))

        await repositories.user.deleteByExternalId(identity.user.id)

        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}
