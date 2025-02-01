import { Modal } from '@mui/material'

interface Props {
    open: boolean
    onContinue: () => void
    onShowOrder: () => void
}

export const SuccessOrderModal = ({ open, onContinue, onShowOrder }: Props) => {
    void onShowOrder

    return (
        <Modal open={open}>
            <div className="bg-stone-800/90 h-full flex flex-col items-center justify-center p-2">
                <div className="text-primary-700 font-semibold text-xl">
                    Order has been created!
                </div>

                <div className="mt-4 text-white text-center">
                    Thanks for selecting our service. We will contact you soon from this account{' '}
                    <a
                        href="https://t.me/WuWa007"
                        className="text-blue-500 underline underline-offset-2"
                    >
                        @WuWa007
                    </a>
                    .
                </div>

                <button
                    className="text-stone-800 bg-primary-700 px-6 py-2 rounded-full mt-6"
                    onClick={onContinue}
                >
                    Continue
                </button>
            </div>
        </Modal>
    )
}
