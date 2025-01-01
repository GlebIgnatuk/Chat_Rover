import { IServices } from '@/core/types'
import { IRepositories } from '@/repositories/repositories'
import { ValidatedUserPayload } from '@/services/telegram'
import { RequestHandler } from 'express'

export type IRequestHandler<
    P = Record<string, string>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Record<string, string>,
    Locals extends Record<string, any> = Record<string, any>,
> = RequestHandler<
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    { repositories: IRepositories; services: IServices; identity?: ValidatedUserPayload } & Locals
>

export type IAuthorizedRequestHandler<
    P = Record<string, string>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Record<string, string>,
    Locals extends Record<string, any> = Record<string, any>,
> = RequestHandler<
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    { repositories: IRepositories; services: IServices; identity: ValidatedUserPayload } & Locals
>
