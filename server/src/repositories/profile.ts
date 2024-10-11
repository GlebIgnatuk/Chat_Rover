import { Types } from 'mongoose';
import { ID } from './types';
import { IProfileDTO, ITeamMember } from '@/models/profile';

export interface IProfileCreate {
  userId: ID;
  uid: number;
  about: string;
  nickname: string;
  server: 'SEA' | 'Asia' | 'Europe' | 'HMT' | 'America';
  usesVoice: boolean;
  languages: string[];
  worldLevel: number;
  team: [ITeamMember | null, ITeamMember | null, ITeamMember | null];
}

export interface IProfileUpdate extends Partial<IProfileCreate> {}

export interface IProfileRepository {
  get(id: ID): Promise<IProfileDTO | null>;
  getByUserId(userId: ID): Promise<IProfileDTO[] | null>;
  search(params: IProfileSearchParams): Promise<IProfileDTO[]>;
  create(payload: IProfileCreate): Promise<IProfileDTO>;
  update(id: ID, payload: IProfileUpdate): Promise<IProfileDTO | null>;
}

export interface IProfileSearchParams {
  uid?: number;
  nickname?: string;
  server?: string;
  usesVoice?: boolean;
  languages?: string[];
  minWorldLevel?: number;
  maxWorldLevel?: number;
  team?: ITeamSearchParams[];
  limit?: number;
  page?: number;
  userId?: ID;
}

export interface ITeamSearchParams {
  characterId?: Types.ObjectId;
  minLevel?: number;
  maxLevel?: number;
  minConstellation?: number;
  maxConstellation?: number;
}
