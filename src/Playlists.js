import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadPlaylists} from './store.js'

class Playlists extends Component {
    componentDidMount() {
       this.props.loadPlaylists()
    }
    render() {
    const {playlists} = this.props
    return (<ul>
                {playlists.map(playlist=>{
                    return <li key={playlist.id}>{playlist.name}</li>
                })}
            </ul>);
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
      loadPlaylists: ()=> {
        dispatch(loadPlaylists())
        console.log('load playlist data');
      }
    };
  };

const mapStateToProps = ({playlists}) => {
    return {playlists}
}

export default connect(mapStateToProps,mapDispatchToProps)(Playlists)