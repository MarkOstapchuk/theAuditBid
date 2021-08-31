import React from 'react';
import './notification.css'

const Notification = ({type, children, notificationOff}) => {
    return (
        <div className={(type === 'success')?'NotificationSuccess': 'NotificationError'}>
            <button onClick={notificationOff}>&#215;</button>
            <div>{children}</div>
        </div>
    );
};

export default Notification;