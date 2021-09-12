import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {LISTING_ROUTE, requestListingLink} from "../consts";
import {useSelector} from "react-redux";
import {useStateCallback} from "../functions";

const ActiveListings = () => {
    const listings = useSelector(state=> state.listingsReducer)
    const [isActive, setActive] = useStateCallback(false)
    const history = useHistory()
    useEffect(()=>{
        document.addEventListener('scroll', ()=>{setActive(true)})
        return function () {
            document.removeEventListener('scroll', ()=>{
                setActive(true)
            })
        }
    })
    return (
        <div className={'main-activeListings'}>
            <h1 style={{marginLeft: '10vw', cursor: 'pointer'}} onClick={()=>{
                setActive(true, ()=>{
                    window.scrollTo({
                        top: window.innerHeight-170,
                        behavior: "smooth"
                    });
                })
                window.scrollTo({
                    top: window.innerHeight-170,
                    behavior: "smooth"
                });
            }}>ACTIVE LISTINGS</h1>
            {(isActive) && <><div className={'main-activeListings-list'}>
                {listings.filter((item)=>!item.assignedContractor)
                    .filter((item=>(Date.now()/1000).toFixed(0) < item.auctionEnd))
                    .map(item => {
                    return (
                        <div key={item._id} className="main-activeListings-list-item">
                            <img src={item.logoURL} alt="logo"/>
                            <div className={'main-activeListings-list-item__title'}>{item.name}</div>
                            <div className={'main-activeListings-list-item__info'}>
                                <span>{item.contractCount} Contracts</span>
                                <span> | </span>
                                <span>{(item.linesCount.toString().length >= 4) ?
                                    ((item.linesCount / 1000).toFixed(1) + 'k') :item.linesCount
                                } Lines</span>
                            </div>
                            <button className={'main-activeListings-list-item__button'} onClick={() => {
                                history.push(`/${LISTING_ROUTE}/${item._id}`)
                            }}>View Details
                            </button>
                        </div>
                    )
                })}
            </div>
                <a href={requestListingLink} target={'_blank'} rel="noreferrer" className={'main-activeListings-button'}>Request Listing</a>
                </>
            }
        </div>
    );
};

export default ActiveListings;