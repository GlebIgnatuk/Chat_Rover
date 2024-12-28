export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((res, rej) => {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => {
            res(image)
        }
        image.onerror = () => {
            rej()
        }
        image.src = src
    })
}

export type DrawFn = (ctx: CanvasRenderingContext2D, drawing: DrawingContext) => void

export interface DrawingContext {
    mask: (fn: DrawFn, ...drawShapeFns: DrawFn[]) => HTMLCanvasElement
    linearGradient: (x: number, y: number, w: number, h: number, ...colors: string[]) => void
    roundedRect: (
        x: number,
        y: number,
        w: number,
        h: number,
        radii: number[],
        color?: string,
    ) => void
    rect: (
        x: number,
        y: number,
        w: number,
        h: number,
        options: { color?: string; rotate?: number },
    ) => void
    divider: (x: number, y: number, width: number, color?: string) => void
    textV2: (
        text: string,
        x: number,
        y: number,
        options: {
            font?: string
            fontSize?: number
            fontStyle?: string
            fontWeight?: string
            lineHeight?: string | number
            verticalAlignment?: CanvasTextBaseline
            lineBreak?: string
            alignText?: string
            maxWidth?: number
            maxHeight?: number
            color?: string
        },
    ) => void
    drawImage(scale: boolean, ...args: unknown[]): void
    fillRect: (color: string, ...args: Parameters<CanvasRenderingContext2D['fillRect']>) => void
}

export const createCanvas = (
    initial: HTMLCanvasElement | null,
    size: { width: number; height: number },
    ratio = 1,
    setTransform = true,
) => {
    let canvas: HTMLCanvasElement
    if (initial !== null) {
        canvas = initial
    } else {
        canvas = document.createElement('canvas')
    }

    canvas.width = size.width * ratio
    canvas.style.width = `${size.width}px`
    canvas.height = size.height * ratio
    canvas.style.height = `${size.height}px`

    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('No ctx')

    if (setTransform) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    ctx.imageSmoothingEnabled = false

    const Drawing: DrawingContext = {
        mask: (drawMask, ...drawShapes) => {
            console.log('Drawing mask')
            const mask = createCanvas(null, size, ratio)
            const shape = createCanvas(null, size, ratio)

            drawMask(mask.ctx, mask.Drawing)
            drawShapes.forEach((drawShape) => drawShape(shape.ctx, shape.Drawing))
            mask.ctx.globalCompositeOperation = 'source-in'
            mask.Drawing.drawImage(false, shape.canvas, 0, 0)

            return mask.canvas
        },
        linearGradient: (x, y, w, h, ...colors) => {
            console.log('Drawing gradient')
            const gradient = ctx.createLinearGradient(0, 0, w, h)
            colors.forEach((c, idx) => gradient.addColorStop(idx, c))

            const fillStyle = ctx.fillStyle
            ctx.fillStyle = gradient
            ctx.fillRect(x, y, w, h)
            ctx.fillStyle = fillStyle
        },
        roundedRect: (x, y, w, h, radii, color) => {
            console.log('Drawing rounded rect')
            ctx.beginPath()
            ctx.roundRect(x, y, w, h, radii)
            ctx.closePath()
            const fillStyle = ctx.fillStyle
            ctx.fillStyle = color ?? 'black'
            ctx.fill()
            ctx.fillStyle = fillStyle
        },
        rect: (x, y, w, h, options) => {
            console.log('Drawing rect')
            ctx.save()
            ctx.fillStyle = options.color ?? 'black'
            ctx.translate(x + w / 2, y + h / 2)
            ctx.rotate(options.rotate ?? 0)
            ctx.fillRect(-w / 2, -h / 2, w, h)
            ctx.restore()
        },
        divider: (x, y, width, color) => {
            console.log('Drawing divider')
            ctx.save()
            ctx.strokeStyle = color ?? 'black'
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + width, y)
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        },
        textV2: (text, x, y, options) => {
            console.log('Drawing text')
            ctx.save()

            const fontSize = options.fontSize ?? 16

            ctx.fillStyle = options.color ?? 'black'
            ctx.font = `${options.fontStyle ?? 'normal'} ${options.fontWeight ?? 'normal'} ${fontSize}px '${options.font ?? 'Arial'}'`

            const measuredText = ctx.measureText(text)

            let lineHeight = 0
            if (typeof options.lineHeight === 'string') {
                lineHeight = parseFloat(options.lineHeight)
            } else {
                lineHeight =
                    (options.lineHeight ?? 1) *
                    (Math.abs(measuredText.fontBoundingBoxAscent) +
                        Math.abs(measuredText.fontBoundingBoxDescent))
            }

            ctx.textBaseline = options.verticalAlignment ?? 'alphabetic'

            const lineBreak = options.lineBreak ?? 'word'
            const alignText = options.alignText ?? 'left'

            y +=
                lineHeight -
                (lineHeight -
                    (Math.abs(measuredText.actualBoundingBoxAscent) +
                        Math.abs(measuredText.alphabeticBaseline))) /
                    2

            const lines = []
            if (lineBreak === 'word') {
                if (options.maxWidth === undefined) {
                    lines.push({ text })
                } else {
                    const words = text.split(' ')
                    let line = words[0]!
                    let previousWidth = ctx.measureText(line).width
                    let overflewY = false
                    for (let i = 1; i < words.length; ++i) {
                        const word = words[i]!
                        const measurements = ctx.measureText(line + ' ' + word)
                        if (measurements.width < (options.maxWidth ?? Infinity)) {
                            line += ' ' + word
                            previousWidth = measurements.width
                        } else {
                            if (
                                i !== words.length - 1 &&
                                lineHeight * (lines.length + 1) > (options.maxHeight ?? Infinity)
                            ) {
                                overflewY = true

                                if (lines.length === 0) {
                                    break
                                }

                                const ellipsisWidth = ctx.measureText('…').width

                                let text = lines[lines.length - 1]!.text
                                while (text.length !== 0) {
                                    const width = ctx.measureText(text).width

                                    if (options.maxWidth - width >= ellipsisWidth) {
                                        lines[lines.length - 1]!.text = text + '…'
                                        break
                                    } else {
                                        text = text.substring(0, text.length - 1)
                                    }
                                }

                                break
                            }

                            lines.push({ text: line, width: previousWidth })
                            line = word
                        }
                    }
                    if (
                        overflewY === false &&
                        lineHeight * (lines.length + 1) > (options.maxHeight ?? Infinity)
                    ) {
                        const ellipsisWidth = ctx.measureText('…').width

                        let text = lines[lines.length - 1]!.text
                        while (text.length !== 0) {
                            const width = ctx.measureText(text).width

                            if (options.maxWidth - width >= ellipsisWidth) {
                                lines[lines.length - 1]!.text = text + '…'
                                break
                            } else {
                                text = text.substring(0, text.length - 1)
                            }
                        }
                    } else if (overflewY === false) {
                        lines.push({ text: line, width: previousWidth })
                    }
                }
            } else {
                //
            }

            if (options.maxWidth === undefined) {
                ctx.fillText(lines[0]!.text, x, y)
            } else {
                for (let i = 0; i < lines.length; ++i) {
                    let drawX = x,
                        drawY = y
                    switch (alignText) {
                        case 'right':
                            {
                                drawX += options.maxWidth - lines[i]!.width!
                                drawY += lineHeight * i
                            }
                            break

                        case 'center':
                            {
                                drawX += options.maxWidth / 2 - lines[i]!.width! / 2
                                drawY += lineHeight * i
                            }
                            break

                        case 'left':
                        default: {
                            //
                            drawX = x
                            drawY += lineHeight * i
                        }
                    }
                    ctx.fillText(lines[i]!.text, drawX, drawY)
                }
            }

            ctx.restore()
        },
        drawImage: (scale = false, ...args) => {
            console.log('Drawing image')
            if (scale) {
                // @ts-expect-error todo
                ctx.drawImage(...args)
            } else {
                ctx.save()
                ctx.setTransform(1, 0, 0, 1, 0, 0)
                // @ts-expect-error todo
                ctx.drawImage(...args)
                ctx.restore()
            }
        },
        fillRect: (color, ...args) => {
            console.log('Drawing filled rect')
            const fillStyle = ctx.fillStyle
            ctx.fillStyle = color
            ctx.fillRect(...args)
            ctx.fillStyle = fillStyle
        },
    }

    return {
        canvas,
        ctx,
        Drawing,
    }
}
