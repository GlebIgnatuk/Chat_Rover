import { RepositoryError } from '@/repositories/types'
import { IAuthorizedRequestHandler } from '../types'

// export const list: IAuthorizedRequestHandler = async (req, res, next) => {
//     try {
//         const { repositories } = res.locals

//         const giveaways = await repositories.expressGiveaway.list()

//         res.json({ success: true, data: giveaways })
//     } catch (e) {
//         next(e)
//     }
// }

export const listInListing: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        const giveaways = await repositories.expressGiveaway.listInListing(user._id)

        res.json({ success: true, data: giveaways })
    } catch (e) {
        next(e)
    }
}

export const listAdminListItems: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const giveaways = await repositories.expressGiveaway.listAdmin()

        res.json({ success: true, data: giveaways })
    } catch (e) {
        next(e)
    }
}

export const markWinnerAsProcessed: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const giveawayId = req.params.id
        const { repositories } = res.locals

        const giveaway = await repositories.expressGiveaway.markWinnerAsProcessed(
            giveawayId,
            req.body.winnerId,
        )

        res.json({ success: true, data: giveaway })
    } catch (e) {
        next(e)
    }
}

export const markWinnerAsPending: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const giveawayId = req.params.id
        const winnerId = req.params.winnerId

        const { repositories } = res.locals

        const giveaway = await repositories.expressGiveaway.markWinnerAsPending(
            giveawayId,
            winnerId,
        )

        res.json({ success: true, data: giveaway })
    } catch (e) {
        next(e)
    }
}

export const rerollWinner: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const giveawayId = req.params.id

        const { repositories } = res.locals

        const giveaway = await repositories.expressGiveaway.rerollWinner(
            giveawayId,
            req.body.winnerId,
        )

        res.json({ success: true, data: giveaway })
    } catch (e) {
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const giveaway = await repositories.expressGiveaway.create({
            name: req.body.name,
            cost: req.body.cost,
            durationInSeconds: req.body.durationInSeconds,
            giveawayItemId: req.body.giveawayItemId,
            maxWinners: req.body.maxWinners,
            minParticipants: req.body.minParticipants,
            maxParticipants: req.body.maxParticipants,
            scheduledAt: new Date(req.body.scheduledAt),
        })

        res.json({ success: true, data: giveaway })
    } catch (e) {
        next(e)
    }
}

export const addParticipant: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'No such user' })
        }

        try {
            await repositories.expressGiveaway.addParticipant(user._id, req.params.id)
            res.json({ success: true })
        } catch (e) {
            if (e instanceof RepositoryError) {
                res.status(400).json({ success: false, error: e.message })
            } else {
                throw e
            }
        }
    } catch (e) {
        next(e)
    }
}

export const remove: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const giveawayId = req.params.id
        const { repositories } = res.locals

        await repositories.expressGiveaway.delete(giveawayId)

        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}
