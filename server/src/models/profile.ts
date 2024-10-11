import mongoose, { mongo, Types } from "mongoose";
import { IBaseModel } from "./base";

export interface ITeamMember {
  characterId: Types.ObjectId;
  level: number;
  constellation: number;
}

export interface IProfileModel extends IBaseModel {
  userId: Types.ObjectId;
  uid: number;
  about: string;
  nickname: string;
  server: "SEA" | "Asia" | "Europe" | "HMT" | "America";
  usesVoice: boolean;
  languages: string[];
  worldLevel: number;
  team: [ITeamMember | null, ITeamMember | null, ITeamMember | null];
}

export type IProfileDTO = mongo.WithId<IProfileModel>;

export const ProfileModel = {
  getCollection: () =>
    mongoose.connection.collection<IProfileModel>("profiles"),
};
