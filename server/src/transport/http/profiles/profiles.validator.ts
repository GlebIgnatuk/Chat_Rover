import { SUPPORTED_LANGUAGES, SUPPORTED_SERVERS } from '@/config/config'
import Joi from 'joi'
import { Types } from 'mongoose'

// Team member schema
const teamMemberSchema = Joi.object({
    characterId: Joi.string()
        .custom((value, helpers) => {
            if (!Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid')
            }
            return value
        })
        .required(),
    level: Joi.number().integer().min(1).max(90).required(),
    constellation: Joi.number().integer().min(0).max(6).required(),
}).allow(null)

export const postSchema = Joi.object({
    userId: Joi.required(),
    uid: Joi.number().integer().min(1).max(999_999_999).required(),
    about: Joi.string().min(0).max(255),
    nickname: Joi.string().min(1).max(55).required(),
    server: Joi.string()
        .valid(...SUPPORTED_SERVERS)
        .required(),
    usesVoice: Joi.boolean().required(),
    languages: Joi.array()
        .items(
            Joi.string()
                .valid(...SUPPORTED_LANGUAGES)
                .required(),
        )
        .min(1)
        .required(),
    worldLevel: Joi.number().integer().min(1).max(8).required(),
    team: Joi.array()
        .items(teamMemberSchema)
        .length(3)
        .custom((value, helper) => {
            if ((value as any[]).some((v) => v !== null)) return value

            return helper.message({ custom: 'At least 1 team member must be selected' })
        })
        .required(),
})

export const putSchema = postSchema

export const searchSchema = Joi.object({
    id: Joi.string(),
    userId: Joi.string(),
    uid: Joi.number().integer().min(0).max(999_999_999),
    nickname: Joi.string().min(1).max(55),
    server: Joi.string().valid(...SUPPORTED_SERVERS),
    usesVoice: Joi.boolean(),
    languages: Joi.array().items(Joi.string().valid(...SUPPORTED_LANGUAGES)),
    minWorldLevel: Joi.number().integer().min(1).max(8),
    maxWorldLevel: Joi.number().integer().min(1).max(8),
    team: Joi.array()
        .items(
            Joi.object({
                characterId: Joi.string().required(),
                minLevel: Joi.number().integer().min(1).max(90),
                maxLevel: Joi.number().integer().min(1).max(90),
                minConstellation: Joi.number().integer().min(0).max(6),
                maxConstellation: Joi.number().integer().min(0).max(6),
            }).allow(null),
        )
        .max(3),

    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(20),
})
