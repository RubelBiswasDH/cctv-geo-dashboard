import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAuthenticated, element }) => {
  return (
    isAuthenticated ?
      element
      :
      <Navigate to='/login' />
  )
}

// Prop Types
ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  element: PropTypes.node
}

ProtectedRoute.defaultProps = {
  isAuthenticated: false,
  element: null
}

export default ProtectedRoute