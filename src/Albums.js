import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadAlbums} from './store.js'
import AlbumCard from './AlbumCard.js'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { withStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        margin:10,
        backgroundColor: theme.palette.background.paper,
        width:500
    },
    gridList: {
       width:'100%',
       height:'100%'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    }));

class Albums extends Component{
    componentDidMount(){
        this.props.loadAlbums()
    }
    render(){
        // const classes = useStyles();
        const { classes } = this.props;
        const {albums} = this.props
        return (
            <div className={classes.root} >
                <GridList className={classes.gridList}>
                    {albums.map((item) => (
                                <AlbumCard item={item}/>
                    ))}
                </GridList>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch)=> {
    return {
      loadAlbums: ()=> {
        dispatch(loadAlbums())
        console.log('load album data');
      }
    };
  };

const mapStateToProps = ({albums}) => {
    return {albums}
}

export default withStyles(useStyles)(connect(mapStateToProps,mapDispatchToProps)(Albums))