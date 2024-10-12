import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from 'tailwind-cn'

interface Props {
    min: number
    max: number
    step: number
    defaultValue?: number
    className?: string
    itemClassName?: (active: boolean) => string
    onChange?: (value: number) => void
}

export const ScrollableNumericInput = ({
    min,
    max,
    step,
    className,
    defaultValue,
    itemClassName,
    onChange,
}: Props) => {
    const scroller = useRef<HTMLDivElement | null>(null)

    const items = useMemo(
        () =>
            Array.from({ length: Math.ceil((max - min + 1) / step) }, (_, idx) => min + idx * step),
        [min, max, step],
    )
    const [activeIndex, setActiveIndex] = useState(
        defaultValue ? items.findIndex((e) => e === defaultValue) : 0,
    )

    useEffect(() => {
        const currentScroller = scroller.current
        if (!currentScroller) {
            return
        }

        const children = Array.from(currentScroller.children)

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const child = (entry.target as HTMLDivElement)
                        .firstElementChild as HTMLDivElement
                    if (child) {
                        child.style.transform = `rotateX(${90 - entry.intersectionRatio * 90}deg)`
                    }
                    if (entry.intersectionRatio >= 1) {
                        const index = children.indexOf(entry.target)
                        setActiveIndex(index)
                        const item = items[index]
                        if (item === undefined) return
                        onChange?.(item)
                    }
                }
            },
            {
                root: currentScroller,
                threshold: Array.from({ length: 11 }, (_, idx) => idx * 0.1),
            },
        )

        children.forEach((e) => observer.observe(e))

        return () => {
            children.forEach((e) => observer.unobserve(e))
        }
    }, [items])

    useEffect(() => {
        scroller.current?.children[activeIndex]?.scrollIntoView({ behavior: 'instant' })
    }, [])

    return (
        <div
            ref={scroller}
            className={cn(
                'flex flex-col overflow-y-auto snap-y snap-mandatory scrollbar-none w-8 h-6',
                className,
            )}
        >
            {items.map((item, idx) => (
                <span
                    key={item}
                    className={cn('snap-center', itemClassName?.(idx === activeIndex))}
                >
                    {item}
                </span>
            ))}
        </div>
    )
}
