import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const AlbumCard=({item})=>{
  return (
          <GridListTile item xs={12} style={{ width:'calc(100%/5)', height:'same-as-width' }} key={item.album.id}>
            <img src={item.album.images[0].url} />
            <GridListTileBar
              title={item.album.name}
              subtitle={<span>by: {item.album.artists[0].name}</span>}
            />
          </GridListTile>
        )
};

export default AlbumCard