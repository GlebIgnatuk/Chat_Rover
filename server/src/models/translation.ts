import mongoose, { Types } from "mongoose";
import { IBaseModel } from "./base";

export interface ITranslationModel extends IBaseModel {
  key: string;
  description: string;
  language: string;
  value: string;
}

export type ITranslationDTO = mongoose.mongo.WithId<ITranslationModel>;

export const TranslationModel = {
  getCollection: () =>
    mongoose.connection.collection<ITranslationModel>("translations"),
};
