import { useLocalize } from '@/hooks/intl/useLocalize'
import { Modal } from '@mui/material'

export const InstructionsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const localize = useLocalize()

    return (
        <Modal open={open}>
            <div className="h-full flex flex-col items-center justify-center bg-stone-800/70">
                <div className="p-2 text-primary-700 font-semibold text-2xl">Instructions</div>
                <ol className="list-decimal text-white text-md w-4/5">
                    <li>{localize('shop__instructions_1')}</li>
                    <li>
                        {localize('shop__instructions_2')}{' '}
                        <a
                            href="https://t.me/WuWa007"
                            className="text-blue-500 underline underline-offset-2"
                        >
                            @WuWa007
                        </a>
                    </li>
                    <li>{localize('shop__instructions_3')}</li>
                    <li>{localize('shop__instructions_4')}</li>
                </ol>
                <button
                    className="text-stone-800 bg-primary-700 px-6 py-2 rounded-full mt-6"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </Modal>
    )
}
