import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/auth';

const dark = { color: '#6C757D'}

export default (props) => {

  const loggedOut = <div className="navbar navbar-light bg-light justify-content-end">
    <Link style={dark} className="nav-item nav-link" to="/signup">Sign Up</Link>
    <Link style={dark} className="nav-item nav-link" to="/login">Login</Link>
  </div>

  const loggedIn = <nav className="navbar navbar-light bg-light justify-content-end">
    <Link style={dark} className="nav-item nav-link" to="/">Portfolio</Link>
    <Link style={dark} className="nav-item nav-link" to="/transactions">Transactions</Link>
    <Link style={dark} className="nav-item nav-link" to="/logout">Logout</Link>
  </nav>

  return(
    <AuthContext.Consumer>
      {
        (user) => user ? loggedIn : loggedOut
      }
    </AuthContext.Consumer>
  )
}