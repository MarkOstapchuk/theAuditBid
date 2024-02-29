import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css'

const Footer = () => {
    const styles = {
        li: {
            marginRight: 25
        }
    }
    return (
        <footer className={'footer'}>
            <nav>
                <ul>
                    <li style={styles.li}>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fab fa-twitter fab_socials"/>
                        </a>
                    </li>
                    <li style={styles.li}>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fab fa-telegram fab_socials"/>
                        </a>
                    </li>
                    <li style={styles.li}>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fab fa-discord fab_socials"/>
                        </a>
                    </li>
                    <li>
                        <a target={'_blank'} rel="noreferrer" href="https://google.com">
                            <i className="fab fa-github fab_socials"/>
                        </a>
                    </li>

                </ul>
            </nav>
        </footer>
    );
};

export default Footer;