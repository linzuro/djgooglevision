import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Typography,Paper,Button} from '@material-ui/core'
import { Input } from '@material-ui/core';
import axios from 'axios'



const GOOGLE_APPLICATION_CREDENTIALS = 'ya29.c.Ko8Bywf5j9W6O8LiDVQGaQwOb1WxVEqOSTeqdTMqi_R3inOApgHyfEmUTX9jdqjzDkeuUBfMbMk3MrU9Vvsa2MBuc_p7aN1B8ks2_L9rJsA-LSwuTEYOykXSUhMEVHTzqCYHGSIccquKRK4BA-4sIiFftpcqm0lp6lwuZL-7O9xknkvuoJKOl7YChPxNpfLvjoM'
//  const GOOGLE_APPLICATION_CREDENTIALS = require('./googleKeyOfficial.json')

class FilePicker extends Component{
  constructor (){
    super()
    this.state={
      dataURL:'',
      label:''
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
        const edit = reader.result.slice(result.indexOf(','))
        console.log(edit)
        const dataURL = result.replace("data:image/jpeg;base64,", "")
        this.setState({dataURL})
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
      
    }
    catch(er){
      console.log(er)
    }
  }
  render(){
    return <div><form>
      <Input ref={ref=>this.el=ref} type='file'/>
    </form>
    <Button onClick={this.predict}>Predict</Button>
    <div>
    <Typography variant="h3">Label:{this.state.label}</Typography>
    </div>
    </div>
  }
}


export default (FilePicker)
