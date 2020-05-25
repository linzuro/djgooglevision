import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadPlaylistTracks} from './store.js'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Grid, IconButton} from '@material-ui/core/';
import {Paper} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase}from '@material-ui/core/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AlbumIcon from '@material-ui/icons/Album';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const PlaylistCard =({track})=>{
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    return (
        <Paper key={track.id} variant="outlined" style={{padding: 10, width:'calc(80%)', display:'flex',justifyContent:'space-between', maxHeight:200, margin:5}}>
            <Grid style={{width:'calc(80%)'}} container spacing={2}>
                <Grid>
                        <img className ='track-card-img' style={{width:100, height:100}} alt="complex" src={track.album.images[0].url} />
                </Grid>
                <Grid style={{maxHeight: 200, width:'calc(100%-500px)',margin:10, display:'flex',alignItems:'center'}}>
                    <Grid item xs={12} >
                        <Typography gutterBottom variant="subtitle1">
                            {track.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" >
                          {track.artists.map(artist=>artist.name).join(', ')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid>
              {/* <ButtonBase style={{padding: 10, width:'calc(100%-20px)', maxHeight:200}} key={track.id} onClick={()=>{
                //add remove and replace with next in line here
              }}> */}
              <IconButton onClick={handleClick}>
                <MoreHorizIcon/>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <RemoveCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Remove From Playlist" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <FavoriteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Like Song" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AlbumIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="View Album" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="View Artists" />
                </MenuItem>
              </Menu>
              {/* </ButtonBase> */}
            </Grid>
        </Paper>
    )
  }

const mapDispatchToProps = (dispatch)=> {
    return {
      loadPlaylistTracks: (label)=> {
        dispatch(loadPlaylistTracks(label))
        console.log('load playlist tracks');
      }
    };
  };

const mapStateToProps = ({playlistTracks}) => {
    return {playlistTracks}
}

export default connect(mapStateToProps,mapDispatchToProps)(PlaylistCard)