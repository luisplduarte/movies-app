import { Outlet, Navigate } from 'react-router-dom'

/**
 * Every route inside this PrivateRoute is only accessible to logged in users.
 * @returns 
 */
function PrivateRoutes() {
    const token = localStorage.getItem('token')

    return(
        token ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes