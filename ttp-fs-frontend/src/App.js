import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import firebase from './firebase';
import axios from 'axios';

// ---- Pages
import Signup from './containers/signup';
import Login from './containers/login';
import Logout from './containers/logout';
import Portfolio from './containers/portfolio';
import Transactions from './containers/transactions';

// --- Components
import Navbar from './components/navbar';
import Error404 from './components/error404';

// ---- Contexts
import AuthContext from './contexts/auth';

export default class App extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if(user){
        try {
          const res = await axios.get(`http://arbiter-stocks.herokuapp.com/users/?email=${user.email}`);
          if(res.data.user !== null){
            user.id = res.data.user.id;
            this.setState({user: user});
          };
        }
        catch (err) {
          console.log(err);
        };
      }
      else{
        this.setState({user:null})
      };
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  };

  render() {
    return (
      <HashRouter>
        <AuthContext.Provider value = {this.state.user}>
          <Route path='/' component= { Navbar } />
          <div className='container mt-5'>
            <Switch>
              <Route path='/' exact component={ () => <Redirect to="/portfolio"/> } />
              <Route path='/portfolio' exact component= { Portfolio } />
              <Route path='/transactions' exact component={ Transactions } />
              <Route path='/signup' exact component={ Signup } />
              <Route path='/login' exact component={ Login } />
              <Route path='/logout' exact component={ Logout } />
              <Route component={ Error404 } />
            </Switch>
          </div>
        </AuthContext.Provider>
      </HashRouter>
    );
  };
};
