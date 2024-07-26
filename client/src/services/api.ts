export type APIResponse<T> =
    | {
          success: true
          data: T
      }
    | { success: false; error: string }

export const api = async <T = unknown>(path: string, init?: RequestInit): Promise<APIResponse<T>> => {
    const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...init,
        headers: {
            // @ts-expect-error add type definition later
            'x-telegram-init-data': window.Telegram.WebApp.initData,
            'content-type': 'application/json',
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
