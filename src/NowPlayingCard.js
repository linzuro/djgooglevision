
import React, {Component} from 'react';
import {connect} from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { withStyles } from "@material-ui/core";
import {playTrackToAll,loadNowPlaying,searchTrack, resumePlayback, pausePlayback, nextTrack, previousTrack} from './store.js'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin:10,
    padding:10,
    justifyContent:'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    padding:10,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

class NowPlayingCard extends Component{
componentDidMount(){
    this.props.loadNowPlaying()
}
render(){
    const {nowPlaying} = this.props
    const {classes} = this.props
    return (
      <Card className={classes.root} style={{width:'calc(100%-20px)',display:'flex',flexWrap:'wrap',padding:20,justifyContent:'center', margin:10}}>
         <div style={{display:'flex',alignItems:'center',flexDirection:'column',justifyItems:'flex-end'}}>
        {nowPlaying.item ? 
        <CardMedia elevation={3}
        style={{width:400, height:400, margin:10}}
          image={nowPlaying.item.album.images[0].url}
          title="Live from space album cover"
        />
        : '' }
          <div>
          <CardContent style={{display:'flex',alignItems:'center',justifyItems:'space-between',alignContent:'space-between',flexDirection:'column',justifyItems:'center'}}>
            <Typography component="h5" variant="h5">
              {nowPlaying.item ? nowPlaying.item.name : ''}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {nowPlaying.item ? nowPlaying.item.artists[0].name : ''}
            </Typography>
          </CardContent>
          </div>
          <div >
            <IconButton aria-label="previous">
              <SkipPreviousIcon />
            </IconButton>
            <IconButton aria-label="play/pause">
              <PlayArrowIcon  />
            </IconButton>
            <IconButton aria-label="next">
              <SkipNextIcon />
            </IconButton>
          </div>
        </div>
      </Card>
    );
  }
}


const mapStateToProps = ({nowPlaying}) => {
    return {nowPlaying}
}

const mapDispatchToProps = (dispatch)=> {
  return {
    loadNowPlaying: ()=>{
        dispatch(loadNowPlaying())
        console.log('now playing loaded')
    },
    resumePlayback: ()=>{
      dispatch(resumePlayBack())
      console.log('playback resumed')
    },
    pausePlayback: ()=>{
      dispatch(pausePlayback())
      console.log('playback paused')
    },
    nextTrack: ()=>{
      dispatch(nextTrack())
      console.log('skipped to next track')
    },
    previousTrack: ()=>{
      dispatch(previousTrack())
      console.log('skipped to previous track')
    }
  };
};

export default withStyles(useStyles)(connect(mapStateToProps,mapDispatchToProps)(NowPlayingCard))