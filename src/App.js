import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Redirect, useHistory,Switch} from 'react-router-dom';
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
  playTrack
} from './store.js'
import Home from './Home.js'
import LogIn from './LogIn.js'
import Recent from './Recent.js'
import Playlists from './Playlists.js'
import Albums from './Albums.js'
import NowPlaying from './NowPlaying.js'



class App extends React.Component {
  componentDidMount() {
    const token = window.localStorage.getItem('token')
    if(token){
      this.props.logIn(token)
      this.props.load()
    }
    window.socket = io();
    socket.on('message', (message)=> {
      console.log(message)
      const track = message
      this.props.playTrack(track)
      this.props.loadNowPlaying()

    });
  }
  render() {
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
      </HashRouter>
    );
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
  };
};

export default connect(null, mapDispatchToProps)(App);

