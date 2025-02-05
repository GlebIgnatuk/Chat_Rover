import { useLocalize } from '@/hooks/intl/useLocalize'
import { Modal } from '@mui/material'

export const InstructionsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const localize = useLocalize()

    return (
        <Modal open={open}>
            <div className="h-full grid grid-rows-[minmax(0,1fr),max-content] bg-stone-800/70">
                <div className="overflow-y-auto">
                    <div className="p-2 text-primary-700 font-semibold text-2xl w-full">
                        {localize('general__instructions')}
                    </div>
                    <ol className="pl-8 pr-2 list-decimal text-white text-md">
                        <li>{localize('shop__instructions_1')}</li>
                        <li>{localize('shop__instructions_2')}</li>
                        <li>
                            {localize('shop__instructions_3')}{' '}
                            <a
                                href="https://t.me/WuWa007"
                                className="text-blue-500 underline underline-offset-2"
                            >
                                @WuWa007
                            </a>
                        </li>
                    </ol>

                    <div className="p-2 text-primary-700 font-semibold text-2xl w-full mt-4">
                        {localize('general__information')}
                    </div>
                    <ol className="pl-8 pr-2 list-disc text-white text-md">
                        <li>{localize('shop__info_1')}</li>
                        <li>{localize('shop__info_2')}</li>
                        <li>
                            {localize('shop__info_3')}{' '}
                            <a
                                href="https://t.me/Donation_Changli"
                                className="text-blue-500 underline underline-offset-2"
                            >
                                @Donation_Changli
                            </a>
                        </li>
                    </ol>
                </div>

                <button
                    className="text-stone-800 bg-primary-700 px-6 py-2 rounded-full mb-2"
                    onClick={onClose}
                >
                    {localize('general__continue')}
                </button>
            </div>
        </Modal>
    )
}
