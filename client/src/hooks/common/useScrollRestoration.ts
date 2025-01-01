import { useEffect, useLayoutEffect, useRef } from 'react'
import {
    GetScrollRestorationKeyFunction,
    useLocation,
    useMatches,
    useNavigation,
} from 'react-router-dom'

const SCROLL_RESTORATION_STORAGE_KEY = '@rc/scroll_restoration'
let savedScrollPositions: Record<string, number> = {}

export const useScrollRestoration = <E extends Element>({
    getKey,
    storageKey,
}: {
    getKey?: GetScrollRestorationKeyFunction
    storageKey?: string
} = {}) => {
    const ref = useRef<E>(null)

    const location = useLocation()
    const matches = useMatches()
    const navigation = useNavigation()

    // Trigger manual scroll restoration while we're active
    useEffect(() => {
        window.history.scrollRestoration = 'manual'
        return () => {
            window.history.scrollRestoration = 'auto'
        }
    }, [])

    useEffect(() => {
        let timeout: number | undefined = undefined

        const onScroll = () => {
            const scrollPosition = ref.current?.scrollTop ?? 0
            window.clearTimeout(timeout)

            timeout = window.setTimeout(() => {
                if (navigation.state === 'idle') {
                    const key = (getKey ? getKey(location, matches) : null) || location.key
                    savedScrollPositions[key] = scrollPosition
                }
                sessionStorage.setItem(
                    storageKey || SCROLL_RESTORATION_STORAGE_KEY,
                    JSON.stringify(savedScrollPositions),
                )
                window.history.scrollRestoration = 'auto'
            }, 100)
        }

        const scrollable = ref.current

        scrollable?.addEventListener('scroll', onScroll)
        return () => scrollable?.removeEventListener('scroll', onScroll)
    }, [storageKey, getKey, navigation.state, location, matches])

    // Save positions on unload
    // useBeforeUnload(
    //     useCallback(() => {
    //         console.log('UNLOAD')
    //         if (navigation.state === 'idle') {
    //             const key = (getKey ? getKey(location, matches) : null) || location.key
    //             savedScrollPositions[key] = ref.current?.scrollTop ?? 0
    //         }
    //         sessionStorage.setItem(
    //             storageKey || SCROLL_RESTORATION_STORAGE_KEY,
    //             JSON.stringify(savedScrollPositions),
    //         )
    //         window.history.scrollRestoration = 'auto'
    //     }, [storageKey, getKey, navigation.state, location, matches]),
    // )

    // Read in any saved scroll locations
    useLayoutEffect(() => {
        try {
            const sessionPositions = sessionStorage.getItem(
                storageKey || SCROLL_RESTORATION_STORAGE_KEY,
            )
            if (sessionPositions) {
                savedScrollPositions = JSON.parse(sessionPositions)
            }
        } catch (e) {
            // no-op, use default empty object
        }
    }, [storageKey])

    // Restore scrolling when state.restoreScrollPosition changes
    useLayoutEffect(() => {
        // try to scroll to the hash
        if (location.hash) {
            const el = document.getElementById(location.hash.slice(1))
            if (el) {
                el.scrollIntoView()
                return
            }
        }

        try {
            const sessionPositions = sessionStorage.getItem(
                storageKey || SCROLL_RESTORATION_STORAGE_KEY,
            )
            if (sessionPositions) {
                savedScrollPositions = JSON.parse(sessionPositions)

                const key = (getKey ? getKey(location, matches) : null) || location.key
                const restoreScrollPosition = savedScrollPositions[key] ?? 0

                ref.current?.scrollTo(0, restoreScrollPosition)
            }
        } catch (e) {
            // no-op, use default empty object
        }
    }, [location])

    return ref
}
