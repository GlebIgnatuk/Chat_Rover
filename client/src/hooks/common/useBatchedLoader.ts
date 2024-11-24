import { useEffect, useState } from 'react'

type Data<T extends readonly (() => unknown)[] | []> = {
    readonly [P in keyof T]: PromiseSettledResult<Awaited<ReturnType<T[P]>>>
}

export const useBatchedLoader = <T extends readonly (() => unknown)[] | []>(
    values: T,
    onCancel: () => void,
    failFast: boolean = true,
    deps?: unknown[],
) => {
    const [data, setData] = useState<Data<T>>()
    const [loaded, setLoaded] = useState(0)

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
                setLoaded((prev) => prev + 1)
                return value
            })
        })

        const run = async () => {
            if (failFast) {
                const results = await Promise.all(promises)
                const transformed = results.map((r) => ({
                    status: 'fulfilled',
                    value: r,
                })) as Data<T>
                setData(transformed)
            } else {
                const results = (await Promise.allSettled(promises)) as Data<T>
                setData(results)
            }
        }

        run()

        return onCancel
    }, deps ?? [])

    return {
        data,
        loaded,
        toLoad: values.length,
    }
}
