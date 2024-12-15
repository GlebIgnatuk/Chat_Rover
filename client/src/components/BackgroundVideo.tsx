import { useEffect, useRef } from 'react'

export interface BackgroundVideoProps {
    speed?: number
    src: string
}

export const BackgroundVideo = ({ src, speed }: BackgroundVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) video.playbackRate = speed ?? 1
    }, [speed])

    return (
        <video
            ref={videoRef}
            src={src}
            className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none -z-10"
            muted
            controls={false}
            autoPlay
            loop
        ></video>
    )
}
