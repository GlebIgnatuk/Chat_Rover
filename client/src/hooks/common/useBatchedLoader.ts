import { useEffect, useState } from 'react'

type Data<T extends readonly (() => unknown)[] | []> = {
    readonly [P in keyof T]: PromiseSettledResult<Awaited<ReturnType<T[P]>>>
}

type ResolvedData<T extends readonly (() => unknown)[] | []> = {
    readonly [P in keyof T]: Awaited<ReturnType<T[P]>>
}

// type BaseBatchedLoaderResult = {
//     nLoaded: number
//     nLoad: number
//     success: boolean
// }

// type BatchedLoaderResult<T extends readonly (() => unknown)[] | []> = BaseBatchedLoaderResult &
//     (
//         | {
//               loaded: true
//               data: Data<T>
//           }
//         | { loaded: false; data: undefined }
//     )

export const useBatchedLoader = <T extends readonly (() => unknown)[] | []>(
    {
        values,
        failFast,
        onCancel,
    }: {
        values: T
        onCancel: () => void
        failFast?: boolean
    },
    deps?: unknown[],
) => {
    const [data, setData] = useState<Data<T>>()
    const [nLoaded, setNLoaded] = useState(0)

    useEffect(() => {
        const promises = values.map((v) => {
            const unwrapped = v()

            let promise: Promise<unknown>
            if (unwrapped instanceof Promise) {
                promise = unwrapped
            } else {
                promise = Promise.resolve(unwrapped)
            }

            return promise.then((value) => {
                setNLoaded((prev) => prev + 1)
                return value
            })
        })

        const run = async () => {
            if (failFast) {
                try {
                    const results = await Promise.all(promises)
                    const transformed = results.map((r) => ({
                        status: 'fulfilled',
                        value: r,
                    })) as Data<T>
                    setData(transformed)
                } catch {
                    const transformed = promises.map(() => ({
                        status: 'rejected',
                        reason: 'One or more async operation failed.',
                    })) as Data<T>
                    setData(transformed)
                }
            } else {
                const results = (await Promise.allSettled(promises)) as Data<T>
                setData(results)
            }
        }

        run()

        return onCancel
    }, deps ?? [])

    const $unwrap = (): ResolvedData<T> => {
        if (!data) throw new Error('"data" is not ready')
        const rejected = data.filter((d) => d.status === 'rejected') as PromiseRejectedResult[]
        if (rejected.length !== 0) {
            throw new Error(
                `Failed to unwrap rejected promises: \n${rejected.map((p) => `- ${p.reason}`).join('\n')}`,
            )
        }

        const unwrapped = data.map((d) => (d as PromiseFulfilledResult<unknown>).value)
        return unwrapped as ResolvedData<T>
    }

    return {
        data,
        nLoaded,
        nLoad: values.length,
        $unwrap,
    }
}
