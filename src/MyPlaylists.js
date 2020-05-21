import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadPlaylistTracks} from './store.js'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Grid, IconButton} from '@material-ui/core/';
import {Paper, Button, Input} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase}from '@material-ui/core/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlaylistCard from './PlaylistCard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import axios from 'axios'


class MyPlaylists extends Component {
    constructor (){
      super()
      this.state={
        dataURL:'',
        label:'',
        image:''
      }
      this.predict = this.predict.bind(this)
      this.auth = this.auth.bind(this)
    }
    componentDidMount(){
      this.el.addEventListener('change', (ev)=>{
        const reader = new FileReader()
        const file = ev.target.files[0]
        reader.readAsDataURL(file)
        reader.addEventListener('load',()=>{
          const result = reader.result
          const dataURL = result.replace("data:image/jpeg;base64,", "")
          const image = result
          this.setState({dataURL, image})
        })
      })
    }
    async auth(){
      try{
      const response = (await axios.get('/auth/service')).data
      return response
      }catch(er){
        console.log(er)
      }
      
    }
    async predict() {
      try{
      const {dataURL} = this.state
      const access_token = await this.auth()
      const response = (await axios.post(
        'https://automl.googleapis.com/v1beta1/projects/461664795032/locations/us-central1/models/ICN7851880814785593344:predict',
        {
  
            payload: {
              "image": {
                "imageBytes": dataURL
              }
            }
        },
        {headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }}
        )).data
        console.log(response.payload[0].displayName)
        this.setState({label:response.payload[0].displayName})
        this.props.loadPlaylistTracks(this.state.label)
        
      }
      catch(er){
        console.log(er)
      }
    }
    render() {
    const {playlistTracks} = this.props
    console.log(playlistTracks)
    // return (<GridList>
    //             {playlistTracks.map(item=>{
    //                 return (
    //                   <GridListTile item xs={12} style={{ width:'calc(100%/5)', height:'same-as-width' }} key={item.album.id}>
    //                     <img style={{width:200, height:200}} src={item.album.images[0].url} />
    //                     <GridListTileBar
    //                       title={item.name}
    //                       subtitle={<span>by: {item.artists.map(artist=>artist.name).join(', ')}</span>}
    //                     />
    //                   </GridListTile>
    //             )})}
    //             </GridList>
    // )
    return <div style={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center', margin:20}}>
      <form>
      <Input ref={ref=>this.el=ref} type='file'/>
      </form>
      <Button onClick={this.predict}>Predict</Button>
      <div>
      <Typography variant="h3">Label:{this.state.label}</Typography>
      {this.state.image ? <img style={{width:100}} src={this.state.image}/> :''}
      </div>
      {playlistTracks.map((track) => {
           return <PlaylistCard track={track}/>
      })}
      {this.state.label ?
      <Paper style={{
        width:'100%', 
        backgroundColor:'rgba(0,0,0,.5)', 
        position:'fixed',
        bottom:0, 
        display:'flex', 
        justifyContent:'flex-end',
        alignItems:'center',
        alignContent:'center',
        }}>
        <Button
          style={{margin:10}}
          variant="contained"
          startIcon={<ExitToAppIcon />}
          >
            Start Over
          </Button>
          <Button
            style={{margin:10}}
            variant="contained"
            startIcon={<RefreshIcon />}
          >
            Regenerate
          </Button>
          <Button
            style={{margin:10}}
            variant="contained"
            color='primary'
            startIcon={<PlaylistAddCheckIcon />}
          >
            Save Playlist
          </Button>
      </Paper>
      :''}
    </div>
    }
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

export default connect(mapStateToProps,mapDispatchToProps)(MyPlaylists)