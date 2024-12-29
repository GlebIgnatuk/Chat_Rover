import { useEffect, useState } from 'react'

export const ExportsScreen = () => {
    const [countDown, setCountDown] = useState(-1)

    useEffect(() => {
        const opener = window.opener
        if (!opener) return

        window.addEventListener('beforeunload', () => {
            opener.postMessage({ type: 'EXPORTS:DEINIT' })
        })

        window.addEventListener(
            'message',
            (e) => {
                const data = e.data.payload

                const link = document.createElement('a')
                link.download = `profile.png`
                link.href = data
                link.click()

                const countDown = 5
                for (let i = 0; i <= countDown; i++) {
                    setTimeout(() => setCountDown(i), (countDown - i) * 1000)
                }

                setTimeout(
                    () => {
                        opener.postMessage({ type: 'EXPORTS:DEINIT' })
                    },
                    (countDown + 0.2) * 1000,
                )
            },
            { once: true },
        )

        opener.postMessage({ type: 'EXPORTS:INIT' })
    }, [])

    return (
        <div className="h-full flex flex-col gap-10 items-center justify-center text-primary-700 bg-[#131313]">
            <div className="text-3xl">Exporting...</div>
            {countDown !== -1 && (
                <div className="text-sm">The page will close in {countDown} seconds</div>
            )}
        </div>
    )
}
