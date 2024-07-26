import { UserModel } from '@/models/user'
import { validateUserPayload } from '@/services/telegram'
import { Handler } from 'express'

export const getAuthenticated: Handler = async (req, res) => {
    const token = process.env.TELEGRAM_TOKEN || ''

    try {
        const { user: identity } = validateUserPayload(req.headers['x-telegram-init-data'] as string, token)

        await new Promise((res) => setTimeout(res, 2000))

        const user = await UserModel.getByUserId(identity.id)
        if (!user) {
            return res.status(404).json({ success: false, error: 'NOT_FOUND' })
        }

        res.json({ success: true, data: { user, identity } })
    } catch (e) {
        res.status(403).json({ success: false, error: 'Invalid user data' })
    }
}

export const create: Handler = async (req, res) => {
    const token = process.env.TELEGRAM_TOKEN || ''

    try {
        const { user: identity } = validateUserPayload(req.headers['x-telegram-init-data'] as string, token)

        await new Promise((res) => setTimeout(res, 2000))

        const user = await UserModel.create({
            displayName: req.body.displayName,
            userId: identity.id,
        })
        if (!user) {
            return res.status(500)
        }

        res.json({ success: true, data: { user, identity } })
    } catch (e) {
        res.status(403).json({ success: false, error: 'Invalid user data' })
    }
}

export const deleteAuthenticated: Handler = async (req, res) => {
    const token = process.env.TELEGRAM_TOKEN || ''

    try {
        const { user: identity } = validateUserPayload(req.headers['x-telegram-init-data'] as string, token)

        await new Promise((res) => setTimeout(res, 1000))

        await UserModel.deleteByUserId(identity.id)

        res.json({ success: true })
    } catch (e) {
        res.status(403).json({ success: false, error: 'Invalid user data' })
    }
}
