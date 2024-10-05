import { useCharacters } from '@/context/characters'

export const CharactersScreen = () => {
    const { characters, loading } = useCharacters()

    if (loading.is) {
        return <>Loading...</>
    } else if (loading.is === false && loading.error) {
        return <>Failed to load: {loading.error}</>
    }

    return (
        <div className="overflow-y-auto h-full p-1 bg-[#131313]">
            <div className="grid grid-cols-3 gap-1 pb-9">
                {characters.map((character) => (
                    <div
                        key={character._id}
                        className="overflow-hidden rounded-lg hover:scale-110"
                        style={{ backgroundColor: character.accentColor }}
                    >
                        <img
                            src={character.photoUrl}
                            className="w-full h-32 object-cover object-top"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
