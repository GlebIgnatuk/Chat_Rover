import { createCanvas, loadImage } from '@/lib/canvas/engine'
import { ISearchedProfile, IWuwaCharacter } from '@/store/types'
import { useEffect, useRef, useState } from 'react'
import cardBg from '@/assets/profile-card-bg.webp'
import cnFlag from '@/assets/cn.svg'
import deFlag from '@/assets/de.svg'
import esFlag from '@/assets/es.svg'
import frFlag from '@/assets/fr.svg'
import jpFlag from '@/assets/jp.svg'
import krFlag from '@/assets/kr.svg'
import usFlag from '@/assets/us.svg'
import { buildImageUrl } from '@/utils/url'
import { api } from '@/services/api'

export interface UseRenderedProfileProps {
    profile: ISearchedProfile
    characters: Record<string, IWuwaCharacter>
    width: number
    height: number
}

const langToIcon: Record<string, string> = {
    en: usFlag,
    ja: jpFlag,
    ko: krFlag,
    fr: frFlag,
    de: deFlag,
    es: esFlag,
    'zh-CN': cnFlag,
    'zh-HK': cnFlag,
}

export const useRenderedProfile = ({
    width,
    height,
    characters,
    profile,
}: UseRenderedProfileProps) => {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        setIsDrawing(true)

        const WIDTH = width
        const HEIGHT = height
        const RATIO = Math.ceil(window.devicePixelRatio) * 3

        const { Drawing } = createCanvas(canvas, { width, height }, RATIO)

        const draw = async () => {
            const image = await loadImage(cardBg)
            const teamImages = await Promise.all(
                profile.team.map((t) => {
                    if (!t) return new Image()

                    const character = characters[t.characterId]
                    if (!character) return new Image()

                    return loadImage(buildImageUrl(character.photoPath))
                }),
            )
            const langImages = await Promise.all(
                Object.keys(langToIcon).map(async (l) => {
                    const asset = await loadImage(langToIcon[l]!)
                    return { lang: l, asset }
                }),
            ).then((assets) =>
                assets.reduce<Record<string, HTMLImageElement>>(
                    (acc, n) => ({ ...acc, [n.lang]: n.asset }),
                    {},
                ),
            )

            const root = Drawing.mask(
                (_, Drawing) => {
                    Drawing.roundedRect(0, 0, WIDTH, HEIGHT, [0.75 * 16], 'black')
                },
                (_, Drawing) => {
                    // bg
                    Drawing.drawImage(
                        true,
                        image,
                        0,
                        0,
                        image.width,
                        image.height,
                        0,
                        0,
                        WIDTH,
                        HEIGHT,
                    )

                    // header
                    Drawing.linearGradient(0, 0, WIDTH, 44, '#ffc96040', '#5d3d0cbf')
                    Drawing.textV2('Wuthering Waves ⟡ Покои Чанли', 8, 0, {
                        font: 'Arial',
                        fontSize: 14,
                        lineHeight: '44px',
                        color: '#FFFFFF',
                    })
                    Drawing.roundedRect(
                        WIDTH - 66,
                        (44 - 20) / 2,
                        84,
                        20,
                        [0.75 * 16, 0, 0, 0.75 * 16],
                        '#EDDAB8',
                    )
                    Drawing.textV2(profile.server, WIDTH - 66, 0, {
                        font: 'Arial',
                        fontSize: 14,
                        lineHeight: '44px',
                        maxWidth: 66,
                        alignText: 'center',
                        color: '#776868',
                    })

                    // nickname & uid
                    let offsetTop = 44 + 0.25 * 16
                    Drawing.textV2(profile.nickname, 0.5 * 16, offsetTop, {
                        font: 'Arial',
                        fontSize: 16,
                        lineHeight: '24px',
                        color: '#FFFFFF',
                    })
                    offsetTop += 24
                    Drawing.textV2(`UID: ${profile.uid}`, 0.5 * 16, offsetTop, {
                        font: 'Arial',
                        fontSize: 14,
                        lineHeight: '16px',
                        color: '#FFFFFF',
                    })
                    offsetTop += 16 + 0.5 * 16

                    // characters
                    for (let i = 0; i < profile.team.length; ++i) {
                        const member = profile.team[i]

                        const gap = 0.25 * 16
                        const width = (WIDTH - gap * (profile.team.length + 1)) / 3

                        const buffer = Drawing.mask(
                            (_, Drawing) => Drawing.roundedRect(0, 0, width, 240, [0.75 * 16]),
                            (_, Drawing) => {
                                // bg
                                const character = member ? characters[member.characterId] : null
                                if (member && character) {
                                    Drawing.fillRect(character.accentColor, 0, 0, width, 240)
                                } else {
                                    // Drawing.fillRect('#232323', 0, 0, width, 240)
                                    Drawing.linearGradient(0, 0, width, 240, '#232323', '#484848')
                                    return
                                }

                                // avatar
                                const image = teamImages[i]!
                                Drawing.drawImage(
                                    true,
                                    image,
                                    0,
                                    0,
                                    image.width,
                                    image.height,
                                    0,
                                    0,
                                    width,
                                    240,
                                )

                                // level
                                Drawing.roundedRect(
                                    0,
                                    0.75 * 16,
                                    30,
                                    28,
                                    [0, 0.75 * 16, 0.75 * 16, 0],
                                    '#EBC920',
                                )
                                Drawing.textV2(member.level.toString(), 0, 0.75 * 16, {
                                    font: 'Arial',
                                    fontSize: 14,
                                    lineHeight: '28px',
                                    color: '#FFFFFF',
                                    alignText: 'center',
                                    maxWidth: 28,
                                })
                            },
                        )
                        Drawing.drawImage(
                            false,
                            buffer,
                            i * width * RATIO + (i + 1) * gap * RATIO,
                            offsetTop * RATIO,
                        )
                    }
                    offsetTop += 240 + 16

                    // about
                    Drawing.roundedRect(
                        0.25 * 16,
                        offsetTop,
                        WIDTH - 2 * 0.25 * 16,
                        6 * 16 + 1.5 * 16 + 0.5 * 16,
                        [0.75 * 16],
                        '#FFFAE7',
                    )
                    Drawing.roundedRect(
                        0.25 * 16,
                        offsetTop,
                        64,
                        20,
                        [0.75 * 16, 0, 0.75 * 16, 0],
                        '#7D7881',
                    )
                    Drawing.textV2('About', 0.25 * 16, offsetTop, {
                        font: 'Arial',
                        fontSize: 0.75 * 16,
                        lineHeight: '20px',
                        fontWeight: 'thin',
                        maxWidth: 64,
                        alignText: 'center',
                        color: '#FFFAE7',
                    })
                    Drawing.textV2(profile.about, 0.25 * 16 + 0.5 * 16, offsetTop + 1.5 * 16, {
                        font: 'Arial',
                        fontSize: 0.75 * 16,
                        lineHeight: '16px',
                        color: '#7D7881',
                        fontWeight: 'thin',
                        // verticalAlignment: 'middle',
                        maxWidth: WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16,
                        maxHeight: 6 * 16,
                    })

                    // constellation (z-index)
                    for (let i = 0; i < profile.team.length; ++i) {
                        const member = profile.team[i]
                        if (!member) continue

                        const gap = 0.25 * 16
                        const width = (WIDTH - gap * (profile.team.length + 1)) / 3

                        Drawing.roundedRect(
                            (i + 1) * gap + (i + 1) * width - width / 2 - 44 / 2,
                            offsetTop - 16 - 44 / 2,
                            44,
                            44,
                            [44],
                            '#A17DA8',
                        )
                        Drawing.roundedRect(
                            (i + 1) * gap + (i + 1) * width - width / 2 - 40 / 2,
                            offsetTop - 16 - 40 / 2,
                            40,
                            40,
                            [40],
                            '#EBC920',
                        )
                        // @todo measure text / center
                        Drawing.textV2(
                            member.level.toString(),
                            (i + 1) * gap + (i + 1) * width - width / 2 - 40 / 2,
                            offsetTop - 16 - 40 / 2,
                            {
                                font: 'Arial',
                                fontSize: 1.125 * 16,
                                lineHeight: `40px`,
                                color: '#FFFFFF',
                                alignText: 'center',
                                maxWidth: 40,
                            },
                        )
                    }
                    offsetTop += 6 * 16 + 1.5 * 16 + 0.5 * 16 + 0.5 * 16

                    // info
                    Drawing.roundedRect(
                        0.25 * 16,
                        offsetTop,
                        WIDTH - 2 * 0.25 * 16,
                        9 * 16 + 1.25 * 16 + 0.25 * 16,
                        [0.75 * 16],
                        '#FFFAE7',
                    )
                    Drawing.roundedRect(
                        0.25 * 16,
                        offsetTop,
                        64,
                        20,
                        [0.75 * 16, 0, 0.75 * 16, 0],
                        '#7D7881',
                    )
                    Drawing.textV2('Info', 0.25 * 16, offsetTop, {
                        font: 'Arial',
                        fontSize: 0.75 * 16,
                        lineHeight: '20px',
                        fontWeight: 'thin',
                        maxWidth: 64,
                        alignText: 'center',
                        color: '#FFFAE7',
                    })
                    offsetTop += 75

                    // divider
                    Drawing.rect(0.25 * 16 + 0.5 * 16 - 4 / 2, offsetTop - 4 / 2, 4, 4, {
                        color: '#D8C9AD',
                        rotate: Math.PI / 4,
                    })
                    Drawing.rect(
                        WIDTH - 2 * 0.25 * 16 - 0.5 * 16 + 4 / 2,
                        offsetTop - 4 / 2,
                        4,
                        4,
                        {
                            color: '#D8C9AD',
                            rotate: Math.PI / 4,
                        },
                    )
                    Drawing.divider(
                        0.25 * 16 + 0.5 * 16,
                        offsetTop,
                        WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16,
                        '#D8C9AD',
                    )
                    offsetTop += 8

                    // table
                    {
                        const columnWidth = (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (1 / 3)
                        Drawing.textV2('World level', 0.25 * 16 + 0.5 * 16, offsetTop, {
                            font: 'Arial',
                            color: 'hsl(140, 4%, 32%)',
                            fontSize: 0.75 * 16,
                            lineHeight: '24px',
                            fontWeight: 'bold',
                            maxWidth: columnWidth,
                            maxHeight: 24,
                        })
                        Drawing.textV2(
                            `Rank ${profile.worldLevel}`,
                            columnWidth + 0.25 * 16 + 0.5 * 16,
                            offsetTop,
                            {
                                font: 'Arial',
                                color: 'hsl(140, 4%, 32%)',
                                fontSize: 0.75 * 16,
                                lineHeight: '24px',
                                maxWidth: (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (2 / 3),
                                maxHeight: 24,
                            },
                        )
                        offsetTop += 24
                        offsetTop += 2
                        Drawing.divider(
                            0.25 * 16 + 0.5 * 16,
                            offsetTop,
                            WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16,
                            'hsl(140, 4%, 32%)',
                        )
                        offsetTop += 2
                    }

                    {
                        const columnWidth = (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (1 / 3)
                        Drawing.textV2('Voice', 0.25 * 16 + 0.5 * 16, offsetTop, {
                            font: 'Arial',
                            color: 'hsl(140, 4%, 32%)',
                            fontSize: 0.75 * 16,
                            lineHeight: '24px',
                            fontWeight: 'bold',
                            maxWidth: columnWidth,
                            maxHeight: 24,
                        })
                        Drawing.textV2(
                            profile.usesVoice ? 'Yes' : 'No',
                            columnWidth + 0.25 * 16 + 0.5 * 16,
                            offsetTop,
                            {
                                font: 'Arial',
                                color: 'hsl(140, 4%, 32%)',
                                fontSize: 0.75 * 16,
                                lineHeight: '24px',
                                maxWidth: (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (2 / 3),
                                maxHeight: 24,
                            },
                        )
                        offsetTop += 24
                        offsetTop += 2
                        Drawing.divider(
                            0.25 * 16 + 0.5 * 16,
                            offsetTop,
                            WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16,
                            'hsl(140, 4%, 32%)',
                        )
                        offsetTop += 2
                    }

                    {
                        offsetTop += 2
                        const columnWidth = (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (1 / 3)
                        Drawing.textV2('Languages', 0.25 * 16 + 0.5 * 16, offsetTop, {
                            font: 'Arial',
                            color: 'hsl(140, 4%, 32%)',
                            fontSize: 0.75 * 16,
                            lineHeight: '24px',
                            fontWeight: 'bold',
                            maxWidth: columnWidth,
                            maxHeight: 24,
                        })

                        const chipWidth = 16 + 8
                        const gap = 0.25 * 16

                        for (let i = 0; i < profile.languages.length; ++i) {
                            // Drawing.roundedRect(0.25 * 16 + 0.5 * 16 + columnWidth + chipWidth * i + gap * i, offsetTop, chipWidth, 24, [16], '#C3B6A0')
                            Drawing.roundedRect(
                                0.25 * 16 + 0.5 * 16 + columnWidth + chipWidth * i + gap * i,
                                offsetTop,
                                chipWidth,
                                24,
                                [16],
                                '#C3B6A0',
                            )
                            const mask = Drawing.mask(
                                (_, Drawing) => Drawing.roundedRect(0, 0, 16, 16, [8]),
                                (_, Drawing) => {
                                    Drawing.drawImage(
                                        true,
                                        langImages[profile.languages[i]!] ?? image,
                                        0,
                                        0,
                                        16,
                                        16,
                                    )
                                },
                            )
                            Drawing.drawImage(
                                false,
                                mask,
                                (0.25 * 16 + 0.5 * 16 + columnWidth + chipWidth * i + gap * i + 4) *
                                    RATIO,
                                (offsetTop + 4) * RATIO,
                            )
                            // Drawing.textV2(
                            //     profile.languages[i].substring(0, 2).toUpperCase(),
                            //     0.25 * 16 + 0.5 * 16 + columnWidth + chipWidth * i + gap * i,
                            //     offsetTop,
                            // {
                            //     font: 'Arial',
                            //     color: '#FFFFFF',
                            //     fontSize: 0.75 * 16,
                            //     lineHeight: '24px',
                            //     maxWidth: chipWidth - 8,
                            //     alignText: 'right',
                            //     maxHeight: 24,
                            // })
                        }

                        // Drawing.textV2(profile.usesVoice ? 'Yes' : 'No', columnWidth, offsetTop, {
                        //     font: 'Arial',
                        //     color: 'hsl(140, 4%, 32%)',
                        //     fontSize: 0.75 * 16,
                        //     lineHeight: '24px',
                        //     maxWidth: (WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16) * (2 / 3),
                        //     maxHeight: 24,
                        // })
                        // offsetTop += 24
                        // Drawing.divider(0.25 * 16 + 0.5 * 16, offsetTop, WIDTH - 2 * 0.25 * 16 - 2 * 0.5 * 16, 'hsl(140, 4%, 32%)')
                        // offsetTop += 4
                    }
                },
            )

            Drawing.drawImage(false, root, 0, 0)
        }

        draw().then(() => setIsDrawing(false))
    }, [characters, profile, width, height])

    const download = async () => {
        const canvas = canvasRef.current
        if (!canvas) return

        setIsDownloading(true)

        try {
            const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
            if (!blob) throw new Error('Faield to create blob')

            const data = new FormData()
            data.append('photo', blob)

            const response = await api(`/profiles/${profile._id}/exports`, {
                method: 'POST',
                body: data,
            })
            if (!response.success) {
                throw new Error(response.error)
            }
        } finally {
            setIsDownloading(false)
        }
    }

    return {
        isDrawing,
        isDownloading,
        download,
        ref: canvasRef,
    }
}
