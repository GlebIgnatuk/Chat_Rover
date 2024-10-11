import { IProfileDTO, ProfileModel } from '@/models/profile';
import { ID } from '../types';
import { IProfileCreate, IProfileRepository, IProfileUpdate, IProfileSearchParams, ITeamSearchParams } from '../profile';
import { Types } from 'mongoose';

export class ProfileRepository implements IProfileRepository {
  async get(id: ID): Promise<IProfileDTO | null> {
    return ProfileModel.getCollection().findOne({ _id: new Types.ObjectId(id) });
  }

  async getByUserId(userId: ID): Promise<IProfileDTO | null> {
    return ProfileModel.getCollection().findOne({ userId: new Types.ObjectId(userId) });
  }

  async create(payload: IProfileCreate): Promise<IProfileDTO> {
    const now = new Date();

    const result = await ProfileModel.getCollection().insertOne({
      ...payload,
      userId: new Types.ObjectId(payload.userId),
      createdAt: now,
      updatedAt: now,
    });

    const profile = await this.get(result.insertedId);
    if (!profile) {
      throw new Error('Failed to create a profile.');
    }

    return profile;
  }

  async update(id: ID, payload: IProfileUpdate): Promise<IProfileDTO | null> {
    const now = new Date();
  
    // Exclude userId from the update payload
    const { userId, ...updatePayload } = payload;
  
    await ProfileModel.getCollection().updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          ...updatePayload,
          updatedAt: now,
        },
      },
    );
  
    return this.get(id);
  }

  async search(params: IProfileSearchParams): Promise<IProfileDTO[]> {
    const query: any = {};

    if (params.uid !== undefined) {
      query.uid = params.uid;
    }

    if (params.nickname !== undefined) {
      query.nickname = params.nickname;
    }

    if (params.server !== undefined) {
      query.server = params.server;
    }

    if (params.usesVoice !== undefined) {
      query.usesVoice = params.usesVoice;
    }

    if (params.languages && params.languages.length > 0) {
      query.languages = { $all: params.languages };
    }

    if (params.minWorldLevel !== undefined || params.maxWorldLevel !== undefined) {
      query.worldLevel = {};
      if (params.minWorldLevel !== undefined) {
        query.worldLevel.$gte = params.minWorldLevel;
      }
      if (params.maxWorldLevel !== undefined) {
        query.worldLevel.$lte = params.maxWorldLevel;
      }
    }

    if (params.team && params.team.length > 0) {
      params.team.forEach((teamMemberParams, index) => {
        const teamMemberQuery: any = {};
        const teamPath = `team.${index}`;

        if (teamMemberParams.characterId) {
          teamMemberQuery[`${teamPath}.characterId`] = new Types.ObjectId(teamMemberParams.characterId);
        }

        if (teamMemberParams.minLevel !== undefined || teamMemberParams.maxLevel !== undefined) {
          teamMemberQuery[`${teamPath}.level`] = {};
          if (teamMemberParams.minLevel !== undefined) {
            teamMemberQuery[`${teamPath}.level`].$gte = teamMemberParams.minLevel;
          }
          if (teamMemberParams.maxLevel !== undefined) {
            teamMemberQuery[`${teamPath}.level`].$lte = teamMemberParams.maxLevel;
          }
        }

        if (teamMemberParams.minConstellation !== undefined || teamMemberParams.maxConstellation !== undefined) {
          teamMemberQuery[`${teamPath}.constellation`] = {};
          if (teamMemberParams.minConstellation !== undefined) {
            teamMemberQuery[`${teamPath}.constellation`].$gte = teamMemberParams.minConstellation;
          }
          if (teamMemberParams.maxConstellation !== undefined) {
            teamMemberQuery[`${teamPath}.constellation`].$lte = teamMemberParams.maxConstellation;
          }
        }

        Object.assign(query, teamMemberQuery);
      });
    }

    if (params.userId !== undefined) {
      query.userId = new Types.ObjectId(params.userId);
    }

    const limit = params.limit ? Math.min(params.limit, 100) : 10; // Default limit to 20, max 100
    const page = params.page && params.page > 0 ? params.page : 1;

    return ProfileModel.getCollection()
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
  }
}
