export type VideoAsset = { type: 'video'; asset: HTMLVideoElement }
export type ImageAsset = { type: 'img'; asset: HTMLImageElement }

export type Asset = VideoAsset | ImageAsset

const assets = new Map<string, Asset>()

export const loadAssetAsync = async <A extends Asset>(
    type: A['type'],
    url: string,
): Promise<A['asset']> => {
    if (assets.has(url)) return assets.get(url)!.asset

    switch (type) {
        case 'img': {
            return new Promise((res, rej) => {
                const asset = document.createElement('img')
                asset.onload = () => {
                    res(asset)
                }
                asset.onerror = rej

                assets.set(url, { type: 'img', asset })
                asset.src = url
            })
        }

        case 'video': {
            return new Promise((res, rej) => {
                const asset = document.createElement('video')
                asset.onload = () => {
                    res(asset)
                }
                asset.onerror = rej

                assets.set(url, { type: 'video', asset })
                asset.preload = 'auto'
                asset.src = url
            })
        }

        default:
            throw new Error('Not supported')
    }
}
