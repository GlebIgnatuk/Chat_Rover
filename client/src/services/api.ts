export type APISuccessResponse<T = unknown> = {
    success: true
    data: T
}

export type APIErrorResponse = {
    success: false
    error: string
    code?: string
    details?: { message: string; path: string[]; type: string }[]
}

export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse

export const api = async <T = unknown>(
    path: string,
    init?: RequestInit,
): Promise<APIResponse<T>> => {
    const headers: Record<string, string> = {
        // @ts-expect-error add type definition later
        'x-telegram-init-data': window.Telegram.WebApp.initData,
    }
    if (init?.body instanceof FormData === false) {
        headers['content-type'] = 'application/json'
    }

    const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...init,
        headers: {
            ...headers,
            ...init?.headers,
        },
    })

    if (rawResponse.ok) {
        return await rawResponse.json()
    } else {
        try {
            return await rawResponse.json()
        } catch {
            return {
                success: false,
                error: rawResponse.status.toString(),
            }
        }
    }
}
