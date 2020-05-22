
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
const { setUp } = require('./socketHelper');
const axios = require('axios')
const LZString = require('lz-string')
const client_id = process.env.client_id || require('./client.js').client_id
const client_secret = process.env.client_secret || require('./client.js').client_secret
const redirect_uri = process.env.redirect_uri || require('./client.js').redirect_uri

const port = process.env.PORT || 8888;

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});

spotifyApi.play=async(track)=>{
const URL = 'https://api.spotify.com/v1/me/player/play'
const authKey = spotifyApi.getAccessToken()
const headers = {headers:{
    "Accept": 'application/json',
    "Content-Type": 'application/json',
    "Authorization": `Bearer ${authKey}`
}}
  try{
    const data = (await axios.put(URL,track,headers))
    return data
  }
  catch(er){
    console.log(er.message)
  }
}

spotifyApi.addToQueue=async(trackId)=>{
const URL = `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`
console.log(URL)
const authKey = spotifyApi.getAccessToken()
const headers = {headers:{
    "Accept": 'application/json',
    "Content-Type": 'application/json',
    "Authorization": `Bearer ${authKey}`
   }}  

  try{
    const data = (await axios.post(URL,null,headers))
    return data
  }
  catch(er){
    console.log(er.message)
  }
}

const getCriteria=(label)=>{
switch(label){
  case "party": 
    return {
      limit:25,
      min_danceability:0.5,
      max_danceability:1,
      min_energy:0.5,
      max_engery:1,
      mix_valence:0.5,
      max_valence:1,
      min_instrumentalness:0.5,
      max_instrumentalness:1,
      min_tempo:0.5,
      max_temp0:1
    }
  case "activity": 
    return {
      limit:25,
      min_danceability:0.5,
      max_danceability:1,
      min_energy:0.5,
      max_engery:1,
      mix_valence:0,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:1,
      min_tempo:0,
      max_temp0:1
    }
  case "relax": 
    return  {
      limit:25,
      min_danceability:0,
      max_danceability:0.5,
      min_energy:0,
      max_engery:1,
      mix_valence:0,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:1,
      min_tempo:0,
      max_temp0:1
    }
  case "work": 
    return {
      limit:25,
      min_danceability:0,
      max_danceability:1,
      min_energy:0,
      max_engery:1,
      mix_valence:0,
      max_valence:1,
      min_instrumentalness:0,
      max_instrumentalness:1,
      min_tempo:0,
      max_temp0:1
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

app.post('/login',(req,res,next)=>{
    const token = req.body.token

    //decode user and get auth/refresh token
    const user = getUser(token)

    //set auth and refresh tokens
    //console.log(spotifyApi.setAccessToken(user.authKey))
    //spotifyApi.setAccessToken(user.authKey)
        // .then(_=>console.log('auth token is good'))
        // .catch(er=>console.log(`auth error: ${er.message}`));
    // spotifyApi.refreshAccessToken()
    //    .then(data=>{
    //     const authKey = data.body['access_token']
    //     const refKey = data.body['refresh_token']
    //     spotifyApi.setAccessToken(authKey)

    //     //insert update user auth and ref key here
    //     console.log('ref token is good')
    //   })
       
    //    .catch(er=>console.log(console.log(`ref error: ${er.message}`)));

      // spotifyApi.getUser()
      //   .then(user=>console.log(user))
      //   .catch(er=>console.log(er.message))
      //   .then(_=>{
      //     console.log('user is logged in')
      //     res.send(token)
      //   })
})


app.get('/api/albums',(req,res,next)=>{
    spotifyApi.getMySavedAlbums({limit:30})
      .then(result=>res.send(result.body.items))
      .catch(er=>console.log(er));
})

app.get('/api/nowplaying',(req,res,next)=>{
    spotifyApi.getMyCurrentPlaybackState({})
      .then(result=>{res.send(result.body)})
      .catch(er=>console.log(er));
})
app.get('/api/recentlyplayed',(req,res,next)=>{
    spotifyApi.getMyRecentlyPlayedTracks()
      .then(result=>res.send(result.body.items))
      .catch(er=>console.log(er))
})

app.get('/api/album/:id',(req,res,next)=>{
    spotifyApi.getAlbumTracks(req.params.id, { limit : 50, offset : 1 })
      .then(result=>res.send(result.body.items))
      .catch(er=>console.log(er));
})

app.get('/api/user',(req,res,next)=>{
    spotifyApi.getMe()
      .then(result=>res.send(result.body))
      .catch(er=>console.log(er))
})

app.get('/api/playlists',(req,res,next)=>{
    spotifyApi.getUserPlaylists()
      .then(result=>res.send(result.body.items))
      .catch(er=>console.log(er))
})

app.post('/api/playToAll',(req,res,next)=>{
  const track = req.body
  addTrack(track)
  res.send(track)
})

app.post('/api/play',async(req,res,next)=>{
    const device = (await spotifyApi.getMyCurrentPlaybackState({})).body.device.id
    if(!device){
      const device = (await spotifyApi.getMyDevices()).body.devices[0].id
    }
    //add device if not listed
    const track = req.body
    const tracks = await spotifyApi.getAlbumTracks(track.album)
    const idx = tracks.body.items.findIndex(item=>item.id===track.track)
    const payload = {
      "context_uri": `spotify:album:${track.album}`,
      "offset": {
        "position": idx
      },
      "position_ms": 0
    }
    const status= (await spotifyApi.play(payload)).status
    console.log(status)
    //if 404 then active device not found
    //if 204 then success
    //if 403 then non premium function
    //console.log(status) 
    //const ret =await spotifyApi.getMyCurrentPlaybackState({})
    res.sendStatus(status)
})

app.post('/api/search',async(req,res,next)=>{
  const search = req.body.track
  const data = await spotifyApi.searchTracks(search)
  res.send(data)
})

app.post('/api/addTrackToAllQueue',(req,res,next)=>{
  const track = req.body
  const response = addTrack(track)
  res.send(response)
})

app.post('/api/addTrackToQueue',async(req,res,next)=>{
  const track = req.body.track
  const status= (await spotifyApi.addToQueue(track)).status
  console.log(status)
  res.send(track)
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
  // const decompressed = LZString.decompressFromEncodedURIComponent(dataURL)
  // const compressed = await LZString.compressToBase64(dataURL)
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
  // if(process.env.key && process.env.email){
    const gtoken = new GoogleToken({
      email: 'spotify-playlist@charged-camera-277800.iam.gserviceaccount.com',
      scope: ['https://www.googleapis.com/auth/cloud-platform'], // or space-delimited string of scopes
      key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD86XOjdrrymnpF\nSDQ6fnuMnVBcTEc8DBfgqXfALLUKsR+isV9jNZ+f4h/RKDccBw28ZWr2jEmWlZtb\naw3Ux0k9bdFKcXEiQwlB+1JcimBcwz7yNNnheqGbEL09GjuHL5+EEUfUFmgt4YrN\nvMdulk6KbJWBtkGReau6xBQSKuxEYlzTVBhGI9MEPRlMabxtkzRu3faJv7Uc84FD\n1/RyLZzq0NFC7LNICyb5aifAs2jzSo1fqpTrje6hL9+QyySwgpygzuSd0sK3zUG1\nD3H4F5FAved1oHv7fSUZfj/ck9HnSzoH4Vir5PmUEqcZ/Ec0IUeRyUWVshoaTXxh\nnW04mkzNAgMBAAECggEANEF0EDFG/TtnygraJ7/cfTg/02I7Ua/Z+yRoxr82BOiF\n9dKaN+Brg9hv5IJfqJ3Ye7WkvR5NUhzFRcU/zVgDzPp0xOHdk0uwjP6FjPNWZ7Q7\nvEWpQwpYe7agsxBJfmwblGkRo0Oh8ODqEgpQVowd3EIFPhDPSWSPU/6RexN9T79t\n8hgFgCnG6+wWkUiTo1Vcn5jPfl5Dkkx68IlZkykLRiCrz3l2ekX9psimtpNFO5cT\ne92g0v/I6g1DSE3maIG9lRBmn6D9uS09jBWPJXKnusngzZkmCyMBs1vI7L01wJ5X\nOHlyDjeNKKULX8IBkoHEOVaFg03SUvu0pRADoziEAQKBgQD/m0dLwWymgEs0ek54\nXHMN4UVXAxZlQvTzciPzxnmUQ3j5s3twRN5v4iiDRtGBM/VqO2mx2NNIFrEEBI+z\nHJ257IqPvwAHp0AfUeg5dL29V29fLOTMy8EGznkgsnY336lHCZ2gfrIqupN/Z4LP\nl/H/AV6bgq0ZNWuBD26ZptJZzQKBgQD9TRyEXxG/ro7M9HSFPGtWuagklHK2vmkB\nsOCsoDwbkywFKGIU3nOElFlD2HeaXp/2ylFSYI09tnxC3/FIWx4vxFFriZ+HIMEJ\nB2I4eaMfCJpVGQkNdokANRlrwoeTrkiClZdAxoemJGpgpPf+7SHAjj9RFtUHOyrG\nbX0tO+i/AQKBgQCcg7aaeqxPIAvs7F+Ub/e7rg9Jgoh6JQ/c6i19njDgSpiPPgn9\n6w3RsMhh6kFrPieujwbfcgeeAtcNwMVFReaG7ILEFo6sIQuwofTzCbsNb7awrsrD\nZJij1FZzYRPmjrwW1ZqBplLuuySKRRXijAYQwgPucYwQ/ZcAhjSRPYdcmQKBgHub\nXpgmAHZGi37up9HAyyyWCrxXCKeuwXVGyEzVIJ/gMLIPo9VFPJ/s+KaIAs188Ziv\n4AFQBnygCYFk4MyLUm7C4WyVyxhY3no2dTLUAMsLGqz+O5GrT22fe9k/I4Pon4/B\nyf6dIuLrkFG7Dx4Cv97ES5eZibkuoVAVa+lf+9MBAoGAJpV4FYhwn8RdEPGo9UIZ\nS+qSdk/QuGjes90oqs6plaE+jUteJOU5jah7XPDefoRAUFye6ReBq9zObJszTpca\nu2cXv4qLKwbZgsQvk+rtMwLbuQ91z7VWCft5JzybXGbcWJVIt7BP+7vAwqYFVGvz\n6Dd5vcYsRbM9NvuX5uW1Pw8=\n-----END PRIVATE KEY-----\n'
    });
    gtoken.getToken((err, tokens) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(tokens.access_token)
    })
  // }else{
  //   const gtoken = new GoogleToken({
  //     keyFile: './googleKey.json',
  //     scope: ['https://www.googleapis.com/auth/cloud-platform'] // or space-delimited string of scopes
  //   });
  //   gtoken.getToken((err, tokens) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     res.send(tokens.access_token)
  //   })
  // }
  
})


db.sync()
  .then(()=> {
    const server=app.listen(port, ()=> console.log(`listening on port ${port}`));
    setUp(server)
  });