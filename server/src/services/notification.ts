import { IShopOrderDTO } from '@/models/shopOrder'
import { IUserDTO } from '@/models/user'
import { MarkupV2 } from './telegram'
import { IExpressGiveawayDTO } from '@/models/expressGiveaway'

export class NotificationService {
    static async sendOrderNotification(user: IUserDTO, order: IShopOrderDTO) {
        const grouped = order.products.reduce<Record<string, IShopOrderDTO['products']>>(
            (acc, n) => {
                const id = n.productId.toString()
                if (acc[id] === undefined) acc[id] = []
                acc[id].push(n)
                return acc
            },
            {},
        )

        const text = new MarkupV2()
            .plain('Благодарим за оформление заказа в приложении ')
            .link('Rover Chat', `tg://resolve?domain=rover_chat_bot&appname=rover_chat`)
            .plain(':')
            .br(2)
            .foreach(Object.values(grouped), (m, products) => {
                const product = products[0]

                m.plain(`- (x${products.length}) `)
                    .bold(product.name)
                    .plain(' | ')
                    .italic(
                        `${product.currency}${(product.price * products.length).toLocaleString()}`,
                    )
                    .br()
            })
            .br()
            .plain('Для того чтобы завершить покупку, пожалуйста напишите нам на этот аккаунт ')
            .link('@WuWa007', 'https://t.me/WuWa007')
            .plain('. Мы обработаем его как можно скорее. Спасибо!')
            .build()

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    chat_id: user.externalId,
                    text: text,
                    link_preview_options: {
                        is_disabled: true,
                    },
                    parse_mode: 'MarkdownV2',
                }),
            },
        )

        if (!response.ok) {
            throw new Error(`Failed to send notification: ${await response.text()}`)
        }
    }

    static async sendOrderReminder(user: IUserDTO, order: IShopOrderDTO) {
        const grouped = order.products.reduce<Record<string, IShopOrderDTO['products']>>(
            (acc, n) => {
                const id = n.productId.toString()
                if (acc[id] === undefined) acc[id] = []
                acc[id].push(n)
                return acc
            },
            {},
        )

        const text = new MarkupV2()
            .plain('Здравстуйте, напоминаем вам о вашем заказе в приложении ')
            .link('Rover Chat', `tg://resolve?domain=rover_chat_bot&appname=rover_chat`)
            .plain(':')
            .br(2)
            .foreach(Object.values(grouped), (m, products) => {
                const product = products[0]

                m.plain(`- (x${products.length}) `)
                    .bold(product.name)
                    .plain(' | ')
                    .italic(
                        `${product.currency}${(product.price * products.length).toLocaleString()}`,
                    )
                    .br()
            })
            .br()
            .plain('Для того чтобы завершить покупку, пожалуйста напишите нам на этот аккаунт ')
            .link('@WuWa007', 'https://t.me/WuWa007')
            .plain('. Спасибо!')
            .build()

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    chat_id: user.externalId,
                    text: text,
                    link_preview_options: {
                        is_disabled: true,
                    },
                    parse_mode: 'MarkdownV2',
                }),
            },
        )

        if (!response.ok) {
            throw new Error(`Failed to send notification: ${await response.text()}`)
        }
    }

    static async sendExpressGiveawayReminder(user: IUserDTO, giveaway: IExpressGiveawayDTO) {
        const text = new MarkupV2()
            .plain(`🎉 Здравствуйте, вы победили в розыгрыше ${giveaway.name} в приложении `)
            .link('Rover Chat', `tg://resolve?domain=rover_chat_bot&appname=rover_chat`)
            .plain(`🎉`)
            .br(2)
            .plain('Для того чтобы забрать приз, пожалуйста напишите нам на этот аккаунт ')
            .link('@WuWa007', 'https://t.me/WuWa007')
            .plain('. Спасибо!')
            .build()

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    chat_id: user.externalId,
                    text: text,
                    link_preview_options: {
                        is_disabled: true,
                    },
                    parse_mode: 'MarkdownV2',
                }),
            },
        )

        if (!response.ok) {
            throw new Error(`Failed to send notification: ${await response.text()}`)
        }
    }
}
