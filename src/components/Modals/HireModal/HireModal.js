import React from 'react';
import './hireModal.css'

const HireModal = ({user, setActive, setUserHired}) => {
    return (
        <div className={'hireModal-inner'} onClick={setActive}>
            <div className="hireModal-window" onClick={(e) => e.stopPropagation()}>
                {(!user.isHired) ?
                    <>
                        <div className="hireModal-message">Are you sure you want to hire {user.userName}?
                            This will close the auction and notify all participants.
                        </div>
                        <div className="hireModal-btns">
                            <button className={'hireModal-confirmBtn'} onClick={setUserHired}>HIRE</button>
                            <button className={'hireModal-cancelBtn'} onClick={setActive}>Back</button>
                        </div>
                        <button className={'hireModal-closeBtn'} onClick={setActive}>&#215;</button>
                    </>
                    : <>
                        <div className="hireModal-message">Congratulations!<br/>
                            Please reach out to {user.userName} by one of the
                            available methods:
                        </div>
                        <button className={'hireModal-closeBtn'} onClick={setActive}>&#215;</button>
                        <div className="hireModal-socials">
                            {(user.twitterURL) &&
                            <a target={'_blank'} rel="noreferrer" href={user.twitterURL} className={'mr20'}>
                                <i className="fa fa-twitter"/>
                            </a>}
                            {(user.telegramURL) &&
                            <a target={'_blank'} rel="noreferrer" className={'mr20'} href={user.telegramURL}>
                                <i className="fa fa-telegram" aria-hidden="true"/>
                            </a>}
                            {(user.discordURL) &&
                            <a target={'_blank'} rel="noreferrer" className={'mr20'} href={user.discordURL}>
                                <i className="fa fa-discord-alt" aria-hidden="true"/>
                            </a>}
                            {(user.githubURL) && <a target={'_blank'} rel="noreferrer" href={user.githubURL}>
                                <i className="fa fa-github" aria-hidden="true"/>
                            </a>}
                        </div>
                    </>}
            </div>
        </div>
    );
};

export default HireModal;