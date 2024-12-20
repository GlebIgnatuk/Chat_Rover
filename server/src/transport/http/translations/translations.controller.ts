import { IAuthorizedRequestHandler } from '../types'

export const getAll: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const translations = await repositories.translation.getAll()

        if (!translations || translations.length === 0) {
            return res.status(404).json({ success: false, error: 'No translations found' })
        }

        const result = translations.reduce((acc, translation) => {
            const { language, key, description, value } = translation

            if (!acc[language]) {
                acc[language] = {}
            }

            acc[language][key] = {
                description,
                value,
            }

            return acc
        }, {} as Record<string, Record<string, { description: string; value: string }>>)

        res.json({ success: true, data: result })
    } catch (e) {
        console.error('Error fetching all translations:', e)
        next(e)
    }
}

export const getByLanguage: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals
        const { language } = req.params

        const translations = await repositories.translation.getByLanguage(language)

        if (!translations || Object.keys(translations).length === 0) {
            return res.status(404).json({ success: false, error: 'No translations found for the specified language' })
        }

        res.json({ success: true, data: translations })
    } catch (e) {
        console.error('Error fetching translations by language:', e)
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals
        const payload = req.body

        if (!payload.key || !payload.language || !payload.value) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: 'Key, language, and value are required fields',
            })
        }

        const translation = await repositories.translation.create(payload)

        res.json({ success: true, data: translation })
    } catch (e) {
        console.error('Error creating translation:', e)
        next(e)
    }
}

export const update: IAuthorizedRequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { repositories } = res.locals
        const { id } = req.params
        const payload = req.body

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: 'Payload cannot be empty',
            })
        }

        const updatedTranslation = await repositories.translation.update(id, payload)

        if (!updatedTranslation) {
            return res.status(404).json({ success: false, error: 'Translation not found' })
        }

        res.json({ success: true, data: updatedTranslation })
    } catch (e) {
        console.error('Error updating translation:', e)
        next(e)
    }
}

export const remove: IAuthorizedRequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        const { repositories } = res.locals
        const { id } = req.params

        const success = await repositories.translation.delete(id)

        if (!success) {
            return res.status(404).json({ success: false, error: 'Translation not found' })
        }

        res.json({ success: true, message: 'Translation deleted' })
    } catch (e) {
        console.error('Error deleting translation:', e)
        next(e)
    }
}
