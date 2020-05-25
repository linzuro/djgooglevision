import axios from 'axios';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunks from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {useHistory} from 'react-router-dom'

//constants

const SET_USER = "SET_USER"
const SET_PLAYTRACKS="SET_PLAYTRACKS"
const RESET_PLAYTRACKS = "RESET_PLAYTRACKS"
const USER_LOGIN = "USER_LOGIN"
const USER_LOGOUT = "USER_LOGOUT"

//action creators
const _logIn = (data) =>{
  return {
    type:USER_LOGIN,
    data:data
  }
}

const _logOut = (data) =>{
  return {
    type:USER_LOGOUT,
    data:false
  }
}

const _loadUser = (data)=>{
  return {
    type:SET_USER, 
    user: data
  }
}

const _loadPlaylistTracks = (data)=>{
  return {
    type:SET_PLAYTRACKS, 
    tracks: data
  }
}

const _resetPlaylistTracks = ()=>{
  return {
    type:RESET_PLAYTRACKS, 
    tracks: []
  }
}


//thunks

const loadPlaylistTracks = (label)=>{
  return async(dispatch)=>{
    const data = (await axios.post('/api/makePlaylist',{label})).data
    dispatch(_loadPlaylistTracks(data.tracks))
  }
}
const logIn = (token)=>{
  return async(dispatch)=>{
    const data = (await axios.post('/login',{token})).data
    dispatch(_logIn(true))
  }
}


const loadUser=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/user`)).data
    dispatch(_loadUser(data))
}
}

const logOut= ()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/logout`))
    dispatch(_loadUser({}))
}
}

const savePlaylist= ({tracks,dataURL,name,userId})=>{
  return async(dispatch)=>{
    try{
      const playlist = (await axios.post(`/api/createPlaylist`,{userId,name})).data
      const data = (await axios.post(`/api/addPlaylistTracks`,{tracks,playlistId:playlist.id})).data
      const image = (await axios.post(`/api/updatePlaylistImage`,{playlistId:playlist.id,dataURL})).data
      dispatch(_loadPlaylistTracks([]))
    }catch(er){
      console.log(er)
    }
}
}
const resetPlaylistTracks= ()=>{
  return async(dispatch)=>{
    try{
      dispatch(_resetPlaylistTracks())
    }catch(er){
      console.log(er)
    }
}
}



//reducers
const logInReducer = (state=false,action)=>{
  switch(action.type){
      case USER_LOGOUT: return false
      case USER_LOGIN: return true
      default: return state
  }
}
const userReducer = (state = {}, action)=> {
  switch(action.type){
    case SET_USER: return action.user
    default: return state
  };
};
const playlistTrackReducer = (state=[],action)=>{
  switch(action.type){
      case SET_PLAYTRACKS: return action.tracks
      case RESET_PLAYTRACKS: return action.tracks
      default: return state
  }
}

const initialState={
  loggedIn:false, 
  user:{},
  playlistTracks:[]
}

const reducer = combineReducers({
  loggedIn:logInReducer,
  user: userReducer,
  playlistTracks:playlistTrackReducer,
});

const rootReducer = (state, action) => {
  switch(action.type){
    case USER_LOGOUT: return initialState
    default: return reducer(state, action)
  }
}


const store = createStore(rootReducer, applyMiddleware(
  thunks,
  createLogger({collapsed: true}),
));


export default store;

export {
 loadUser,
 logIn,
 logOut,
 loadPlaylistTracks,
 savePlaylist,
 resetPlaylistTracks
};
