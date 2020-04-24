import React, {Component} from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core/';
import {Paper} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase }from '@material-ui/core/';
import { withStyles } from "@material-ui/core";
import {playTrackToAll,loadNowPlaying,updateNowPlaying} from './store.js'




const TrackCardSearch =(props)=>{
      const{tracks,playTrackToAll,updateNowPlaying} = props
        return (
          <div className='track-card-root' style={{width:'100%'}}>
            {tracks.map((track) => (
              
              <Paper key={track.id} style={{padding: 10, width:'calc(100%-20px)', maxHeight:200, margin:10}}>
                <ButtonBase key={track.id} onClick={()=>{
                  playTrackToAll({track:track.id,album:track.album.id})
                  updateNowPlaying()
                }}>
                  <Grid container spacing={2} style={{display:'flex', flexWrap:'wrap', justifyContent:'space-between'}}>
                      <Grid item>
                              <img className ='track-card-img' style={{width:150, height:150}} alt="complex" src={track.album.images[0].url} />
                      </Grid>
                      <Grid item xs={12} sm container style={{width:'calc(100%-20px)', margin:10, display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <Grid item xs container direction="column" spacing={2}>
                              <Grid item xs>
                              <Typography gutterBottom variant="subtitle1">
                                  {track.name}
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                  {track.album.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                  {track.artists[0].name}
                              </Typography>
                              </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">+</Typography>
                          </Grid>
                      </Grid>
                  </Grid>
                  </ButtonBase>
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
    }
    };
  };

export default (connect(mapStateToProps,mapDispatchToProps)(TrackCardSearch))