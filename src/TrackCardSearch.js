import React, {Component} from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core/';
import {Paper} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase}from '@material-ui/core/';
import { withStyles } from "@material-ui/core";
import {playTrackToAll,loadNowPlaying,updateNowPlaying, addTrackToAllQueue} from './store.js'


const TrackCardSearch =(props)=>{
      const{tracks,playTrackToAll,updateNowPlaying, addTrackToAllQueue} = props
        return (
          <div className='track-card-root' style={{width:'100%'}}>
            {tracks.map((track) => (
              
              <Paper key={track.id} variant="outlined" style={{padding: 10, width:'calc(100%-20px)', display:'flex', maxHeight:200, margin:10}}>
                <ButtonBase style={{padding: 10, width:'calc(100%-20px)', maxHeight:200, margin:10}} key={track.id} onClick={()=>{
                  playTrackToAll({action:'play',track:track.id,album:track.album.id})
                  updateNowPlaying()
                }}>
                  <Grid style={{width:'calc(100%-20px)'}} container spacing={2}>
                      <Grid>
                              <img className ='track-card-img' style={{width:150, height:150}} alt="complex" src={track.album.images[0].url} />
                      </Grid>
                      <Grid style={{maxHeight: 200, width:'calc(100%-500px)',margin:10, display:'flex',alignItems:'center'}}>
                          <Grid item xs={12} spacing={2}>
                              <Typography gutterBottom variant="subtitle1">
                                  {track.name}
                              </Typography>
                              <Typography  variant="body2" gutterBottom>
                                  {track.album.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" >
                                  {track.artists[0].name}
                              </Typography>
                          </Grid>
                      </Grid>
                  </Grid>
                  </ButtonBase>
                  <Grid>
                    <ButtonBase style={{padding: 10, width:'calc(100%-20px)', maxHeight:200, margin:10}} key={track.id} onClick={()=>{
                      addTrackToAllQueue({action:'queue',track:track.id,album:track.album.id})
                      //updateNowPlaying()
                    }}>Add To Queue</ButtonBase>
                  </Grid>
              </Paper>
             
            ))}
        </div>
        );
    }


const mapStateToProps = ({tracks}) => {
    return {tracks}
}

const mapDispatchToProps = (dispatch)=> {
    return {
      playTrackToAll: (track)=> {
        dispatch(playTrackToAll(track))
        console.log(`play track to all success`);
      },
      updateNowPlaying: ()=>{
        dispatch(updateNowPlaying())
        console.log('now playing loaded')
      },
      addTrackToAllQueue: (track)=> {
        dispatch(addTrackToAllQueue(track))
        console.log(`add track to all queue success`);
      },
    };
  };

export default (connect(mapStateToProps,mapDispatchToProps)(TrackCardSearch))