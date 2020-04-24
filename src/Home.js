import React, {Component} from 'react';
import { connect } from 'react-redux';

const Home =({user})=>{
return <ul>{Object.keys(user).map(item=>{
    return <li> {`${item}: ${user[item]}`}</li>
})}</ul>
}


const mapStateToProps = ({user}) => {
    return {user}
}

export default connect(mapStateToProps)(Home)