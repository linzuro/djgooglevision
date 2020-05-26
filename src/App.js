import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Router, Route, Redirect,Switch,Link,BrowserRouter} from 'react-router-dom';
import Nav from './Nav.js'
import Header from './Header.js'
import {loadUser,logIn} from './store.js'
import Home from './Home.js'
import LogIn from './LogIn.js'
import LogInButton from './LogInButton.js'
import LogOut from './LogOut.js'
import MyPlaylists from './MyPlaylists.js'



class App extends React.Component {
  constructor(){
    super()
    this.state={
      loading:true
    }
  }
  async componentDidMount() {
    const token = window.localStorage.getItem('token')
    if(token){
      await this.props.logIn(token)
    }
    const data = await this.props.load()
    this.setState({loading:false})
  }
  render() {
    const {user} = this.props
    const{loading} = this.state
      if(loading){
        return (
          <HashRouter>
            <Route component={Header} />
          </HashRouter>
        )
      }else if (!loading && user.id){
        return (
          <HashRouter>
            <Route component={Header} />
            <Route component={Nav} />
            <Route exact path='/' component={Home} />
            <Route exact path='/token/:id' component={LogIn} />
            <Route exact path='/logout' component={LogOut} />
            <Route exact path='/makeplaylists' component={MyPlaylists} />
          </HashRouter>
        )
       }else{
         return (
            <HashRouter>
              <Route component={Header} />
              <Route component={LogInButton} />
              <Route exact path='/token/:id' component={LogIn} />
            </HashRouter>
          )
       }
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    load: ()=> {
      dispatch(loadUser())
      console.log('load user data');
    },
    logIn: (token)=>{
      dispatch(logIn(token))
      console.log('user logged in')
    }
  };
};

const mapStateToProps = ({user}) => {
  return {user}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

