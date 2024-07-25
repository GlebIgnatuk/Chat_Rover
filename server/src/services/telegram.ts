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
