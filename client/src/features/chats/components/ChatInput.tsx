import { forwardRef, useEffect, useRef } from 'react'

export interface ChatInputProps {
    placeholder?: string
    disabled?: boolean
    buttonText?: string
    onSubmit?: (text: string) => void
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
    ({ onSubmit, placeholder, disabled, buttonText }, ref) => {
        const localRef = useRef<HTMLInputElement | null>()

        useEffect(() => {
            const handler = (e: KeyboardEvent) => {
                if (e.key !== 'Enter') return
                if (!localRef.current) return

                onSubmit?.(localRef.current.value)
            }

            window.addEventListener('keypress', handler)

            return () => {
                window.removeEventListener('keypress', handler)
            }
        }, [onSubmit])

        return (
            <div className="flex">
                <input
                    type="text"
                    className="grow px-3 py-2 bg-stone-900 outline-none text-white text-md"
                    placeholder={placeholder ?? 'Type something...'}
                    autoCorrect="off"
                    autoComplete="off"
                    ref={(e) => {
                        if (typeof ref === 'function') {
                            ref(e)
                        } else if (ref) {
                            ref.current = e
                        }

                        localRef.current = e
                    }}
                />
                <button
                    className="shrink-0 px-3 py-2 bg-stone-800 text-accent font-medium disabled:bg-stone-600"
                    disabled={disabled}
                    onClick={(e) => {
                        e.preventDefault()
                        localRef.current?.focus()
                        onSubmit?.(e.currentTarget.value)
                    }}
                >
                    {buttonText ?? 'Send'}
                </button>
            </div>
        )
    },
)
