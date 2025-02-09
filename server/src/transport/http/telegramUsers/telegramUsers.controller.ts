import { config } from '@/config/config'
import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, services } = res.locals

        const user = await repositories.user.get(req.params.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        const externalUser = await services.telegramApi.getChatMember(
            config.TELEGRAM_CHANNEL_ID,
            user.externalId,
        )

        if (externalUser) {
            res.json({ success: true, data: [externalUser] })
        } else {
            res.json({ success: true, data: [] })
        }
    } catch (e) {
        next(e)
    }
}
