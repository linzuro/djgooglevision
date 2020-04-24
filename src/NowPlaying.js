import React, {Component} from 'react';
import TrackCardSearch from './TrackCardSearch.js'
import NowPlayingCard from './NowPlayingCard.js'
import Search from './Search.js'
import {connect} from 'react-redux'
import {loadNowPlaying} from './store.js'


const NowPlaying =()=>{
    return (
        <div>
        <NowPlayingCard />
        <Search />
        <TrackCardSearch/>
        </div>
    );
};

export default NowPlaying