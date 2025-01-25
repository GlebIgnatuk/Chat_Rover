import { config } from '@/config/config'
import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const user = await repositories.user.get(req.params.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        const response = await fetch(
            `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/getChatMember`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: user.externalId,
                    user_id: user.externalId,
                }),
            },
        )
        if (!response.ok) {
            const text = await response.text()
            console.error(text)
            return res.status(400).json({ success: false, error: 'Something went wrong' })
        }

        const data = await response.json()

        res.json({ success: true, data: [data.result] })
    } catch (e) {
        next(e)
    }
}
