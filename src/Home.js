import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Typography} from '@material-ui/core'

const Home =({user})=>{
return <div style={{margin:20, display:'flex', justifyContent:'center'}}><Typography>
    Welcome {user.display_name}
</Typography>
</div>
}


const mapStateToProps = ({user}) => {
    return {user}
}

export default connect(mapStateToProps)(Home)