import { IAuthorizedRequestHandler } from '../types'
import { profileSchema, searchQuerySchema } from '../../../validators/profileValidator'
import qs from 'qs'

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
        const { error, value } = profileSchema.validate(payload, { abortEarly: false })
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
        const { error, value } = profileSchema.validate(payload, { abortEarly: false })
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
        const { repositories, identity } = res.locals

        // Use qs to parse query string and work with complex arrays, objects, etc.
        const query = qs.parse(req.query)

        // Validate query parameters with Joi schema
        const { error, value } = searchQuerySchema.validate(query, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.details,
            })
        }

        const searchParams: any = {}

        if (Object.keys(value).length === 0 || value.page || value.limit) {
            // No significant query parameters provided, return profiles for the authorized user
            const user = await repositories.user.getByExternalId(identity.user.id)
            if (!user) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }
            searchParams.userId = user._id
        } else {
            // uid and nickname override other params
            if (value.uid) {
                searchParams.uid = value.uid
            } else if (value.nickname) {
                searchParams.nickname = value.nickname
            } else {
                // Build search parameters from validated query
                if (value.server) searchParams.server = value.server
                if (value.usesVoice !== undefined) searchParams.usesVoice = value.usesVoice
                if (value.language)
                    searchParams.languages = Array.isArray(value.language)
                        ? value.language
                        : [value.language]
                if (value.minWorldLevel) searchParams.minWorldLevel = value.minWorldLevel
                if (value.maxWorldLevel) searchParams.maxWorldLevel = value.maxWorldLevel
                if (value.limit) searchParams.limit = value.limit
                if (value.page) searchParams.page = value.page

                // Handle team parameters
                const teamParams = []
                for (let i = 0; i < 3; i++) {
                    const teamMember: any = {}
                    if (value[`team[${i}][characterId]`]) {
                        teamMember.characterId = value[`team[${i}][characterId]`]
                    }
                    if (value[`team[${i}][minLevel]`]) {
                        teamMember.minLevel = value[`team[${i}][minLevel]`]
                    }
                    if (value[`team[${i}][maxLevel]`]) {
                        teamMember.maxLevel = value[`team[${i}][maxLevel]`]
                    }
                    if (value[`team[${i}][minConstellation]`]) {
                        teamMember.minConstellation = value[`team[${i}][minConstellation]`]
                    }
                    if (value[`team[${i}][maxConstellation]`]) {
                        teamMember.maxConstellation = value[`team[${i}][maxConstellation]`]
                    }

                    if (Object.keys(teamMember).length > 0) {
                        teamParams[i] = teamMember
                    }
                }

                if (teamParams.length > 0) {
                    searchParams.team = teamParams
                }
            }
        }

        const profiles = await repositories.profile.search(searchParams)

        const pagination = {
            limit: searchParams.limit || 5,
            page: searchParams.page || 1,
            // You can add totalPages, totalRecords if needed from the profiles response
        }

        res.json({ success: true, data: profiles, pagination })
    } catch (e) {
        next(e)
    }
}
