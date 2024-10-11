import Joi from 'joi';
import { Types } from 'mongoose';

// Allowed server names
const serverNames = ['SEA', 'Asia', 'Europe', 'HMT', 'America'] as const;

// Allowed language codes in ISO ALPHA-2 format
const allowedLanguages = ['en', 'zh', 'zh', 'ja', 'ko', 'fr', 'de', 'es'] as const;

// Team member schema
const teamMemberSchema = Joi.object({
  characterId: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required(),
  level: Joi.number().integer().min(1).max(90).required(),
  constellation: Joi.number().integer().min(0).max(6).required(),
}).allow(null);

// Profile schema for POST and PUT
export const profileSchema = Joi.object({
  userId: Joi.required(),
  uid: Joi.number().integer().min(0).max(999999999).required(),
  about: Joi.string().max(255).required(),
  nickname: Joi.string().min(1).max(55).required(),
  server: Joi.string()
    .valid(...serverNames)
    .required(),
  usesVoice: Joi.boolean().required(),
  languages: Joi.array()
    .items(
      Joi.string()
        .valid(...allowedLanguages)
        .required()
    )
    .required()
    .min(1),
  worldLevel: Joi.number().integer().min(1).max(8).required(),
  team: Joi.array()
    .items(teamMemberSchema)
    .length(3)
    .required(),
});

export const searchQuerySchema = Joi.object({
  uid: Joi.number().integer().min(0).max(999999999),
  nickname: Joi.string().min(1).max(55),
  server: Joi.string().valid(...serverNames),
  usesVoice: Joi.boolean(),
  language: Joi.string().valid(...allowedLanguages),
  minWorldLevel: Joi.number().integer().min(1).max(8),
  maxWorldLevel: Joi.number().integer().min(1).max(8),
  limit: Joi.number().integer().min(1),
  page: Joi.number().integer().min(1),
  'team[0][characterId]': Joi.string(),
  'team[0][minLevel]': Joi.number().integer().min(1).max(90),
  'team[0][maxLevel]': Joi.number().integer().min(1).max(90),
  'team[0][minConstellation]': Joi.number().integer().min(0).max(6),
  'team[0][maxConstellation]': Joi.number().integer().min(0).max(6),
  'team[1][characterId]': Joi.string(),
  'team[1][minLevel]': Joi.number().integer().min(1).max(90),
  'team[1][maxLevel]': Joi.number().integer().min(1).max(90),
  'team[1][minConstellation]': Joi.number().integer().min(0).max(6),
  'team[1][maxConstellation]': Joi.number().integer().min(0).max(6),
  'team[2][characterId]': Joi.string(),
  'team[2][minLevel]': Joi.number().integer().min(1).max(90),
  'team[2][maxLevel]': Joi.number().integer().min(1).max(90),
  'team[2][minConstellation]': Joi.number().integer().min(0).max(6),
  'team[2][maxConstellation]': Joi.number().integer().min(0).max(6),
});