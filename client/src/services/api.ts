export const api = (path: string, init?: RequestInit) => {
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      // @ts-expect-error add type definition later
      'x-telegram-init-data': window.Telegram.WebApp.initData,
      'content-type': 'application/json',
      ...init?.headers,
    },
  })
}
