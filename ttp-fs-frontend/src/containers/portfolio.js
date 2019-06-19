import React from 'react';
import AuthContext from '../contexts/auth';
import { Redirect } from 'react-router-dom';
// import axios from 'axios';

export default class Portfolio extends React.Component {
  
  static contextType = AuthContext;
  
  state = { 
    user: this.context,
  };

  componentDidMount() {
    if(this.context !== null){
      
    }
  };

  render() {
    return (
      <AuthContext.Consumer>
        {
          user => {
            if(user){
              return (
              <>
                <h2>Welcome back, {user.email}</h2>
              </>
              );
            }
            else{
              return <Redirect to="/login" />
            };
          }
        }
      </AuthContext.Consumer>  
    );
  };
};