import { pathPrefix } from '@/config/config'

export const buildUrl = (path: string) => {
  if (path === '' || path === '/') return pathPrefix

  const parts = [pathPrefix, path.startsWith('/') ? path.substring(1) : path]

  return parts.join('/')
}
