import { Asset, loadAssetAsync } from '@/services/AssetsCache'
import { useEffect, useState } from 'react'

export const useAsset = <A extends Asset>(
    type: A['type'],
    url: string,
): { asset: A['asset'] | null; error: string | null } => {
    const [asset, setAsset] = useState<A['asset'] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadAssetAsync(type, url)
            .then(setAsset)
            .catch((e) => setError((e as Error).message))
    }, [type, url])

    return {
        asset,
        error,
    }
}
