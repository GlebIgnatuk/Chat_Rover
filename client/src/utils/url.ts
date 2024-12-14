import { AUTH_PATH_PREFIX, PATH_PREFIX, PROTECTED_PATH_PREFIX } from '@/config/config'

const _buildUrl = (path: string, prefix: string = '/') => {
    if (path.length === 0 || (path.length === 1 && path[0] === '/')) {
        return prefix
    } else {
        if (prefix.endsWith('/')) {
            return [prefix, path.startsWith('/') ? path.substring(1) : path].join('')
        } else {
            return [prefix, path.startsWith('/') ? path.substring(1) : path].join('/')
        }
    }
}

export const buildPublicUrl = (path: string) => {
    return _buildUrl(path)
}

export const buildProtectedUrl = (path: string) => {
    return _buildUrl(path, _buildUrl(PROTECTED_PATH_PREFIX, PATH_PREFIX))
}

export const buildAuthUrl = (path: string) => {
    return _buildUrl(path, _buildUrl(AUTH_PATH_PREFIX, PATH_PREFIX))
}

export const buildImageUrl = (path: string) => {
    return _buildUrl(path, window.location.origin)
}
