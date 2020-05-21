const SpotifyWebApi =require('spotify-web-api-node')
const {client_id,client_secret,redirect_uri} =require('./client.js')
// import {client_id,client_secret,redirect_uri} from './client.js'

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

module.exports={spotifyApi}