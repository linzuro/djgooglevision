import React, {Component} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const LogIn =(props)=>{
    const token = props.match.params.id
    window.localStorage.setItem('token', token)
    props.history.push('/')
    return null
}

const mapStateToProps = ({props}) => {
    return {props}
}
export default connect(mapStateToProps)(LogIn)