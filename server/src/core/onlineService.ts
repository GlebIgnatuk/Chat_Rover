import { IUserRepository } from '@/repositories/user'
import { ValidatedUserPayload } from '@/services/telegram'
import { Namespace, Server } from 'socket.io'

export class OnlineService {
    private readonly privateNS: Namespace

    private readonly userRepo: IUserRepository

    constructor(wss: Server, userRepo: IUserRepository) {
        this.privateNS = wss.of('/ws/users/activities')
        this.userRepo = userRepo
    }

    async trackActivity(ctx: ValidatedUserPayload) {
        const user = await this.userRepo.getByExternalId(ctx.user.id)
        if (!user) {
            throw new Error('No such user')
        }

        await this.userRepo.trackActivity(user._id)

        const updatedUser = await this.userRepo.get(user._id)
        if (updatedUser) this.privateNS.to(user._id.toString()).emit('online', updatedUser)
    }
}
