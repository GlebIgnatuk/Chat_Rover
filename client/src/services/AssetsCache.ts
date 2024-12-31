// export type VideoAsset = { type: 'video'; asset: HTMLVideoElement }
// export type ImageAsset = { type: 'img'; asset: HTMLImageElement }

type Asset = HTMLVideoElement | HTMLImageElement

const assets = new Map<string, Asset>()

export const loadAssetAsync = async <T extends Asset>(
    type: 'img' | 'video',
    url: string,
): Promise<T> => {
    if (assets.has(url)) return assets.get(url)! as T

    switch (type) {
        case 'img': {
            return new Promise((res, rej) => {
                const asset = document.createElement('img')
                asset.onload = () => {
                    res(asset as T)
                }
                asset.onerror = rej

                assets.set(url, asset)
                asset.src = url
            })
        }

        case 'video': {
            return new Promise((res, rej) => {
                const asset = document.createElement('video')
                asset.onload = () => {
                    res(asset as T)
                }
                asset.onerror = rej

                assets.set(url, asset)
                asset.preload = 'auto'
                asset.src = url
            })
        }

        default:
            throw new Error('Not supported')
    }
}
