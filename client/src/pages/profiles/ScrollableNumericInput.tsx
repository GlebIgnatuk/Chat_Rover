// import { useEffect, useMemo, useRef, useState } from 'react'
// import { cn } from 'tailwind-cn'

import { useState } from 'react'

interface Props {
    min: number
    max: number
    step: number
}

const R = 50 * 4
const S = 20
const Arad = ((360 / S) * Math.PI) / 180

export const ScrollableNumericInput = (props: Props) => {
    // const [activeIndex, setActiveIndex] = useState(0)
    const [angle, setAngle] = useState(0)
    void props

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setAngle((prev) => prev + (1 * Math.PI) / 180)
    //     }, 16)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    // const scroller = useRef<HTMLDivElement | null>(null)

    // const items = useMemo(
    //     () =>
    //         Array.from({ length: Math.ceil((max - min + 1) / step) }, (_, idx) => min + idx * step),
    //     [min, max, step],
    // )

    // useEffect(() => {
    //     const currentScroller = scroller.current
    //     if (!currentScroller) {
    //         return
    //     }

    //     const children = Array.from(currentScroller.children)

    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             for (const entry of entries) {
    //                 const child = (entry.target as HTMLDivElement)
    //                     .firstElementChild as HTMLDivElement
    //                 if (child) {
    //                     child.style.transform = `rotateX(${90 - entry.intersectionRatio * 90}deg)`
    //                 }
    //                 if (entry.intersectionRatio >= 1) {
    //                     const index = children.indexOf(entry.target)
    //                     setActiveIndex(index)
    //                 }
    //             }
    //         },
    //         {
    //             root: currentScroller,
    //             threshold: Array.from({ length: 11 }, (_, idx) => idx * 0.1),
    //         },
    //     )

    //     children.forEach((e) => observer.observe(e))

    //     return () => {
    //         children.forEach((e) => observer.unobserve(e))
    //     }
    // }, [])

    return (
        <div className="relative w-full" style={{ perspective: '2000px', height: `${R * 2}px` }}>
            <div
                className="absolute top-0 left-0 w-full h-full overflow-y-auto z-10 snap-y snap-mandatory"
                onScroll={(e) => {
                    const angle =
                        (e.currentTarget.scrollTop /
                            (e.currentTarget.scrollHeight - e.currentTarget.clientHeight)) *
                        (360 - 360 / S)
                    setAngle((-angle * Math.PI) / 180)
                }}
            >
                {Array.from({ length: S * 4 }, (_, idx) => (
                    <div
                        key={idx}
                        className="snap-center"
                        style={{
                            height: `${(2 * R * Math.tan(((180 / S) * Math.PI) / 180)) / 2}px`,
                        }}
                    ></div>
                ))}
                {/* <div
                    className="w-full"
                    style={{
                        height: `${S * 100}%`,
                    }}
                ></div> */}
            </div>

            <div
                className="relative bg-red-100 w-full h-full mt-20"
                style={{ transformStyle: 'preserve-3d', transform: `rotateY(0deg)` }}
            >
                {Array.from({ length: S }, (_, idx) => (
                    <div
                        key={idx}
                        className="absolute w-1/2 text-white flex items-center justify-center outline-double text-3xl font-bold"
                        style={{
                            transform: `translateZ(${R * Math.cos(angle + Arad * idx)}px) rotateX(${-angle + -Arad * idx}rad)`,
                            top: `calc(50% + ${R * Math.sin(angle + Arad * idx)}px - ${R * Math.tan(((180 / S) * Math.PI) / 180)}px)`,
                            left: `30%`,
                            height: `${2 * R * Math.tan(((180 / S) * Math.PI) / 180)}px`,
                            background: `hsl(110deg, 30%, ${((Math.cos(-angle + -Arad * idx) + 1) / 2) * 60}%)`,
                            outline:
                                angle % (Math.PI * 2) >= -Arad * idx - Arad / 2 &&
                                angle % (Math.PI * 2) <= -Arad * idx + Arad / 2
                                    ? '2px solid red'
                                    : 'none',
                            // background: `hsl(120deg, 35%, ${(((angle + Arad * idx) % (Math.PI * 2)) / Math.PI) * 100}%)`,
                        }}
                    >
                        {idx + 1}
                    </div>
                ))}
            </div>
        </div>

        // <div className="snap-y snap-mandatory overflow-y-auto h-16" ref={scroller}>
        //     {items.map((item, idx) => (
        //         <div
        //             key={item}
        //             className="snap-center my-[0px]"
        //             style={{
        //                 perspective: '1000px',
        //                 perspectiveOrigin: `50% ${idx > activeIndex ? 100 : 0}%`,
        //             }}
        //         >
        //             <div
        //                 className={cn(
        //                     'relative from-red-700/30 to-red-400 text-md text-center transition-all duration-100',
        //                     {
        //                         'bg-red-400': activeIndex === idx,
        //                         'bg-gradient-to-t': activeIndex >= idx - 2 && activeIndex < idx,
        //                         'bg-gradient-to-b': activeIndex <= idx + 2 && activeIndex > idx,
        //                     },
        //                 )}
        //             >
        //                 {item}
        //             </div>
        //         </div>
        //     ))}
        // </div>
    )
}
