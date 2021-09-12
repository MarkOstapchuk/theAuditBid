import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {NOLOGO, SERVER_URL, USER_ROUTE, userId} from "../consts";
import {useHistory, useLocation} from 'react-router-dom'
import axios from "axios";

const Bids = (props) => {
    const [sort, setSort] = useState('Cheapest')
    const [noteMessage, setNoteMessage] = useState('')
    const [placeBidInputDays, setPlaceBidInputDays] = useState(null)
    const [placeBidInputPrice, setPlaceBidInputPrice] = useState(null)
    const [placeBidTextarea, setPlaceBidTextarea] = useState('')
    const [isPlaceBidActive, setPlaceBidActive] = useState(false)
    const [placeBidError, setPlaceBidError] = useState({})
    const [isOwnBidEditing,setOwnBidEditing] = useState(false)
    const [placeBidPopupConfirm, setPlaceBidPopupConfirm] = useState(false)
    const [ownBidPriceEdit,setOwnBidPriceEdit] = useState(null)
    const [ownBidDaysEdit,setOwnBidDaysEdit] = useState(null)
    const [ownBidNoteEdit,setOwnBidNoteEdit] = useState(null)
    const [hirePopup, setHirePopup] = useState({})
    const bids = useSelector(state => state.bidsReducer.bids)
    const own_bid = useSelector(state => state.bidsReducer.ownBid)
    const full_bids = (own_bid._id) ? [...bids, own_bid] : [...bids]
    console.log(full_bids)
    const history = useHistory()
    const location = useLocation()
    const listingId = location.pathname.split('/')[2]
    const prices = full_bids.map((item, index) => {
        return {index, price: item.price}
    }).sort(function (a, b) {
        return a.price - b.price
    })

    const days = full_bids.map((item, index) => {
        return {index, days: item.daysCount}
    }).sort(function (a, b) {
        return a.days - b.days
    })
    if (noteMessage || isPlaceBidActive || hirePopup.id) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    function isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
    useEffect(()=>{
        if (ownBidDaysEdit === null && ownBidPriceEdit === null) {
            setOwnBidDaysEdit(own_bid.daysCount)
            setOwnBidPriceEdit(own_bid.price)
            setOwnBidNoteEdit(own_bid.note)
        }
    })
    const editOwnBid = async ()=>{
        if (ownBidPriceEdit === 0 || ownBidDaysEdit === 0) {
            return
        }
        await axios.patch(`${SERVER_URL}/bids/${own_bid._id}`, {
            price:ownBidPriceEdit,
            daysCount: ownBidDaysEdit,
            note: ownBidNoteEdit

        }, {
            headers: {
                'auth-token':localStorage.token
            }
        }).then(()=>{
            setOwnBidEditing(prev=>!prev)
            history.go(0)
        })
    }

    const placeBid = () => {
        if (placeBidInputDays == 0) {
        setPlaceBidError({type: 'days', message: 'The field can\'t be empty'})
        setTimeout(()=>{setPlaceBidError({})}, 3000)
        return
    }
        if (!isNumeric(placeBidInputDays)) {
            setPlaceBidError({type: 'days', message: 'The field must contain only a number'})
            setTimeout(()=>{setPlaceBidError({})}, 4000)
            return
        }
        if (placeBidInputPrice == 0) {
            setPlaceBidError({type: 'price', message: 'The field can\'t be empty'})
            setTimeout(()=>{setPlaceBidError({})}, 4000)
            return
        }
        if (!isNumeric(placeBidInputPrice)) {
            setPlaceBidError({type: 'price', message: 'The field must contain only a number'})
            setTimeout(()=>{setPlaceBidError({})}, 4000)
            return
        }

        if (placeBidTextarea.length > 210) {
            setPlaceBidError({type: 'note', message: 'The field must contain no more than 210 symbols'})
            setTimeout(()=>{setPlaceBidError({})}, 4000)
            return
        }
        setPlaceBidActive(false)
        setPlaceBidPopupConfirm(prev => !prev)

    }
    const placeBidOnServer = () => {
        axios.post(`${SERVER_URL}/bids`, {
            listingId: listingId,
            daysCount: placeBidInputDays,
            price: placeBidInputPrice,
            note: placeBidTextarea
        }, {
            headers: {
                'auth-token': localStorage.token
            }
        }).then(data=>{
            history.go(0)

        })
    }
    const deleteBid = () => {

    }
    const openHirePopup = (id, name) => {
        setHirePopup({id, name})
    }
    const hire = async (id) => {
        await axios.patch(`${SERVER_URL}/listings/${listingId}/hire`, {
            assignedContractor: id
        }, {
            headers: {
                'auth-token':localStorage.token
            }
        }).then(data=>history.go(0))
    }
    return (
        <>
            {/*NOTE MESSAGE POPUP*/}

            {(noteMessage) && <div className="NotePopup">
                <div className="notePopup-window">
                    <button onClick={() => {
                        setNoteMessage('')
                    }}>&#215;</button>
                    <div>{noteMessage}</div>
                </div>
            </div>}

            {(hirePopup.id) && <div className={'hirePopup'}>
                <div className="hirePopup-window">
                    <div onClick={()=>setHirePopup({})} className="hirePopup-window-closeBtn">&#215;</div>
                    <div className="hirePopup-window-text">
                        Are you sure you want to hire {hirePopup.name}?<br/>
                        This will close the action and notify all participants.
                    </div>
                    <div className="hirePopup-window-btns">
                        <button onClick={()=>{hire(hirePopup.id)}} className="hirePopup-window-hireBtn">Hire</button>
                        <button onClick={()=>setHirePopup({})} className="hirePopup-window-backBtn">Back</button>
                    </div>

                </div>
            </div>}
            {/*PLACE BID POPUP*/}


            {(isPlaceBidActive) && <div className="placeBidPopup">
                <div className="placeBidPopup-window">
                    <button className="placeBidPopup-window-closeBtn" onClick={()=>setPlaceBidActive(prev => !prev)}>&#215;</button>
                    <div className="container">
                        <div className="placeBidPopup-window-warning">
                            Please enter the total duration it would take you to complete audit as well as how much you
                            would like to charge in total
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="">Duration:</label>
                            <div className="btns">
                                <button className={'icon-minus'} onClick={()=>setPlaceBidInputDays(prev=>(prev>0)?(prev-1):prev)}/>
                                <input onChange={(e) => setPlaceBidInputDays(e.target.value)} value={(placeBidInputDays!==null)?placeBidInputDays: ''}
                                       placeholder={'Days'} type="text" id={'placeBidPopup-window-input__days'}/>
                                <button className={'icon-plus'} onClick={()=>setPlaceBidInputDays(prev=>+prev+1)}/>
                                {(placeBidError.type === 'days' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                            </div>
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="">Price:</label>
                            <div className="btns">
                                <button className={'icon-minus'} onClick={()=>setPlaceBidInputPrice(prev=>(prev>499)?(+prev-500):prev)}/>
                                <input onChange={(e) => setPlaceBidInputPrice(e.target.value)}
                                       placeholder={'Price'} value={(placeBidInputPrice!==null) ? placeBidInputPrice : ''} type="text" id={'placeBidPopup-window-input__price'}/>
                                <button className={'icon-plus'} onClick={()=>setPlaceBidInputPrice(prev=>+prev+500)}/>
                                {(placeBidError.type === 'price' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                            </div>
                        </div>
                        <div className="placeBidPopup-window-note">
                            <label htmlFor="placeBidPopup-window-note__input">Note:</label>
                            <textarea value={placeBidTextarea} onChange={(e)=>setPlaceBidTextarea(e.target.value)} name="" id="placeBidPopup-window-note__input"/>
                            {(!placeBidTextarea) && <div className="placeBidPopup-window-note__warning">Optional</div>}
                            {(placeBidError.type === 'note' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                        </div>
                        <button onClick={placeBid} className={'placeBidPopup-window-confirmBtn'}>Place Bid</button>
                    </div>
                </div>
            </div>}
            {(isOwnBidEditing) && <div className="placeBidPopup">
                <div className="placeBidPopup-window">
                    <button className="placeBidPopup-window-closeBtn" onClick={()=>setOwnBidEditing(prev => !prev)}>&#215;</button>
                    <div className="container">
                        <div className="placeBidPopup-window-warning">
                            Please enter the total duration it would take you to complete audit as well as how much you
                            would like to charge in total
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="">Duration:</label>
                            <div className="btns">
                                <button className={'icon-minus'} onClick={()=>setOwnBidDaysEdit(prev=>(prev>0)?(prev-1):prev)}/>
                                <input onChange={(e) => setOwnBidDaysEdit(e.target.value)} value={ownBidDaysEdit}
                                       placeholder={'Days'} type="text" id={'placeBidPopup-window-input__days'}/>
                                <button className={'icon-plus'} onClick={()=>setOwnBidDaysEdit(prev=>+prev+1)}/>
                                {(placeBidError.type === 'days' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                            </div>
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="">Price:</label>
                            <div className="btns">
                                <button className={'icon-minus'} onClick={()=>setOwnBidPriceEdit(prev=>(prev>0)?(prev-500):prev)}/>
                                <input onChange={(e) => setOwnBidPriceEdit(e.target.value)}
                                       placeholder={'Price'} value={ownBidPriceEdit} type="text" id={'placeBidPopup-window-input__price'}/>
                                <button className={'icon-plus'} onClick={()=>setOwnBidPriceEdit(prev=>prev+500)}/>
                                {(placeBidError.type === 'price' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                            </div>
                        </div>
                        <div className="placeBidPopup-window-note">
                            <label htmlFor="placeBidPopup-window-note__input">Note:</label>
                            <textarea value={ownBidNoteEdit} onChange={(e)=>setOwnBidNoteEdit(e.target.value)} name="" id="placeBidPopup-window-note__input"/>
                            {(!placeBidTextarea) && <div className="placeBidPopup-window-note__warning">Optional</div>}
                            {(placeBidError.type === 'note' && <div className={'placeBidError'}>{placeBidError.message}</div>)}
                        </div>
                        <div className="placeBidPopup-window-btns">
                            <button onClick={deleteBid} className={'placeBidPopup-window-deleteBtn'}>Delete bid</button>
                        <button onClick={editOwnBid} className={'placeBidPopup-window-saveBtn'}>Save</button>
                        </div>
                    </div>
                </div>
            </div>}

            {/*PLACE BID POPUP CONFIRM*/}
            {(placeBidPopupConfirm)&&
            <div className={'placeBidConfirm'}>
                <div className={'placeBidConfirm-window'}>
                    <div className={'placeBidConfirm-window-text'}>Are you sure you would like to place a bid of ${placeBidInputPrice+ ' '}
                    and {(placeBidInputDays === 1) ? placeBidInputDays+' day' : placeBidInputDays+' days'} </div>
                    <div className={'placeBidConfirm-window-btns'}>
                <button className={'placeBidConfirm-window-place'} onClick={placeBidOnServer}>PLACE</button>
                <button className={'placeBidConfirm-window-back'} onClick={()=>setPlaceBidPopupConfirm(prev=>!prev)}>Back</button>
                    </div>
                </div>
            </div>}


            {/*OWN BID IF EXIST*/}
            {(bids.length === 0 && own_bid._id) && <div className={'listing_bids_ownBid'}>
                <img className={'listing-bids-item__img'} src={(own_bid.profilePictureURL) || NOLOGO} alt="logo"/>
                <div className={'listing_bids_ownBid__1'}>{own_bid.name}</div>
                <div className={'listing_bids_ownBid__2'}>${ownBidPriceEdit}</div>
                <div
                    className={'listing_bids_ownBid__3'}>{(+(ownBidDaysEdit / 7).toFixed(0) === ownBidDaysEdit / 7) ?
                    (ownBidDaysEdit / 7 === 1) ? ownBidDaysEdit / 7 + ' week' : ownBidDaysEdit / 7 + ' weeks' :
                    (ownBidDaysEdit === 1) ? ownBidDaysEdit + ' day' : ownBidDaysEdit + ' days'}</div>
                <button onClick={()=>setOwnBidEditing(prev=>!prev)} className={'listing_bids_ownBid__btn'}>Edit</button>
            </div>}
            {(bids.length!==0) ? <>
            {(own_bid._id) && <div className={'listing_bids_ownBid'}>
                <img className={'listing-bids-item__img'} src={(own_bid.profilePictureURL) || NOLOGO} alt="logo"/>
                <div className={'listing_bids_ownBid__1'}>{own_bid.name}</div>
                <div className={'listing_bids_ownBid__2'}>${ownBidPriceEdit}</div>
                <div
                    className={'listing_bids_ownBid__3'}>{(+(ownBidDaysEdit / 7).toFixed(0) === ownBidDaysEdit / 7) ?
                    (ownBidDaysEdit / 7 === 1) ? ownBidDaysEdit / 7 + ' week' : ownBidDaysEdit / 7 + ' weeks' :
                    (ownBidDaysEdit === 1) ? ownBidDaysEdit + ' day' : ownBidDaysEdit + ' days'}</div>
                <button onClick={()=>setOwnBidEditing(prev=>!prev)} className={'listing_bids_ownBid__btn'}>Edit</button>
            </div>}

            {/*SORT BUTTON*/}

            <button onClick={() => {
                if (sort === 'Cheapest') {
                    setSort('Fastest')
                } else {
                    setSort('Cheapest')
                }
            }} className={'listing_bids_sortBtn'}>
                Sort By:
                <div onClick={(e) => e.stopPropagation()}>{sort}</div>
            </button>


            {/*FOR LISTING MAKER */}

            {/*SORT CHEAPEST*/}

            {((Object.keys(bids[0]).length > 2) ? (sort === 'Cheapest') ? prices.map(item1 => {
                    const item = full_bids[item1.index]
                    return <div key={item1.index} className={'listing-bids'}>
                        <div className={'listing-bids-item'}>
                            <img src={item.biider.profilePictureURL || NOLOGO} alt={'logo'}
                                 className="listing-bids-item__img"/>
                            <div className="listing-bids-item__shortInfo">
                                <div className="listing-bids-item__name">{item.biider.name}</div>
                                <div className="listing-bids-item__socials">
                                    {(item.biider.twitterURL) &&
                                <a href={item.biider.twitterURL}>twitter</a>}
                                </div>
                            </div>
                            <div className={'listing-bids-item__price'}>${item.price}</div>
                            <div
                                className={'listing-bids-item__days'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                            {(item.note) && <button className="listing-bids-item__note"
                                                    onClick={() => setNoteMessage(item.note)}>Note</button>}
                            <button onClick={()=>{openHirePopup(item.bidderId, item.biider.name)}} className={'listing-bind-item__buttons'}>Hire</button>
                            <button className={'listing-bind-item__buttons'} onClick={() => {
                                history.push(`/${USER_ROUTE}/${item.bidderId}`)
                            }}>View
                            </button>
                        </div>
                    </div>
                })

                // SORT FASTEST
                :


                days.map(item1 => {
                    const item = full_bids[item1.index]
                    return <div key={item1.index} className={'listing-bids'}>
                        <div className={'listing-bids-item'}>
                            <img src={item.biider.profilePictureURL || NOLOGO} alt={'logo'}
                                 className="listing-bids-item__img"/>
                            <div className="listing-bids-item__shortInfo">
                                <div className="listing-bids-item__name">{item.biider.name}</div>
                                <div className="listing-bids-item__socials">{(item.biider.twitterURL) &&
                                <a href={item.biider.twitterURL}>twitter</a>}</div>
                            </div>
                            <div className={'listing-bids-item__price'}>${item.price}</div>
                            <div
                                className={'listing-bids-item__days'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                            {(item.note) && <button className="listing-bids-item__note"
                                                    onClick={() => setNoteMessage(item.note)}>Note</button>}
                            <button onClick={()=>{openHirePopup(item.bidderId, item.biider.name)}} className={'listing-bind-item__buttons'}>Hire</button>
                            <button className={'listing-bind-item__buttons'} onClick={() => {
                                history.push(`/${USER_ROUTE}/${item.bidderId}`)
                            }}>View
                            </button>
                        </div>
                    </div>
                })

                // FOR PLACER

                :

                // SORT CHEAPEST

                <div className={'Listing_bids_shortList_wrap'}>
                    {(sort === 'Cheapest')

                        ?


                        prices.map((item1, index) => {
                                const item = full_bids[item1.index]
                                return <div key={index} className={'Listing_bids_shortList'}>
                                    <div
                                        className={'Listing_bids_shortList__1'}>{(item.bidderId !== localStorage[userId] || localStorage[userId] === undefined) ? 'Bidder ' + (index + 1) : 'Me'}</div>
                                    <div className={'listing_bids_ownBid__2'}>${item.price}</div>
                                    <div
                                        className={'listing_bids_ownBid__3'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                        (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                        (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                                </div>
                            }
                        )

                        :
                        // SORT FASTEST


                        days.map((item1, index) => {
                                const item = full_bids[item1.index]
                                return <div key={index} className={'Listing_bids_shortList'}>
                                    <div
                                        className={'Listing_bids_shortList__1'}>{(item.bidderId !== localStorage[userId] || localStorage[userId] === undefined) ? 'Bidder ' + (index + 1) : 'Me'}</div>
                                    <div className={'listing_bids_ownBid__2'}>${item.price}</div>
                                    <div
                                        className={'listing_bids_ownBid__3'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                        (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                        (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                                </div>
                            }
                        )}


                    {/*PLACE BID BUTTON*/}


                    {(!own_bid._id && localStorage[userId] !== undefined) &&
                    <button onClick={() => setPlaceBidActive(prevState => !prevState)} className={'placeBGid'}>Place Bid</button>}
                </div>

                )}
                </> : <>
                {(!own_bid._id) && <div style={{textAlign: 'center'}}>Bids are not exist yet</div>}
                {(localStorage[userId] !== undefined && localStorage.token !== undefined && props.listerId !== localStorage[userId] && !own_bid._id) &&<button onClick={() => {
                    setPlaceBidActive(prevState => !prevState)
                }}  className={'placeBid'}>Place
                    Bid</button>}
                </>}
            </>
    );
};
const BidsComp = React.memo(Bids);
export default BidsComp