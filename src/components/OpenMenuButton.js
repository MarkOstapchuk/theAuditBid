import React, {useState} from 'react';
import {requestListingLink, USER_ROUTE, userId} from "../consts";
import {useHistory} from 'react-router-dom'

const OpenMenuButton = ({openRegPopup}) => {
    const [isActive, setIsActive] = useState(false)
    const token = localStorage.token
    const history = useHistory()
    function buttonOnClick(){
        setIsActive(prev => !prev)
    }
    return (
        <div className={'header-nav'}>
            <div className={(isActive) ? 'header-nav-buttons active' : 'header-nav-buttons'}>
                <a style={{textDecoration: 'none', color: 'inherit'}} rel="noreferrer" target='_blank'
                   href={requestListingLink}>Request Listing</a>
                <span>|</span>
                {(!token) ?
                    <button
                onClick={()=>openRegPopup()}>Sign In</button> : <><button onClick={()=>{
                    history.push(`/${USER_ROUTE}/${localStorage[userId]}`)
                history.go(0)
                }}>Profile</button><span>|</span><button onClick={()=>{
                        delete localStorage.token
                        history.push(`/`)
                        history.go(0)
                    }}>Log Out</button></>}</div>
            <div className={(isActive) ? 'burger-menu active' : 'burger-menu'} onClick={buttonOnClick}>
                <div className="burger-menu-button burger-menu-button__1"/>
                <div className="burger-menu-button burger-menu-button__2"/>
                <div className="burger-menu-button burger-menu-button__3"/>
            </div>
        </div>

    );
};

export default OpenMenuButton;