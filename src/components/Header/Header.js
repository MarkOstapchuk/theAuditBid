import React, {useState} from 'react';
import OpenMenuButton from "../OpenMenuButton";
import {NavLink} from "react-router-dom";
import './header.css'
import Modal from "../Modals/SignModal/Modal";

const Header = () => {
    const [isPopupActive, setIsPopupActive] = useState(false)

    const styles = {
        left: {
            color: '#26FFFF',
        },
        right: {
            color: '#FF1091'
        }
    }
    if (isPopupActive) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    const openRegPopup = () => {
        setIsPopupActive(prev => !prev)
    }
    return (
        <>
            <header className={'header'}>
                <NavLink to={'/'} style={{textDecoration: 'none'}}>
                    <h1 className="header-logo">
                        <span style={styles.left}>{'{'}</span>theAudit.bid<span style={styles.right}>{'}'}</span>
                    </h1>
                </NavLink>
                <OpenMenuButton openRegPopup={openRegPopup}/>
            </header>
            {(isPopupActive) && <Modal setIsPopupActive={setIsPopupActive} setActive={setIsPopupActive}/>}
        </>
    );
};

export default Header;