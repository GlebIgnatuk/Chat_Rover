import { createPath, createUrl } from '@/utils/path'

export const APP_PATH = 'app'
export const APP_PROTECTED_PATH = ''
export const APP_AUTH_PATH = 'auth'
export const APP_ADMIN_PATH = 'admin'

export const buildPublicPath = (path: string) => {
    return createPath(path)
}

export const buildAppPath = (path: string) => {
    return createPath(APP_PATH, path)
}

export const buildProtectedPath = (path: string) => {
    return createPath(APP_PATH, APP_PROTECTED_PATH, path)
}

export const buildAuthPath = (path: string) => {
    return createPath(APP_PATH, APP_AUTH_PATH, path)
}

export const buildImagePath = (path: string) => {
    return createPath(import.meta.env.BASE_URL, path)
}

export const buildImageUrl = (path: string) => {
    // @todo remove after deployed
    if (path.startsWith(import.meta.env.BASE_URL)) {
        return createUrl(window.location.origin, path)
    }

    return createUrl(window.location.origin, import.meta.env.BASE_URL, path)
}
