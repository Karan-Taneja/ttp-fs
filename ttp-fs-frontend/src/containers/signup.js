import React from 'react';
import firebase from '../firebase';
import axios from 'axios';
import AuthContext from '../contexts/auth';
import { Link, Redirect } from 'react-router-dom'

export default class Signup extends React.Component {

  state = {
    email: '',
    password: '',
    confirm: '',
    error: ''
  };

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, confirm } = this.state;
    if(password === confirm){
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (response) => {
          console.log('Returns: ', response);
          const user = response.user
          axios.post(`http://arbiter-stocks.herokuapp.com/users/`, {
            email: `${email}`
          })
          .then(res => {
            console.log(res);
          })
        })
        .catch(err => {
          const { message } = err;
          this.setState({ error: message });
        });
    }
    else{
      this.setState({ error: 'passwords do not match'});
    };
  };

  render() {
    const { email, password, confirm, error } = this.state;
  const displayError = error === '' ? <div style={{height: '3em'}}></div> : 
    <div className="d-flex justify-content-center mb-0">
      <div className="alert alert-danger col-sm-12 col-md-6" role="alert">
        {error}
      </div>
    </div>;
    const displayForm = <div style={{width: '100%'}} className="d-flex flex-wrap justify-content-center align-items-center">
      <div className="col-12">
        <h1 className="col-12 text-center">Sign Up</h1>
        {displayError}
        <form style={{margin: '0 auto'}} className="border rounded col-sm-12 col-md-6 px-3 py-4">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" name="email" value={email} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" placeholder="Password" value={password} name="password" onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputConfirmPassword1">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm Password" value={confirm} name="confirm" onChange={this.handleChange} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span>Already have an account?</span>
              <Link to="/login" className="px-1">Login</Link>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Sign Up</button>
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