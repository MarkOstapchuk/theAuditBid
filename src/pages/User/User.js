import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom'
import axios from "axios";
import {LISTING_ROUTE, NOLOGO, SERVER_URL, USER_ROUTE, userId} from "../../consts";
import {RingLoader} from "react-spinners";
import './User.css'
import {secondsToDhms} from "../../functions";
import '@fortawesome/fontawesome-free/css/all.css'

const User = (props) => {
    const [loader, setLoader] = useState(true)
    const [user, setUser] = useState({})
    const [isUserAdmin, setUserAdmin] = useState(false)
    const [isNameEditing, setNameEditing] = useState(false)
    const [isDescriptionEditing, setDescriptionEditing] = useState(false)
    const [inputError, setInputError] = useState({})
    const [socialsPopup, setSocialsPopup] = useState(false)
    const [twitterLink, setTwitterLink] = useState('')
    const [discordLink, setDiscordLink] = useState('')
    const [telegramLink, setTelegramLink] = useState('')
    const [gitHubLink, setGitHubLink] = useState('')
    const id = props.match.params.id
    const inputFile = useRef(null)
    const history = useHistory()
    console.log(user)
    useEffect(() => {
        async function fetchUser() {
            await axios.get(`${SERVER_URL}/user/${id}`).then(data => {
                setUser(data.data)
                if (data.data.twitterURL) {
                    setTwitterLink(data.data.twitterURL)
                }
                if (data.data.discordURL) {
                    setDiscordLink(data.data.discordURL)
                }
                if (data.data.telegramURL) {
                    setTelegramLink(data.data.telegramURL)
                }
                if (data.data.githubURL) {
                    setGitHubLink(data.data.githubURL)
                }

                if ((localStorage[userId] === data.data._id) && localStorage.token !== undefined) {
                    setUserAdmin(prevState => !prevState)
                }
            })
            setLoader(false)
        }

        if (Object.keys(user).length === 0) {
            fetchUser()
        }
    })
    console.log(user)
    const getRegisteredTime = (date) => {
        const Dated = new Date(date.split('T')[0])
        const time =  date.split('T')[1].split('.')[0]
        const hours = time.split(':')[0]*3600*1000
        const minutes = time.split(':')[1]*60*1000
        const seconds = time.split(':')[2]*1000
        return secondsToDhms(Date.now() - Dated.getTime() - hours - minutes - seconds)
    }
    const changeName = async () => {
        await axios.patch(`${SERVER_URL}/${USER_ROUTE}`, {
            name: user.name
        }, {
            headers: {
                'auth-token': localStorage.token
            }
        }).then(data => {

            if (data.status === 200) {

                setInputError({})
                setNameEditing(prevState => !prevState)
            }
        }).catch(e => console.log(e.response))
    }
    const changeDescription = async () => {
        await axios.patch(`${SERVER_URL}/${USER_ROUTE}`, {
            description: user.description
        }, {
            headers: {
                'auth-token': localStorage.token
            }
        }).then(data => {

            console.log(data)

            if (data.status === 200) {

                setInputError({})
                setDescriptionEditing(prevState => !prevState)
            }
        }).catch(e => alert(e.response))
    }
    const onButtonClick = () => {
        inputFile.current.click();
    };
    const uploadFiles = (e) => {
        if (e.target.files.length !== 0) {
            console.log(e.target.files)
            const formData = new FormData()
            formData.append('file', e.target.files[0])
            axios.post(`${SERVER_URL}/user/uploadPhoto`, formData, {
                headers: {
                    'auth-token': localStorage.token
                }
            }).then(data => {
                setUser(prevState => {
                    return {...prevState, profilePictureURL: data.data.profilePictureURL}
                })
            }).catch(e => console.log(e.response))
        }
    }
    const saveSocials = async() => {
        await axios.patch(`${SERVER_URL}/${USER_ROUTE}`, {
            twitterURL: twitterLink,
            discordURL: discordLink,
            telegramURL: telegramLink,
            githubURL: gitHubLink
        }, {
            headers: {
                'auth-token': localStorage.token
            }
        }).then(()=>{
            setSocialsPopup(prevState => !prevState)
            history.go(0)
        }).catch(e => alert(e.response))
    }
    if (socialsPopup) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    if (loader) {
        return <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}><RingLoader color={'#fff'}/></div>
    }
    return (
        <>
            {(socialsPopup) && <div className="addSocialsPopup">
                <div className="addSocialsPopup-window">
                    <div className="addSocialsPopup-window-group">
                        <label htmlFor="addSocialsPopup-window-group__twitter">Twitter</label>
                        <input onChange={(e) => setTwitterLink(e.target.value)} value={twitterLink} type="text"
                               id={'addSocialsPopup-window-group__twitter'}/>
                    </div>
                    <div className="addSocialsPopup-window-group">
                        <label htmlFor="addSocialsPopup-window-group__discord">Discord</label>
                        <input onChange={(e) => setDiscordLink(e.target.value)} value={discordLink} type="text"
                               id={'addSocialsPopup-window-group__discord'}/>
                    </div>
                    <div className="addSocialsPopup-window-group">
                        <label htmlFor="addSocialsPopup-window-group__telegram">Telegram</label>
                        <input onChange={(e) => setTelegramLink(e.target.value)} value={telegramLink} type="text"
                               id={'addSocialsPopup-window-group__telegram'}/>
                    </div>
                    <div className="addSocialsPopup-window-group">
                        <label htmlFor="addSocialsPopup-window-group__gitHub">GitHub</label>
                        <input onChange={(e) => setGitHubLink(e.target.value)} value={gitHubLink} type="text"
                               id={'addSocialsPopup-window-group__gitHub'}/>
                    </div>
                    <button onClick={saveSocials}>Save</button>
                </div>
            </div>}
            <div className={'user'}>
                <div className="user-info">
                    <div className={'user-info__img'}>
                        {(isUserAdmin) && <input onChange={e => {
                            uploadFiles(e)
                        }} type='file' id='file' ref={inputFile} style={{display: 'none'}}/>}
                        <img src={user.profilePictureURL || NOLOGO} alt="logo"/>
                        {(isUserAdmin) && <div onClick={onButtonClick} className="user-info__imgBG icon-camera"/>}
                    </div>
                    <div className="user-info__nameAndStats">
                        <div>{(!isNameEditing) ? <div>{user.name}</div> : <input onChange={(event => setUser(prev => {
                            return {...prev, name: event.target.value}
                        }))} value={user.name} type="text"/>}
                            {(isUserAdmin) && ((!isNameEditing) ? <p className={'icon-pencil'} onClick={() => {
                                setNameEditing(prevState => !prevState)

                            }
                            }/> : <p onClick={() => {
                                if (user.name.length > 4) {
                                    changeName()
                                    return
                                }
                                setInputError({type: 'name', message: 'name must contain more than 5 letters'})
                                setTimeout(() => {
                                    setInputError({})
                                }, 4000)

                            }} className={'icon-checkmark'}/>)}
                        </div>
                        {(inputError.type === 'name') && <div className="user-inputError">{inputError.message}</div>}
                        <span>{user.completedAudits.length} completed audits</span>
                    </div>
                    <div className="user-info__socials">
                        {(user.twitterURL) &&
                        <a target={'_blank'} rel="noreferrer" href={user.twitterURL} className={'mr20'}>
                            <i className="fab fa-twitter fab_socials"/>
                        </a>}
                        {(user.telegramURL) &&
                        <a target={'_blank'} rel="noreferrer" className={'mr20'} href={user.telegramURL}>
                            <i className="fab fa-telegram fab_socials"/>
                        </a>}
                        {(user.discordURL) &&
                        <a target={'_blank'} rel="noreferrer" className={'mr20'} href={user.discordURL}>
                            <i className="fab fa-discord fab_socials"/>
                        </a>}
                        {(user.githubURL) && <a target={'_blank'} rel="noreferrer" href={user.githubURL}>
                            <i className="fab fa-github fab_socials"/>
                        </a>}
                        {(isUserAdmin) && <><span className={'user-addSocialStripe'}/><button onClick={() => setSocialsPopup(prevState => !prevState)}
                                                  className={'user-addSocialsBtn'}><i className="fas fa-plus"/>
                        </button></>}
                    </div>
                </div>
                <div className="user-description">
                    {(!isDescriptionEditing) ? ((user.description) ?
                        <p>{user.description}</p>
                        :
                        <p>No description</p>) :
                        <textarea name="" id="user-descriptionTextarea" value={user.description || ''}
                                  onChange={(event => setUser(prevState => {
                                      return {...prevState, description: event.target.value}
                                  }))}/>}
                    {(isUserAdmin) && ((!isDescriptionEditing) ?
                        <button onClick={() => {
                            setDescriptionEditing(prevState => !prevState)
                        }} className={'icon-pencil'}/>
                        :
                        <button onClick={() => {
                            if (user.description !== '') {
                                changeDescription()
                            }

                        }} className={'icon-checkmark'}/>)}
                </div>
                <div className="user-registered">Registered: {getRegisteredTime(user.registrationDate)}</div>

                <h1 style={{margin: '84px 0px 66px 10.78%', fontSize: '40px'}}>COMPLETED AUDITS</h1>
                <div className={'user-completedAudits'}>
                    {(user.completedAudits.length === 0) ? <span>No competed audits yet</span> :
                        <div className={'user-completedAudits-list'}>
                            {user.completedAudits.map(item => {
                                return (
                                    <div key={item._id} className="userAudits-list-item">
                                        <div className={'userAudits-list-item__all'}>
                                            <img src={item.logoURL} alt="logo"/>
                                            <div className={'userAudits-list-item__title'}>{item.name}</div>
                                            <div className={'userAudits-list-item__info'}>
                                                <span>{item.contractCount} Contracts</span>
                                                <span>|</span>
                                                <span>{(item.linesCount.toString().length >= 4) ?
                                                    ((item.linesCount / 1000).toFixed(1) + 'k') : item.linesCount
                                                } Lines</span>
                                            </div>
                                            <button className={'userAudits-list-item__button'} onClick={() => {
                                                history.push(`/${LISTING_ROUTE}/${item._id}`)
                                            }}>View Details
                                            </button>
                                        </div>
                                        <div className="userAudits-review">
                                            <div>review:</div>
                                            <div className={'user-audits-reviewText'}>{item.review.review}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                </div>
            </div>
        </>
    );
};

export default User;