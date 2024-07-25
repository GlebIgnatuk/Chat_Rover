import { validateUserPayload } from '@/services/telegram'
import { Handler } from 'express'

export const getAuthenticated: Handler = async (req, res) => {
    const token = process.env.TELEGRAM_TOKEN || ''

    try {
        const { user } = validateUserPayload(req.headers['x-telegram-init-data'] as string, token)

        // @todo remove timeout
        setTimeout(
            () =>
                res.json({
                    success: true,
                    data: user,
                }),
            2000,
        )
    } catch (e) {
        res.status(403).json({ success: false, error: 'Invalid user data' })
    }
}
