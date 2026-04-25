import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAppSelector((state) => state.auth)
    return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
