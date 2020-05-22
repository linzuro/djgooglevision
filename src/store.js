import axios from 'axios';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunks from 'redux-thunk';
import {createLogger} from 'redux-logger';

//constants
const SET_TRACKS = "SET_TRACKS"
const SET_NOWP = "SET_NOWP"
const SET_USER = "SET_USER"
const SET_PLAYLISTS = "SET_PLAYLISTS"
const SET_ALBUMS = "SET_ALBUMS"
const SET_RECP = "SET_RECP"
const SET_TOKEN = "SET_TOKEN"
const SET_PLAYTRACKS="SET_PLAYTRACKS"
const RESET_PLAYTRACKS = "RESET_PLAYTRACKS"

const LOAD_TRACKS = "LOAD_TRACKS"
const UPDT_NOWP = "UPT_NOWP"

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

const _loadTracks = (data)=>{
  return {
    type:SET_TRACKS, 
    tracks: data
  }
}
const _loadNowPlaying= (data)=>{
  return {
    type:SET_NOWP, 
    track: data
  }
}
const _loadUser = (data)=>{
  return {
    type:SET_USER, 
    user: data
  }
}
const _loadPlaylists = (data)=>{
  return {
    type:SET_PLAYLISTS, 
    playlists: data
  }
}
const _loadAlbums = (data)=>{
  return {
    type:SET_ALBUMS, 
    albums: data
  }
}
const _loadRecentlyPlayed = (data)=>{
  return {
    type:SET_RECP, 
    tracks: data
  }
}

const _updateNowPlaying= (data)=>{
  return {
    type:UPDT_NOWP, 
    track: data
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
// const _setSearch=(data)=>{
//   return {
//     type:SET_SEARCH,
//     search:data
//   }
// }



//thunks

const loadPlaylistTracks = (label)=>{
  return async(dispatch)=>{
    const data = (await axios.post('/api/makePlaylist',{label})).data
    console.log(data.tracks)
    dispatch(_loadPlaylistTracks(data.tracks))
  }
}
const logIn = (token)=>{
  return async(dispatch)=>{
    const data = (await axios.post('/login',{token})).data
    dispatch(_logIn(true))
  }
}

const loadTracks=(id)=>{
    return async(dispatch)=>{
      const data = (await axios.get(`/api/album/${id}`)).data
      dispatch(_loadTracks(data))
  }
}
const loadNowPlaying=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/nowplaying`)).data
    dispatch(_loadNowPlaying(data))
}
}

const updateNowPlaying=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/nowplaying`)).data
    dispatch(_updateNowPlaying(data))
}
}
const loadUser=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/user`)).data
    dispatch(_loadUser(data))
}
}
const loadPlaylists=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/playlists`)).data
    dispatch(_loadPlaylists(data))
}
}
const loadAlbums=()=>{
  return async(dispatch)=>{
    console.log('here')
    const data = (await axios.get(`/api/albums`)).data
    dispatch(_loadAlbums(data))
}
}
const loadRecentlyPlayed=()=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/api/recentlyplayed`)).data
    dispatch(_loadRecentlyPlayed(data))
}
}

const playTrack = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/play`,track))
    // console.log(data)
    // dispatch(_updateNowPlaying(data))
}
}

const playTrackToAll = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/playToAll`,track)).data
    // dispatch(_setSearch(""))
}}

const addTrackToAllQueue = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/addTrackToAllQueue`,track)).data
    // dispatch(_setSearch(""))
}}

const addTrackToQueue = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/addTrackToQueue`,track)).data
    // dispatch(_setSearch(""))
}}

const searchTrack = (track)=>{
  return async(dispatch)=>{
    if(track.track===""){
      dispatch(_loadTracks([]))
    }else{
      const data = (await axios.post(`/api/search`,track)).data.body.tracks.items
      dispatch(_loadTracks(data))
      // dispatch(_setSearch(track.track))
    }
}}

const nextTrack = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/play`,track))
    // console.log(data)
    // dispatch(_updateNowPlaying(data))
}
}

const previousTrack = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/play`,track))
    // console.log(data)
    // dispatch(_updateNowPlaying(data))
}
}

const resumePlayback = (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/play`,track))
    // console.log(data)
    // dispatch(_updateNowPlaying(data))
}
}

const pausePlayback= (track)=>{
  return async(dispatch)=>{
    const data = (await axios.post(`/api/play`,track))
    // console.log(data)
    // dispatch(_updateNowPlaying(data))
}
}

const logOut= (track)=>{
  return async(dispatch)=>{
    const data = (await axios.get(`/logout`,track))
    // console.log(data)
    dispatch(_logOut(false))
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
const nowPlayingReducer = (state = {}, action)=> {
  switch(action.type){
    case SET_NOWP: return action.track
    case UPDT_NOWP: return action.track
    default: return state
  };
};
const userReducer = (state = {}, action)=> {
  switch(action.type){
    case SET_USER: return action.user
    default: return state
  };
};
const playlistReducer = (state = [], action)=> {
  switch(action.type){
    case SET_PLAYLISTS: return action.playlists
    default: return state
  };
};
const albumReducer = (state = [], action)=> {
  switch(action.type){
    case SET_ALBUMS: return action.albums
    default: return state
  };
};
const recentlyPlayedReducer = (state = [], action)=> {
  switch(action.type){
    case SET_RECP: return action.tracks
    default: return state
  };
};
const tracksReducer = (state = [], action)=> {
  switch(action.type){
    case SET_TRACKS: return action.tracks
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
  nowPlaying:{},
  user:{},
  playlists:[],
  albums:[],
  recentlyPlayed:[],
  tracks:[]
}

const reducer = combineReducers({
  loggedIn:logInReducer,
  nowPlaying: nowPlayingReducer,
  user: userReducer,
  playlists: playlistReducer,
  albums: albumReducer,
  recentlyPlayed:recentlyPlayedReducer,
  tracks:tracksReducer,
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
 loadNowPlaying,
 loadPlaylists,
 loadAlbums,
 loadTracks,
 loadRecentlyPlayed,
 logIn,
 playTrack,
 playTrackToAll,
 searchTrack,
 updateNowPlaying,
 addTrackToAllQueue,
 addTrackToQueue,
 nextTrack,
 previousTrack,
 pausePlayback,
 resumePlayback,
 logOut,
 loadPlaylistTracks,
 savePlaylist,
 resetPlaylistTracks
};
