import React from 'react';
import firebase from '../firebase';
import AuthContext from '../contexts/auth';
import { Redirect, Link } from 'react-router-dom'

export default class Login extends React.Component {

  state = {
    email: '',
    password: '',
    error: ''
  };

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('Returns: ', response);
      })
      .catch(err => {
        const {message} = err;
        this.setState({error: message});
      });
  };

  render() {
    const { email, password, error } = this.state;
    const displayError = error === '' ? '' : <div className="alert alert-danger" role="alert">{error}</div>;
    const displayForm =  <div style={{width: '100%'}} className="d-flex flex-wrap justify-content-center align-items-center">
      <div className="col-12">
        <h1 className="col-12 text-center">Login</h1>
        {displayError}
        <form style={{margin: '0 auto'}} className="border rounded col-sm-12 col-md-6 mt-3 px-3 py-4">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" name="email" value={email} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" placeholder="Password" value={password} name="password" onChange={this.handleChange} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
          <div>
              <span>Don't have an account?</span>
              <Link to="/signup" className="px-1">Sign Up</Link>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Login</button>
          </div>
        </form>
      </div>
    </div>;

      return (
        <AuthContext.Consumer>
          {
            (user) => {
              if (user) {
                return <Redirect to='/' />;
              } else {
                return displayForm;
              };
            }
          }
        </AuthContext.Consumer>
      );
  };
};

