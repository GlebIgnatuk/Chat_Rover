import { api } from '@/services/api'
import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'

export const ErrorBoundaryScreen = () => {
    const error = useRouteError()

    let errorName: string
    let stack: string | undefined = undefined
    let message: string
    if (error instanceof Error) {
        errorName = error.name
        message = error.message
        stack = error.stack
    } else if (typeof error === 'string') {
        errorName = 'Error'
        message = error
    } else {
        errorName = 'Error'
        message = error!.toString()
    }

    useEffect(() => {
        api('/public/errors', {
            method: 'POST',
            body: JSON.stringify({
                name: errorName,
                message,
                stack,
                location: window.location.href,
            }),
        })
    }, [error])

    return (
        <div className="h-full bg-[#131313] flex flex-col justify-center items-center gap-3">
            <div className="text-4xl text-red-500">Oops!</div>
            <div className="text-1xl px-3 text-center">
                We encountered an error. <br />
                We already know about it and working on a fix.
            </div>
            <div className="text-1xl whitespace-nowrap overflow-hidden text-ellipsis w-full px-4 text-center">
                {message}
            </div>
            <button
                className="bg-stone-800 text-primary-700 border border-primary-700 px-4 py-1 rounded-full"
                onClick={() => {
                    window.location.reload()
                }}
            >
                Reload
            </button>
        </div>
    )
}
