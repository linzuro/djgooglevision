import React, {Component} from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route,Link, useHistory } from 'react-router-dom';
import {loadRecentlyPlayed} from './store.js'


class Recent extends Component {
    componentDidMount() {
       this.props.loadRecent()
      }
      render() {
        const {recentlyPlayed} = this.props
        return (<ul>
                    {recentlyPlayed.map((item,idx)=>{
                                return <li key={idx}>{item.track.name}</li>
                            })}
                </ul>);
      }
}

const mapDispatchToProps = (dispatch)=> {
    return {
      loadRecent: ()=> {
        dispatch(loadRecentlyPlayed())
        console.log('load recently played data');
      }
    };
  };

const mapStateToProps = ({recentlyPlayed}) => {
    return {recentlyPlayed}
}

export default connect(mapStateToProps,mapDispatchToProps)(Recent)