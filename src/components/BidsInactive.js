import React, {useState} from 'react';
import {useSelector} from "react-redux";
import { NOLOGO, SERVER_URL, USER_ROUTE} from "../consts";
import {useHistory} from "react-router-dom";
import axios from "axios";
import Notification from "./Notification/Notification";
import '@fortawesome/fontawesome-free/css/all.css'

const BidsInactive = ({listing, listingId}) => {
    const history = useHistory()
    const [noteMessage, setNoteMessage] = useState('')
    const [isReviewPopupActive, setReviewPopupActive] = useState({})
    const [reviewPopupInput, setReviewPopupInput] = useState('')
    const [notification, setNotification] = useState({})
    const bids = useSelector(state => state.bidsReducer.bids)
    const prices = bids.map((item, index) => {
        return {index, price: item.price}
    }).sort(function (a, b) {
        return a.price - b.price
    })
    const [sort, setSort] = useState('Cheapest')
    const days = bids.map((item, index) => {
        return {index, days: item.daysCount}
    }).sort(function (a, b) {
        return a.days - b.days
    })

    const postReview = async(id) => {
        await axios.post(`${SERVER_URL}/user/${id}/review`, {
                listingId: listingId,
            review: reviewPopupInput
    }, {
            headers: {
                'auth-token': localStorage.token
            }
        }).then((data)=>{
            if (data.status === 200) {
                setReviewPopupActive('')
                setNotification({type: 'success',message: 'review posted'})
                setTimeout(()=>{setNotification({})},4000)
            }
        })
    }
        return (
            <>
                {(notification.message)&&<Notification type={notification.type}
                notificationOff={()=>{setNotification({})}}>{notification.message}</Notification>}
                {(isReviewPopupActive.id) && <div className="ReviewPopup">
                    <div className="reviewPopup-window">
                        <button className={'reviewPopup-window-closeBtn '} onClick={() => {
                            setReviewPopupActive('')
                        }}>&#215;</button>
                        <div>Review for {isReviewPopupActive.name}:</div>
                        <textarea style={{borderColor: '#33FF43'}} name="review-window-textarea" id="review-window-textarea" value={reviewPopupInput} onChange={(event => setReviewPopupInput(event.target.value))}/>
                        <button onClick={postReview.bind(null, isReviewPopupActive.id)} className={'reviewPopup-window-confirmBtn'}>Post</button>
                    </div>

                </div>}
                {(noteMessage) && <div className="NotePopup">
                <div className="notePopup-window">
                    <button onClick={() => {
                        setNoteMessage('')
                    }}>&#215;</button>
                    <div>{noteMessage}</div>
                </div>
            </div>}
                {(bids.length !== 0 && bids[0]._id) &&
                <div>
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
                    {(sort === 'Cheapest') ? prices.map(item1 => {
                            const item = bids[item1.index]
                            return <div key={item1.index} className={(listing === item.bidderId) ? 'listing-bids chosen' : 'listing-bids'}>
                                <div className={'listing-bids-item'}>
                                    <img src={item.biider.profilePictureURL || NOLOGO} alt={'logo'}
                                         className="listing-bids-item__img"/>
                                    <div className="listing-bids-item__shortInfo">
                                        <div className="listing-bids-item__name">{item.biider.name}</div>
                                        <div className="listing-bids-item__socials">
                                            {(item.biider.twitterURL) &&
                                            <a target={'_blank'} rel="noreferrer" href={item.biider.twitterURL} className={'mr5'}>
                                                <i className="fab fa-twitter listing-fab"/>
                                            </a>}
                                            {(item.biider.telegramURL) &&
                                            <a target={'_blank'} rel="noreferrer" className={'mr5'} href={item.biider.telegramURL}>
                                                <i className="fab fa-telegram listing-fab"/>
                                            </a>}
                                            {(item.biider.discordURL) &&
                                            <a target={'_blank'} rel="noreferrer" className={'mr5'} href={item.biider.discordURL}>
                                                <i className="fab fa-discord listing-fab"/>
                                            </a>}
                                            {(item.biider.githubURL) && <a target={'_blank'} rel="noreferrer" href={item.biider.githubURL}>
                                                <i className="fab fa-github listing-fab"/>
                                            </a>}
                                        </div>
                                    </div>
                                    <div className={'listing-bids-item__price'}>${item.price}</div>
                                    <div
                                        className={'listing-bids-item__days'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                        (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                        (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                                    {(item.note) && <button className="listing-bids-item__note"
                                                            onClick={() => setNoteMessage(item.note)}>Note</button>}

                                    <button className={'listing-bind-item__buttons'} onClick={() => {
                                        history.push(`/${USER_ROUTE}/${item.bidderId}`)
                                    }}>View
                                    </button>
                                    {(listing === item.bidderId)&&((isReviewPopupActive.name !=='already')?<button onClick={() => {
                                        setReviewPopupActive({name:item.biider.name, id: item.bidderId})
                                    }} className={'listing-bind-item__buttons'}>Review
                                    </button>:<button className={'listing-bind-item__buttons'}>already posted
                                    </button>)}
                                </div>
                            </div>
                        })

                        // SORT FASTEST
                        :


                        days.map(item1 => {
                            const item = bids[item1.index]
                            return <div key={item1.index} className={(listing === item.bidderId) ? 'listing-bids chosen' : 'listing-bids'}>
                                <div className={'listing-bids-item'}>
                                    <img src={item.biider.profilePictureURL || NOLOGO} alt={'logo'}
                                         className="listing-bids-item__img"/>
                                    <div className="listing-bids-item__shortInfo">
                                        <div className="listing-bids-item__name">{item.biider.name}</div>
                                        <div className="listing-bids-item__socials">{(item.biider.twitterURL) &&
                                        <a href={item.biider.twitterURL}>twitter</a>}{(item.biider.discordURL) && <a
                                            href={item.biider.discordURL}>discord</a>}</div>
                                    </div>
                                    <div className={'listing-bids-item__price'}>${item.price}</div>
                                    <div
                                        className={'listing-bids-item__days'}>{(+(item.daysCount / 7).toFixed(0) === item.daysCount / 7) ?
                                        (item.daysCount / 7 === 1) ? item.daysCount / 7 + ' week' : item.daysCount / 7 + ' weeks' :
                                        (item.daysCount === 1) ? item.daysCount + ' day' : item.daysCount + ' days'}</div>
                                    {(item.note) && <button className="listing-bids-item__note"
                                                            onClick={() => setNoteMessage(item.note)}>Note</button>}
                                    <button className={'listing-bind-item__buttons'} onClick={() => {
                                        history.push(`/${USER_ROUTE}/${item.bidderId}`)
                                    }}>View
                                    </button>
                                    {(listing === item.bidderId)&&<button onClick={() => {
                                    }} className={'listing-bind-item__buttons'}>Review
                                    </button>}
                                </div>
                            </div>
                        })
                    }
                </div>
                }
                </>
        );
};

export default BidsInactive;