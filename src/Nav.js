import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory, Redirect } from 'react-router-dom';
import {Paper,Tabs,Tab} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      display:'flex',
      flexWrap:'wrap',
      justifyContent:'center'
    }
  });
  

const Nav = ({ user }) => {
    const classes = useStyles();
    const history = useHistory()
    const handleChange = (event, newValue) => {
        history.push(newValue);
    };
    return (
            <Paper square className={classes.root}>
            <Tabs
                value={history.location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
            >
                
                <Tab value='/' label='Home' />
                <Tab value='/makeplaylists' label="Make A Playlist"/>
                {/* <Tab value='/nowplaying' label='Now Playing'/>
                <Tab value = '/albums' label='Albums' />
                <Tab value='/playlists' label='Playlists' />
                <Tab value='/recentlyplayed' label='Recently Played'/> */}
                {user.display_name ? <Tab value = '/logout' label='Log Out' /> : <Tab value = '/login/spotify' label='Log In' />}
            </Tabs>
            </Paper>
    );
};

const mapStateToProps = ({user}) => {
    return {user}
}

export default connect(mapStateToProps)(Nav)