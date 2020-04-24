import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 1000,
    height: 700,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const TrackCard=({track})=>{
  const classes = useStyles();
  console.log(track)
  return (
    <div className={classes.root} >
        <GridList item xs={12} className={classes.gridList}>
        {tracks.map((track) => (
          <GridListTile item xs={12} cols={3} style={{ width: 200, height: 200 }} key={track.id}>
            <img src={track.album.images[0].url} />
            <GridListTileBar
              title={track.name}
              subtitle={<span>by: {track.artists[0].name}</span>}
            />
          </GridListTile>
         
        ))}
      </GridList>
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
      }
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(TrackCard)