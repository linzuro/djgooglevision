import React, {Component} from 'react';
import { connect } from 'react-redux';
import FilePicker from './FilePicker'

const Home =({user})=>{
return <FilePicker />
}


const mapStateToProps = ({user}) => {
    return {user}
}

export default connect(mapStateToProps)(Home)