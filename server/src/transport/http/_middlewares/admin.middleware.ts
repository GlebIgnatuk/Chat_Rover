import { IAuthorizedRequestHandler } from '../types'

export const isAdmin: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' })
        }

        next()
    } catch (e) {
        next(e)
    }
}
