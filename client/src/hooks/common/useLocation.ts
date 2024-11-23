import { useLocation as _useLocation, Location } from 'react-router-dom'

// A typed version of the original useLocation. Helps to type location.state
export const useLocation = <T>() => {
    return _useLocation() as Location<T | undefined>
}
