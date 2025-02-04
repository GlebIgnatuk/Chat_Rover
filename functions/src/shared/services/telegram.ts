export class MarkupV2 {
    private text: string

    constructor(text?: string) {
        this.text = text ?? ''
    }

    static escape(text: string) {
        return text.replace(/([_\*\[\]\(\)~`\>#\+\-=\|\{\}\.\!])/g, '\\$1')
    }

    italic(text: string) {
        this.text += `_${MarkupV2.escape(text)}_`
        return this
    }

    bold(text: string, cond?: boolean) {
        if (cond == false) return this

        this.text += `*${MarkupV2.escape(text)}*`
        return this
    }

    inline(text: string) {
        this.text += `\`${MarkupV2.escape(text)}\``
        return this
    }

    link(text: string, url: string) {
        this.text += `[${MarkupV2.escape(text)}](${url})`
        return this
    }

    mention(id: number, as: string) {
        this.text += `[${MarkupV2.escape(as)}](tg://user?id=${id})`
        return this
    }

    plain(text: string) {
        this.text += MarkupV2.escape(text)
        return this
    }

    br(amount: number = 1) {
        this.text += '\n'.repeat(amount)
        return this
    }

    foreach<I>(items: I[], cb: (m: MarkupV2, item: I, idx: number) => any) {
        for (let i = 0; i < items.length; i++) {
            cb(this, items[i], i)
        }
        return this
    }

    build() {
        return this.text
    }
}
