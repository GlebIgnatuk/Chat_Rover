import { cn } from 'tailwind-cn'

interface CheckboxProps {
    className?: string
    checked: boolean
    onChange: (checked: boolean) => void
}

const Checkbox = ({ className, checked, onChange }: CheckboxProps) => {
    return (
        <div className={cn('flex items-center justify-center w-8 h-8', className)}>
            <label className="relative cursor-pointer block w-full h-full">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="hidden"
                />

                <div
                    className={cn(
                        'w-full h-full flex items-center justify-center rounded-2xl border-2 border-primary-700 transition-all duration-300',
                        {
                            'bg-stone-800 border-primary-700': checked,
                        },
                    )}
                >
                    {checked && (
                        <div
                            className="text-primary-700 transform scale-75 select-none"
                            style={{ transition: 'transform 0.2s ease' }}
                        >
                            ✓
                        </div>
                    )}
                </div>
            </label>
        </div>
    )
}

export default Checkbox
