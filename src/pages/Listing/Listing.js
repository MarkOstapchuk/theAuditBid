import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BounceLoader} from 'react-spinners'
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL, userId} from "../../consts";
import './listing.css'
import {secondsToDhms, useStateCallback} from "../../functions";
import HireModal from "../../components/Modals/HireModal/HireModal";
import Bids from "../../components/Bids";
import BidsInactive from "../../components/BidsInactive";
import '@fortawesome/fontawesome-free/css/all.css'

const ListingComp = (props) => {
    const [listing, setListing] = useState({})
    const [loader, setLoader] = useState(true)
    const [isHireModalActive, setIsHireModalActive] = useState(false)
    const [user, setUser] = useState({})
    const [isBidsActive, setBidsActive] = useStateCallback(false)
    const own_bid = useSelector(state => state.bidsReducer.ownBid)
    const bids_ = useSelector(state => state.bidsReducer.bids)
    const [isListingEnded, setListingEnded] = useState(false)
    const dispatch = useDispatch()
    const id = props.match.params.id
    useEffect(()=>{
        const dateNow = (Date.now()/1000).toFixed(0)
        if (dateNow > listing.auctionEnd) setListingEnded(true)
        if (listing.assignedContractor) setListingEnded(true)
    }, [setListingEnded, listing])

    useEffect(()=>{
        document.addEventListener('scroll', ()=>{setBidsActive(true)})
        return function () {
            document.removeEventListener('scroll', ()=>{
                setBidsActive(true)
            })
        }
    })
    console.log(listing)

    useEffect(() => {
        async function fetchListing() {
            await axios.get(`${SERVER_URL}/listings/${id}`).then(data => setListing(data.data))
            await axios.get(`${SERVER_URL}/bids/${id}`, {
                headers: {
                    'auth-token': localStorage.token
                }
            }).then(data => {
                if (data.data.userBid) {
                dispatch({type: 'ADD_OWN_BID', payload:
                        {name: data.data.user.name,
                            profilePictureURL: data.data.profilePictureURL,
                            ...data.data.userBid,}})
            } else {
                    dispatch({type: 'ADD_OWN_BID', payload: {}})
                }
                dispatch({type: 'ADD_MANY_BIDS', payload: [...data.data.bids]})})

            setLoader(false)
        }
        fetchListing()
    }, [id, setListing, dispatch])



    function isEmpty(obj) {
        for (let key in obj)
        {
            return false;
        }
        return true;
    }
    function setActive() {
        setIsHireModalActive(prevState => !prevState)
    }
    function setUserHired() {
        setUser(prevState => {return {...prevState, isHired: true}})
    }
    if (loader) {
        return <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <BounceLoader color={'#fff'}/></div>
    }
    return (
        <>
            {(isHireModalActive) && <HireModal setUserHired={setUserHired} user={user} setActive={setActive}/>}
            {(isListingEnded) && ((own_bid._id) ? (listing.assignedContractor === localStorage[userId]) ?
                <div className={'listing_lucky'}>Congratulations! You were selected to do the audit. Please contact the protocol via one of the
                    available contact methods.</div> :
                <div className={'listing_unlucky'}>Unfortunately auction is now closed and you were not selected for the job.
                    Don’t worry though - just check new listings on the main page.</div> :
                (!isEmpty(bids_) && Object.keys(bids_[0]).length > 2) ?
                    // maker
                    <div className={'listing_unlucky'}>Auction is now closed. Please go to the main page to see new listings.</div> :
                    // nothing
                    <div className={'listing_unlucky'}>Auction is now closed. Please go to the main page to see new listings</div>)}
            <div className={'listing'}>
                <div className="listing-item">
                    <img src={listing.logoURL} className={'listing-item__logo'} alt=""/>
                    <div className="listing-item__shortInfo">
                        <div className={'listing-item__name'}>{listing.name}</div>
                        <div className={'listing-item__info'}>
                            <span>{listing.contractCount} Contracts</span>
                            <span> | </span>
                            <span>{(listing.linesCount.toString().length >= 4) ?
                                ((listing.linesCount / 1000).toFixed(1) + 'k') :listing.linesCount
                            } Lines</span>
                        </div>
                    </div>
                    <div className="listing-item__socials">
                        {(listing.twitterURL) &&
                        <a target={'_blank'} rel="noreferrer" href={listing.twitterURL} className={'mr20'}>
                            <i  className="fab fa-twitter fab_socials"/>
                        </a>}
                        {(listing.telegramURL) &&
                        <a target={'_blank'} rel="noreferrer" className={'mr20'} href={listing.telegramURL}>
                            <i  className="fab fa-telegram fab_socials"/>
                        </a>}
                        {(listing.discordURL) &&
                        <a target={'_blank'} rel="noreferrer" className={'mr20'} href={listing.discordURL}>
                            <i  className="fab fa-discord fab_socials"/>
                        </a>}
                        {(listing.githubURL) && <a target={'_blank'} rel="noreferrer" href={listing.githubURL}>
                            <i  className="fab fa-github fab_socials"/>
                        </a>}
                    </div>
                </div>
                <div className="listing-description">{listing.description}</div>
                <div className={'listing-info'}>
                    <span>Language: {listing.language}</span>
                    <span>Time range: {listing.maxDuration}</span>
                    <span>Action end in: {secondsToDhms(listing.auctionEnd)}</span>
                </div>
                {<h1 className={'listing-bids-title'} onClick={()=>{
                    setBidsActive(true, ()=>{
                        window.scrollTo({
                            top: window.innerHeight-100,
                            behavior: "smooth"
                        });
                        return
                    })
                    window.scrollTo({
                        top: window.innerHeight-100,
                        behavior: "smooth"
                    });
                }}>BIDS</h1>}
                {  ((isBidsActive) && (!isListingEnded) ? <Bids listerId={listing.listerId}/> : <BidsInactive listingId={listing._id} listing={listing.assignedContractor}/>) }
            </div>
        </>
    );
};
const Listing = React.memo(ListingComp)
export default Listing