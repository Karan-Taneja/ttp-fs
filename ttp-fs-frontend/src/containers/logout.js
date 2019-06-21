import React from 'react';
import firebase from '../firebase';
import { Redirect } from 'react-router-dom';

// ---- Components
import Loading from '../components/loading';

// ---- Scripts
import appCache from '../scripts/cache';

export default class Logout extends React.Component {
  componentDidMount() {
    console.log('mounted');
    firebase.auth().signOut();
    appCache.removeItem('user');
  };
  render() {
    const user = appCache.getItem('user');
    return user ? <Loading /> : <Redirect to="/" />
  };
};