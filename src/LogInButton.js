import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Redirect, useHistory,Switch,Link} from 'react-router-dom';
import {Button}from '@material-ui/core/';

const LogInButton =()=>{

    return <div style={{display:'flex',justifyContent:'center', color:'white', textDecoration:'none', justifyItems:'center'}}>
                <Button variant="contained" color="primary" size="large" style={{width:'calc(100%/3)',color:'white', textDecoration:'none'}} href="/login/spotify">
                        Log In
                </Button>
            </div>
}

const mapStateToProps = ({props}) => {
    return {props}
}
export default connect(mapStateToProps)(LogInButton)