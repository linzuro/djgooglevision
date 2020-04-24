import React, {Component, useState } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import { render } from 'react-dom';
import {playTrackToAll,loadNowPlaying,searchTrack} from './store.js'
import TrackCardSearch from './TrackCardSearch.js'
import {Button, TextField} from '@material-ui/core';
import NowPlayingCard from './NowPlayingCard.js'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

// class Search extends Component{
//     constructor(){
//         super()
//         this.state={
//             track:''
//         }
//     }
//     render(){
//         const {track} = this.state
//         return (
//             <FormControl fullWidth onSubmit = {(ev)=>ev.preventDefault()} >
//                 <TextField
//                             InputProps={{
//                                 startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon />
//                                 </InputAdornment>
//                                 ),}} 
//                             style={{width:'calc(100%-20px)', margin:10}}
//                             id="outlined-basic" 
//                             size="small" label="track" 
//                             variant="outlined" value={track} 
//                             name="track" placeholder="track" 
//                             onChange={(ev)=>{
//                                 const track = ev.target.value
//                                 this.setState({track})
//                                 this.props.searchTrack({track})
//                             }}
//                     />
//             </FormControl>
//         );
//     };
// }

const Search=(props)=>{
    console.log(props)
    const {searchTrack} = props
    const [search, setSearch] = useState("");
    return (
        <FormControl fullWidth onSubmit = {(ev)=>ev.preventDefault()} >
            <TextField
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            ),}} 
                        style={{width:'calc(100%-20px)', margin:10}}
                        id="outlined-basic" 
                        size="small" label="track" 
                        variant="outlined" value={search} 
                        name="track" placeholder="track" 
                        onChange={(ev)=>{
                            const track = ev.target.value
                            setSearch(track)
                            searchTrack({track})
                        }}
                />
        </FormControl>
    );
};


const mapStateToProps = ({nowPlaying, tracks}) => {
    return {nowPlaying, tracks}
}

const mapDispatchToProps = (dispatch)=> {
    return {
      searchTrack: (track)=>{
          dispatch(searchTrack(track))
          console.log('searching track')
      }
    };
  };
  

export default connect(mapStateToProps,mapDispatchToProps)(Search)