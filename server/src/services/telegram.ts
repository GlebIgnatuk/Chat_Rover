import { createHmac } from 'node:crypto'

export interface ValidatedUserPayload {
    auth_date: string
    chat_instance: string
    chat_type: string
    start_param: string
    user: {
        id: number
        username: string
        first_name?: string
        last_name?: string
        language_code: string
        is_premium: boolean
        allows_write_to_pm: boolean
    }
}

export const validateUserPayload = (payload: string, botToken: string) => {
    const params = new URLSearchParams(payload)
    const hash = params.get('hash')

    params.delete('hash')
    params.sort()
    const checkString = Array.from(params.keys())
        .map((key) => `${key}=${params.get(key)}`)
        .join('\n')

    const secret = createHmac('sha256', 'WebAppData').update(botToken)
    const computedHash = createHmac('sha256', secret.digest()).update(checkString).digest('hex')

    if (hash === computedHash) {
        return Array.from(params).reduce<Record<string, any>>((acc, [k, v]) => {
            acc[k] = k === 'user' ? JSON.parse(v) : v

            return acc
        }, {}) as ValidatedUserPayload
    } else {
        throw new Error('Data is invalid')
    }
}

export const validateUserPayloadMock = (payload: string, botToken: string) => {
    const params = new URLSearchParams(payload)
    params.delete('hash')

    if (params.get('user') === null) throw new Error('Data is invalid')

    return Array.from(params).reduce<Record<string, any>>((acc, [k, v]) => {
        acc[k] = k === 'user' ? JSON.parse(v) : v

        return acc
    }, {}) as ValidatedUserPayload
}

export class MarkupV2 {
    private text: string

    constructor(text?: string) {
        this.text = text ?? ''
    }

    static escape(text: string) {
        return text.replace(/([_\*\[\]\(\)~`\>#\+\-=\|\{\}\.\!])/g, '\\$1')
    }

    italic(text: string) {
        this.text += `_${MarkupV2.escape(text)}_`
        return this
    }

    bold(text: string, cond?: boolean) {
        if (cond == false) return this

        this.text += `*${MarkupV2.escape(text)}*`
        return this
    }

    inline(text: string) {
        this.text += `\`${MarkupV2.escape(text)}\``
        return this
    }

    link(text: string, url: string) {
        this.text += `[${MarkupV2.escape(text)}](${url})`
        return this
    }

    mention(id: number, as: string) {
        this.text += `[${MarkupV2.escape(as)}](tg://user?id=${id})`
        return this
    }

    plain(text: string) {
        this.text += MarkupV2.escape(text)
        return this
    }

    br(amount: number = 1) {
        this.text += '\n'.repeat(amount)
        return this
    }

    foreach<I>(items: I[], cb: (m: MarkupV2, item: I, idx: number) => any) {
        for (let i = 0; i < items.length; i++) {
            cb(this, items[i], i)
        }
        return this
    }

    build() {
        return this.text
    }
}

export class TelegramServerError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)

        this.code = code
    }
}

export class TelegramClientError extends Error {
    code: string

    constructor(code: string, message: string, stack?: string) {
        super(message)

        this.code = code
        this.stack = stack
    }
}

export type TelegramSuccessResponse<T = any> = { ok: true; result: T }
export type TelegramErrorResponse = { ok: false; error_code: number; description: string }

export type TelegramResponse<T = any> = TelegramSuccessResponse<T> | TelegramErrorResponse

export class TelegramApi {
    private readonly baseUrl: string
    private readonly apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
        this.baseUrl = 'https://api.telegram.org'
    }

    async _request<D = any>(path: string, init?: RequestInit): Promise<TelegramResponse<D>> {
        let response: Response
        try {
            response = await fetch(`${this.baseUrl}/bot${this.apiKey}${path}`, {
                ...init,
                headers: {
                    'Content-Type': 'application/json',
                    ...init?.headers,
                },
            })
        } catch (e) {
            throw new TelegramClientError(
                '',
                `Failed to send request: ${(e as Error).message}`,
                (e as Error).stack,
            )
        }

        if (!response.ok) {
            try {
                return (await response.json()) as TelegramErrorResponse
            } catch {
                const text = await response.text()
                throw new TelegramServerError(
                    '',
                    `Request failed with code ${response.status}: ${text}`,
                )
            }
        }

        let json: any
        try {
            json = await response.json()
        } catch (e) {
            throw new TelegramClientError(
                '',
                `Failed to parse json: ${(e as Error).message}`,
                (e as Error).stack,
            )
        }

        return json as TelegramResponse<D>
    }

    async getChatMember(chatId: string | number, userId: string | number) {
        const response = await this._request<{
            user: { id: number; is_bot: boolean; first_name: string; username?: string }
            status: string
        }>('/getChatMember', {
            method: 'POST',
            body: JSON.stringify({
                chat_id: chatId,
                user_id: userId,
            }),
        })

        if (response.ok !== true) {
            return null
        }

        return response.result
    }
}
