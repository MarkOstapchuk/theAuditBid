import React, {useEffect} from 'react';
import ActiveListings from "../../components/ActiveListings";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from "../../consts";
import './main.css'

const Main = () => {

    const dispatch = useDispatch()
    const listings = useSelector(state=> state.listingsReducer)
    useEffect( ()=>{
    async function fetchListings() {
        await axios.get(`${SERVER_URL}/listings`).then(
            data => dispatch({type:'ADD_MANY_LISTINGS', payload: data.data.reverse()}))
    }
    if (listings.length === 0) {
        fetchListings()
    }

}, [dispatch, listings])

    return (
        <main className={'main'}>
            <div className="main-titles">
                <h1 className={'main-title__1'}>List you’r smart contracts</h1>
                <h2 className={'main-title__2'}>Get audit bids from devs</h2>
                <h3 className={'main-title__3'}>Don’t get rekd</h3>
                <span className={'main-title__4'}>{'//'}hopefully</span>
            </div>
            <ActiveListings/>
        </main>
    );
};

export default Main;