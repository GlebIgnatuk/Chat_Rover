import { useLocalize } from '@/hooks/intl/useLocalize'
import { Modal } from '@mui/material'

interface Props {
    open: boolean
    onContinue: () => void
    onShowOrder: () => void
}

export const SuccessOrderModal = ({ open, onContinue, onShowOrder }: Props) => {
    const localize = useLocalize()

    void onShowOrder

    return (
        <Modal open={open}>
            <div className="bg-stone-800/90 h-full flex flex-col items-center justify-center p-2">
                <div className="text-primary-700 font-semibold text-xl">
                    {localize('shop__order_created')}
                </div>

                <div className="mt-4 text-white text-center">
                    {localize('shop__order_thank')}
                    <a
                        href="https://t.me/WuWa007"
                        className="text-blue-500 underline underline-offset-2"
                    >
                        @WuWa007
                    </a>
                    .<br />
                    <br />
                    {localize('shop__order_process_note')}.
                </div>

                <button
                    className="text-stone-800 bg-primary-700 px-6 py-2 rounded-full mt-6"
                    onClick={onContinue}
                >
                    {localize('general__continue')}
                </button>
            </div>
        </Modal>
    )
}
