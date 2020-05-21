import React, {Component} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {logIn } from './store.js'

const LogIn =({history,logIn,match})=>{
    const token = match.params.id
    window.localStorage.setItem('token', token)
    logIn(token)
    history.push('/')
    return null
}

const mapStateToProps = ({props}) => {
    return {props}
}

const mapDispatchToProps = (dispatch)=> {
    return {
      logIn: (token)=> {
        dispatch(logIn(token))
        console.log('logged user in');
      }
    };
  };
export default connect(mapStateToProps,mapDispatchToProps)(LogIn)