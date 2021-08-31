import React from 'react';

const Footer = () => {
    return (
        <footer className={'footer'}>
            <nav>
                <ul>
                    <li style={{marginRight: '35px'}}>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fa fa-twitter"/>
                        </a>
                    </li>
                    <li>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fa fa-discord-alt"/>
                        </a>
                    </li>

                </ul>
            </nav>
        </footer>
    );
};

export default Footer;