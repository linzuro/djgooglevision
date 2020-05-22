import React, {Component} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {logOut} from './store.js'

const LogOut =({history,logOut,user,loggedIn})=>{
    // const token = props.match.params.id
    // window.localStorage.removeItem('token')
   console.log(logOut)
    logOut()
    console.log(user,loggedIn)
    // history.push('/')
    return null
}

const mapStateToProps = ({user,loggedIn}) => {
    return {user,loggedIn}
}

const mapDispatchToProps = (dispatch)=> {
    return {
      logOut: ()=> {
        dispatch(logOut())
        console.log('logged user out');
      }
    };
  };
export default connect(mapStateToProps,mapDispatchToProps)(LogOut)