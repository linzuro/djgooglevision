
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node')
const path = require('path')
const request = require('request'); 
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const db = require('./db');
const app = express();
const { User } = db.models
const jwt = require('jwt-simple')
const {addUser,getUser, addTrack} = db
const axios = require('axios')
const LZString = require('lz-string')
const client_id = process.env.client_id || require('./client.js').client_id
const client_secret = process.env.client_secret || require('./client.js').client_secret
const redirect_uri = process.env.redirect_uri || require('./client.js').redirect_uri
const private_key= process.env.private_key || require('./googleKey.json').private_key
const client_email= process.env.client_email || require('./googleKey.json').client_email


const port = process.env.PORT || 8888;

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});

const getCriteria=(label)=>{
switch(label){
  case "party": 
    return {
      limit:25,
      min_danceability:0.5,
      max_danceability:1,
      min_energy:0.5,
      max_engery:1,
      min_valence:0.5,
      max_valence:1,
      min_instrumentalness:0.5,
      max_instrumentalness:1,
    }
  case "activity": 
    return {
      limit:25,
      min_danceability:0.5,
      max_danceability:1,
      min_energy:0.5,
      max_engery:1,
      mix_valence:.5,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:.5,
    }
  case "relax": 
    return  {
      limit:25,
      min_danceability:0,
      max_danceability:0.5,
      min_energy:0,
      max_engery:.5,
      mix_valence:0,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:1,
    }
  case "work": 
    return {
      limit:25,
      min_danceability:0,
      max_danceability:.5,
      min_energy:0,
      max_engery:.5,
      mix_valence:0,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:.5,
    }
  default: 
    return  {
      limit:25,
    }
}
}
 
const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.use(express.json())

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../index.html"))
});
  
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login/spotify',(req,res,next)=>{
    const state = generateRandomString(16);

    res.cookie(stateKey, state);

    const scopes = [
        'user-read-private', 
        'user-read-email',
        'app-remote-control',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-recently-played',
        'user-library-read',
        'streaming',
        'app-remote-control',
        'user-top-read',
        'playlist-modify-public',
        'playlist-modify-private',
        'ugc-image-upload'
    ];

    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    res.redirect(authorizeURL)
})

app.get('/logout',(req,res,next)=>{
  spotifyApi.resetAccessToken()
  spotifyApi.resetRefreshToken()
})

app.get('/callback',(req,res,next)=>{
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    
    spotifyApi.authorizationCodeGrant(code)
      .then(data=>{
          const authKey = data.body['access_token']
          const refKey = data.body['refresh_token']

          console.log("access token retrieved")
          console.log(authKey)

          spotifyApi.setAccessToken(authKey);
          spotifyApi.setRefreshToken(refKey);
  
          return {authKey,refKey}
        })
      .then(data=>addUser(data))
      .then(token=>res.redirect(`/#token/${token}`))
      .catch(err=>{
          console.log('Something went wrong!', err);
        })
})

app.post('/login',async(req,res,next)=>{
    const token = req.body.token

    //decode user and get auth/refresh token
    const user = await getUser(token)

    //set auth and refresh tokens
    try{
    await spotifyApi.setAccessToken(user.authKey)
    // const data = await spotifyApi.refreshAccessToken()
    //const authKey = data.body['access_token']
    //     const refKey = data.body['refresh_token']
    //     spotifyApi.setAccessToken(authKey)
    }catch(er){
      console.log(er)
    }

})

app.get('/api/user',(req,res,next)=>{
    spotifyApi.getMe()
      .then(result=>res.send(result.body))
      .catch(er=>console.log(er))
})

app.post('/api/makePlaylist',async(req,res,next)=>{
  const {label} = req.body
  try{
    const tracks = (await spotifyApi.getMyTopTracks({limit:5}))
                  .body.items.map(track=>{
                    return track.id
                  })

    const criteria = getCriteria(label)
    const recommended = await spotifyApi.getRecommendations({...criteria,seed_tracks:tracks})
    res.send(recommended.body)
    }catch(er){
      console.log(er)
    }
})
app.post('/api/createPlaylist',async(req,res,next)=>{
  const {name,userId} = req.body
  try{
      const data = await spotifyApi.createPlaylist(userId,name,{public:false})
      res.send(data.body)
    }catch(er){
      console.log(er)
    }
})
app.post('/api/addPlaylistTracks',async(req,res,next)=>{
  const {tracks,playlistId} = req.body
  try{
      const data = await spotifyApi.addTracksToPlaylist(playlistId,tracks)
      res.send(data.body)
    }catch(er){
      console.log('add tracks', er)
    }
})
app.post('/api/updatePlaylistImage',async(req,res,next)=>{
  const {playlistId,dataURL} = req.body
  const URL = `https://api.spotify.com/v1/playlists/${playlistId}/images`
  const authKey = spotifyApi.getAccessToken()
  const headers = {headers:{
      "Content-Type": 'image/jpeg',
      "Authorization": `Bearer ${authKey}`
  }}
    try{
      const data = (await axios.put(URL,dataURL,headers))
      res.sendStatus(data.status)
    }
    catch(er){
      console.log('update image',er)
    }
})
app.get('/auth/service/',(req,res,next)=>{
  const { GoogleToken } = require('gtoken');
    const gtoken = new GoogleToken({
      keyFile: 'google-credentials.json',
      scope: ['https://www.googleapis.com/auth/cloud-platform'] // or space-delimited string of scopes
    });
    gtoken.getToken((err, tokens) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(tokens.access_token)
    })
  // }
  
})


db.sync()
  .then(()=> {
    const server=app.listen(port, ()=> console.log(`listening on port ${port}`));
  });