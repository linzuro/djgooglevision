import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadPlaylistTracks, savePlaylist} from './store.js'
import {Grid, IconButton, Card, CardContent} from '@material-ui/core/';
import {Paper, Button, Input} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase}from '@material-ui/core/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlaylistCard from './PlaylistCard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import LZString from 'lz-string'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Playlist=({editMode,image,name,playlistTracks})=> {
    const playlistDetails = playlistTracks.reduce((acc,elem)=>{
      acc.duration+=elem.duration_ms
      acc.count+=1
      return acc
    },{duration:0,count:0})

    return (
      <div style={{width:'100%',display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center'}}>
            <form>
            {!image ? 
            <Input accept="image/*" ref={ref=>this.el=ref} type='file'/> 
            :
            ''}
            </form>
      
            <div style={{width:'100%',display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center'}}>
                {playlistTracks.length ?
                    <div style={{width:'100%',display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center'}}> 
                        <Card style={{width:'calc(80%)', margin:5,padding:10, display:'flex'}}>
                            <img style={{border:'1px solid rgba(255,255,255,0.1)', width:'calc(100%/2)', height:'same-as-width', backgroundPosition:'center center', backgroundRepeat:'no-repeat',backgroundAttachment: 'fixed',objectFit:'cover', backgroundSize:'auto'}} src={image}/> 
                            <CardContent style={{width:'calc(100%/2)', alignItems:'center', alignContent:'center'}}>
                            
                            <div style={{width:'100%', display:'flex',flexDirection:'column'}}>
                                <div>
                                <Typography variant="body1">PLAYLIST</Typography>
                                </div>
                                {editMode ? 
                                <div style={{display:'flex'}}>
                                <Input 
                                style={{width:'calc(80%)', fontSize:'2.125rem'}}
                                label="Playlist Name" 
                                value={name} 
                                onChange={(ev)=>this.setState({name:ev.target.value})} 
                                placeholder={name}/> 
                                <IconButton onClick={()=>this.setState({editMode:false})}>
                                <CheckIcon fontSize='small'/>
                                </IconButton>
                                </div>
                            
                            : 
                                <div style={{display:'flex'}}>
                                <Typography variant="h4">{name}</Typography>
                                <IconButton onClick={()=>this.setState({editMode:true})}>
                                <EditIcon fontSize='small'/>
                                </IconButton>
                                </div>
                            }
                                <div>
                                <Typography variant="body1">{playlistDetails.count} songs</Typography>
                                </div>
                                <div>
                                <Typography variant="body1">{Math.floor(playlistDetails.duration/60000)} minutes</Typography>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        {playlistTracks.map((track) => {
                            return <PlaylistCard track={track}/>
                        })}
                    </div>
                :''}
            </div>
        </div>
    )}
  


const mapDispatchToProps = (dispatch)=> {
    return {
      loadPlaylistTracks: (label)=> {
        dispatch(loadPlaylistTracks(label))
        console.log('load playlist tracks');
      },
      savePlaylist: (playlistTracks)=> {
        dispatch(savePlaylist(playlistTracks))
        console.log('save playlist');
      }
    };
  };

const mapStateToProps = ({playlistTracks, user}) => {
    return {playlistTracks,user}
}

export default connect(mapStateToProps,mapDispatchToProps)(MyPlaylists)