import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRouts = (props) =>{
    const token = Cookies.get('jwt_token')
    return token ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRouts