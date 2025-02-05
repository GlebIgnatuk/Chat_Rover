import { Modal } from '@mui/material'

interface Props {
    open: boolean
    text: string
    channelLink: string
    onClose: () => void
}

export const SubscribeChannelModal = ({ open, text, channelLink, onClose }: Props) => {
    return (
        <Modal open={open}>
            <div className="h-full flex flex-col items-center justify-center">
                <div className="bg-stone-800 border border-primary-700 py-8 px-6 rounded-lg mx-2">
                    <div className="text-white px-8 text-center text-md">{text}</div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                        <button
                            className="px-6 py-2 bg-stone-800 border border-primary-700 text-primary-700 rounded-full"
                            onClick={onClose}
                        >
                            Закрыть
                        </button>
                        <a
                            className="px-6 py-2 text-stone-800 bg-primary-700 font-semibold rounded-full text-center"
                            href={channelLink}
                            target="_blank"
                            onClick={() => {}}
                        >
                            Подписаться
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
