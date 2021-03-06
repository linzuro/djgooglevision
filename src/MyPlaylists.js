import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadPlaylistTracks, savePlaylist,resetPlaylistTracks} from './store.js'
import {Grid, IconButton, Card, CardContent} from '@material-ui/core/';
import {Paper, Button, Input} from '@material-ui/core/';
import {Typography} from '@material-ui/core/';
import {ButtonBase}from '@material-ui/core/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlaylistCard from './PlaylistCard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import LZString from 'lz-string'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class MyPlaylists extends Component {
    constructor (){
      super()
      this.state={
        dataURL:'',
        label:'',
        image:'',
        name:'My Playlist',
        editMode:false,
        loading:true,
        open:false,
        message:'',
        severity:''
      }
      this.predict = this.predict.bind(this)
      this.auth = this.auth.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.restart = this.restart.bind(this)
      this.submit = this.submit.bind(this)
    }
    
    componentDidMount(){
        this.el.addEventListener('change',(ev)=>{
          this.setState({loading:true})
          const reader = new FileReader()
          const file = ev.target.files[0]
          reader.readAsDataURL(file)
          reader.addEventListener('load',()=>{
            const result = reader.result
            this.handleChange(result)
          })
        })
      this.setState({loading:false})
    }
    componentDidUpdate(prevProps,prevState){
      if(prevProps!==this.props){
        this.setState({loading:false})
      }
    }
    restart(){
      this.setState({
        dataURL:'',
        label:'',
        image:'',
        name:'My Playlist',
        editMode:false,
      })
      this.props.reset()
      this.el.value=null
    }
    submit(){
      const {dataURL,name} = this.state
      const {savePlaylist,playlistTracks,user} = this.props
      this.setState({loading:true})
      const tracks = playlistTracks.map(track=>{
        return `spotify:track:${track.id}`
      })
      savePlaylist({
        tracks,
        dataURL,
        name,
        userId:user.id
      })

      this.restart()
      this.setState({open:true, message:'Playlist created!',severity:'success'})
    }
    handleChange(result){
      this.setState({
        dataURL:result.slice(result.indexOf(',')+1),
        image:result
      })
      if(this.state.dataURL){
        this.predict()
      }
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
      const {dataURL,loading} = this.state
      if(!loading) this.setState({loading:true})
      const access_token = await this.auth()
      const response = (await axios.post(
        'https://automl.googleapis.com/v1beta1/projects/264619210771/locations/us-central1/models/ICN4585686966476996608:predict',
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
        console.log(response.payload[0])
        this.setState({label:response.payload[0].displayName})
        this.props.loadPlaylistTracks(this.state.label)
      }
      catch(er){
        console.log(er)
        // console.log(response)
        this.setState({
          loading:false,
          message:'An error occured. Please try again later',
          open:true,
          severity:'error',
        })
        this.restart()
      }
    }
    render() {
    const {playlistTracks} = this.props
    const playlistDetails = playlistTracks.reduce((acc,elem)=>{
      acc.duration+=elem.duration_ms
      acc.count+=1
      return acc
    },{duration:0,count:0})
    const {editMode,image,name,label,open, loading,message,severity} = this.state
    return (
    <div style={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center', margin:20}}>
      <Snackbar open={open} autoHideDuration={6000} onClose={()=>this.setState({open:false})}>
        <Alert onClose={()=>this.setState({open:false})} severity={severity}>
         {message}
        </Alert>
      </Snackbar>
      <form>
        <div style={{display:!image && !loading ? 'flex' : 'none', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center'}}>
          <Button
            variant="contained"
            component="label"
            color='primary'
            style={{margin:10}}
          >
            Select Image
            <input
            style={{width:'100%'}} accept="image/*" ref={ref=>this.el=ref}
              type="file"
              style={{ display: "none" }}
            />
          </Button>
        <Typography variant="body2">
          Only JPEG images less than 265KB can be used as playlist covers
        </Typography>
        </div>
      </form>
      {loading ?
        <CircularProgress/>
      :
        <div style={{width:'100%',display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center', margin:20}}>
               {playlistTracks.length ?
                    <div style={{width:'100%',display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', alignContent:'center'}}> 
                        <Card style={{width:'calc(80%)', margin:5,padding:10, display:'flex'}}>
                            <img style={{border:'1px solid rgba(255,255,255,0.1)', width:200, height:200, backgroundPosition:'center center', backgroundRepeat:'no-repeat',backgroundAttachment: 'fixed',objectFit:'cover', backgroundSize:'auto'}} src={image}/> 
                            <CardContent style={{width:'calc(100%/2)', alignItems:'center', alignContent:'center'}}>
                            
                            <div style={{width:'100%', display:'flex',flexDirection:'column', alignContent:'space-around',}}>
                                <div>
                                <Typography variant="body1">PLAYLIST</Typography>
                                </div>
                                {editMode ? 
                                <div style={{display:'flex'}}>
                                <Input 
                                style={{width:'calc(80%)', fontSize:'2.125rem'}}
                                label="Playlist Name" 
                                value={name} 
                                onChange={(ev)=>this.setState({name:ev.target.value})} 
                                placeholder={name}/> 
                                <IconButton onClick={()=>this.setState({editMode:false})}>
                                <CheckIcon fontSize='small'/>
                                </IconButton>
                                </div>
                            
                            : 
                                <div style={{display:'flex'}}>
                                <Typography variant="h4">{name}</Typography>
                                <IconButton onClick={()=>this.setState({editMode:true})}>
                                <EditIcon fontSize='small'/>
                                </IconButton>
                                </div>
                            }
                                <div>
                                <Typography variant="body1">{playlistDetails.count} songs</Typography>
                                </div>
                                <div>
                                <Typography variant="body1">{Math.floor(playlistDetails.duration/60000)} minutes</Typography>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        {playlistTracks.map((track) => {
                            return <PlaylistCard track={track}/>
                        })}
                    </div>
                :''}
          {playlistTracks.length ?
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
              onClick={this.restart}
              startIcon={<ExitToAppIcon />}
              >
                  Start Over
              </Button>
              <Button
                  style={{margin:10}}
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.predict}
              >
                  Regenerate
              </Button>
              <Button
                  style={{margin:10}}
                  variant="contained"
                  color='primary'
                  onClick={this.submit}
                  startIcon={<PlaylistAddCheckIcon />}
              >
                  Save Playlist
              </Button>
          </Paper>
          :''}
        </div>
    }
      </div>
    )
    }
  }
  


const mapDispatchToProps = (dispatch)=> {
    return {
      loadPlaylistTracks: (label)=> {
        dispatch(loadPlaylistTracks(label))
        console.log('load playlist tracks');
      },
      savePlaylist: (playlistTracks)=> {
        dispatch(savePlaylist(playlistTracks))
        console.log('save playlist');
      },
      reset: ()=> {
        dispatch(resetPlaylistTracks())
        console.log('reset');
      }
    };
  };

const mapStateToProps = ({playlistTracks, user}) => {
    return {playlistTracks,user}
}

export default connect(mapStateToProps,mapDispatchToProps)(MyPlaylists)