import React, {Component} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {logOut} from './store.js'

class LogOut extends Component {
  componentDidMount(){
    const {history,logOut,user} = this.props
    window.localStorage.removeItem('token')
    logOut()
  }
  render(){
    return null
  }
}

const mapStateToProps = (props) => {
    return props
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