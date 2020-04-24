import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, useHistory } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    toolbar: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
    justifyContent: 'center',
      flex: 1,
    },
    toolbarSecondary: {
      
      overflowX: 'auto',
    },
    toolbarLink: {
      padding: theme.spacing(1),
      flexShrink: 0,
    },
  }));

const Header=({user,location})=>{
    const classes = useStyles()
    return  <Toolbar component="nav" variant="dense" className={classes.toolbarTitle}>
                <h1 className='title'>hang the dj</h1>
            </Toolbar>
}

const mapStateToProps = ({events,user}) => {
    return {events,user}
}

export default connect(mapStateToProps)(Header)