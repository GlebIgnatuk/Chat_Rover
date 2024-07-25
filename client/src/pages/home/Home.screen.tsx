import { useCounter } from '@/context/counter/useCounter'

const format = new Intl.NumberFormat('en-US', {
    style: 'decimal',
})

export const HomeScreen = () => {
    const { count, increaseBy } = useCounter()

    return (
        <div onClick={() => increaseBy((prev) => prev + 10)}>
            <div
                className="text-4xl text-center pt-4 select-none"
                style={{
                    color: `hsl(${count / 10 + (50 % 255)}, 51%, 79%)`,
                }}
            >
                <span>{format.format(count)}</span>
                <span className="text-sm text-white font-medium">{format.format(Math.ceil(count / 1000))}t/s</span>
            </div>
        </div>
    )
}
