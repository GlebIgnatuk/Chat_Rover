import { IAuthorizedRequestHandler } from '../types'
import qs from 'qs'
import { postSchema, putSchema, searchSchema } from './profiles.validator'

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({ success: false, error: 'User not found' })
        }

        const payload = req.body
        payload.userId = user._id

        // Validate payload with imported Joi schema
        const { error, value } = postSchema.validate(payload, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.details,
            })
        }

        // Create profile using validated payload
        const profile = await repositories.profile.create(value)

        res.json({ success: true, data: profile })
    } catch (e) {
        next(e)
    }
}

export const update: IAuthorizedRequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals
        const { id } = req.params

        const profile = await repositories.profile.get(id)
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' })
        }

        // Ensure that the profile belongs to the authenticated user
        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user || !profile.userId.equals(user._id)) {
            return res.status(403).json({ success: false, error: 'Forbidden' })
        }

        const payload = req.body

        // Validate payload with Joi schema
        const { error, value } = putSchema.validate(payload, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.details,
            })
        }

        const updatedProfile = await repositories.profile.update(id, value)

        res.json({ success: true, data: updatedProfile })
    } catch (e) {
        next(e)
    }
}

export const getMine: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(403).json({ success: false, error: 'Forbidden' })
        }

        const profiles = await repositories.profile.getByUserId(user._id)
        if (!profiles) {
            return res.status(404).json({ success: false, error: 'Profile not found' })
        }

        res.json({
            success: true,
            data: profiles.map((p) => {
                const { createdAt, updatedAt, ...profile } = p

                return profile
            }),
        })
    } catch (e) {
        next(e)
    }
}

export const search: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals
        console.log(JSON.stringify(qs.parse(req.query), null, 2))
        // Validate query parameters with Joi schema
        const { error, value } = searchSchema.validate(qs.parse(req.query), { abortEarly: false })
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.details,
            })
        }

        const { limit, page, ...searchOptions } = value

        const profiles = await repositories.profile.search(searchOptions)

        const pagination = {
            limit: value.limit || 5,
            page: value.page || 1,
            // You can add totalPages, totalRecords if needed from the profiles response
        }

        res.json({ success: true, data: profiles, pagination })
    } catch (e) {
        next(e)
    }
}
