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
