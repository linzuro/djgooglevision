import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Router, Route, Redirect,Switch,Link,BrowserRouter} from 'react-router-dom';
import Nav from './Nav.js'
import Header from './Header.js'
import {
  loadUser,
  loadNowPlaying,
  loadPlaylists,
  loadAlbums,
  loadTracks,
  loadRecentlyPlayed,
  logIn,
  playTrack,
  addTrackToQueue
} from './store.js'
import Home from './Home.js'
import LogIn from './LogIn.js'
import LogInButton from './LogInButton.js'
import Recent from './Recent.js'
import Playlists from './Playlists.js'
import Albums from './Albums.js'
import NowPlaying from './NowPlaying.js'
import LogOut from './LogOut.js'
import MyPlaylists from './MyPlaylists.js'



class App extends React.Component {
  componentDidMount() {
    const token = window.localStorage.getItem('token')
    if(token){
      this.props.logIn(token)
      this.props.load()
    }
    window.socket = io();
    socket.on('play', (message)=> {
      console.log(message)
      const track = message
      this.props.playTrack(track)
      setTimeout(()=>{
        this.props.loadNowPlaying()
      },1000)
    });
    socket.on('queue', (message)=> {
      console.log(message)
      const track = message
      console.log('track',track)
      this.props.addTrackToQueue(track)
      // this.props.loadNowPlaying()

    });
  }
  render() {
    const {user,loggedIn} = this.props

      if(user.id){
        return (
       <HashRouter>
        <Route component={Header} />
         <Route component={Nav} />
         <Route exact path='/' component={Home} />
         <Route exact path='/token/:id' component={LogIn} />
         <Route exact path='/test' component={LogIn} />
         <Route exact path='/nowplaying' component={NowPlaying} />
         <Route exact path='/albums' component={Albums} />
         <Route exact path='/playlists' component={Playlists} />
         <Route exact path='/recentlyplayed' component={Recent} />
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
      console.log(token)
      dispatch(logIn(token))
      console.log('user logged in')
    },
    playTrack:(track)=>{
      dispatch(playTrack(track))
      console.log('play track success')
    },
    loadNowPlaying: ()=>{
      dispatch(loadNowPlaying())
      console.log('now playing loaded')
  },
  addTrackToQueue:(track)=>{
    dispatch(addTrackToQueue(track))
    console.log('add track to queue success')
  },
  };
};

const mapStateToProps = ({user}) => {
  return {user}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

