import { Types } from "mongoose";

export type ID = string | Types.ObjectId

export interface PaginationOptions {
    limit: number
    page: number
}