import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/auth';

const dark = { color: '#6C757D'};
const underline = { color: '#FFF', borderBottom: '4px solid #3198F7'};

export default (props) => {
  const loggedOut = <div className="navbar py-0 navbar-dark bg-dark justify-content-end">
    {
    props.location.pathname === "/signup" ?
    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/signup">Sign Up</Link>
    :
    <Link style={dark} className="nav-item nav-link" to="/signup">Sign Up</Link>
    }
    {
    props.location.pathname === "/login" ?
    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/login">Login</Link>
    :
    <Link style={dark} className="nav-item nav-link" to="/login">Login</Link>
    }
  </div>

  const loggedIn = <nav className="navbar py-0 navbar-dark bg-dark justify-content-end">
    {
    props.location.pathname === "/portfolio" ?
    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/portfolio">Portfolio</Link>
    :
    <Link style={dark} className="nav-item nav-link" to="/portfolio">Portfolio</Link>
    }
    {
    props.location.pathname === "/transactions" ?
    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/transactions">Transactions</Link>
    :
    <Link style={dark} className="nav-item nav-link" to="/transactions">Transactions</Link>
    }
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