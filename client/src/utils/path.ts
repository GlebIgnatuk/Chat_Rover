export const createPath = (...paths: string[]) => {
    let path = paths.join('/').replace(/\/+/g, '/')
    path = path.endsWith('/') ? path.substring(0, path.length - 1) : path
    path = path.startsWith('/') ? path : `/${path}`

    return path
}

export const createUrl = (base: string, ...paths: string[]) => {
    const b = base.endsWith('/') ? base.substring(0, base.length - 1) : base
    const path = createPath(...paths)

    return `${b}${path}`
}
