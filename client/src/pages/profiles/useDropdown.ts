import { useEffect, useMemo, useRef, useState } from 'react'

interface Props<T> {
    selected?: string
    options: { key: string; value: T }[]
    closeOnClickOutside?: boolean
}

export const useDropdown = <T>({ closeOnClickOutside, options, ...props }: Props<T>) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string | null>(props.selected ?? null)

    const selectedOption = useMemo(
        () => options.find((o) => o.key === selected) ?? null,
        [selected, options],
    )

    useEffect(() => {
        setSelected(props.selected ?? null)
    }, [props.selected])

    useEffect(() => {
        if (!closeOnClickOutside) return

        const onClick = (e: MouseEvent) => {
            if (e.target instanceof Node && !ref.current?.contains(e.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [closeOnClickOutside])

    return {
        ref,
        isOpen,
        selected: selectedOption,
        options,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        select: (id: string) => setSelected(id),
        unselect: () => setSelected(null),
    }
}
