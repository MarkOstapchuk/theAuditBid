import React from 'react';

const SignUp = (props) => {
    const signUp = (e) => {
        e.preventDefault()
        props.regFunc()
    }
    const {type, message} = props.errorInputUp
    return (
        <>
        <div className={'regPopup-signUp'}>
            <form className={'regPopup-form'}>
                <label htmlFor="regPopup-reg-name">Name</label>
                <div className="form-inputGroup">
                    {(type === 'name') && <div>{message}</div>}
                    <input value={props.inputUpName} onChange={(event => props.setInputUPName(event.target.value))} name={'regPopup-reg-name'} className={'regPopup-reg-name'} placeholder={'Name'} type="text"/>
                </div>
                <label htmlFor="regPopup-reg-username">Username</label>
                <div className="form-inputGroup">
                    {(type === 'userName') && <div>{message}</div>}
                    <input value={props.inputUPUsername} onChange={(event => props.setInputUPUsername(event.target.value))} name={'regPopup-reg-username'} className={'regPopup-reg-username'} placeholder={'Username'} type="text"/>
                </div>
                <label htmlFor="regPopup-reg-email">Email</label>
                <div className="form-inputGroup">
                    {(type === 'email') && <div>{message}</div>}
                    <input value={props.inputUPEmail} onChange={(event => props.setInputUPEmail(event.target.value))} name={'regPopup-reg-email'} className={'regPopup-reg-email'} placeholder={'Email'} type="email"/>
                </div>

                <label htmlFor="regPopup-reg-password1">Password</label>
                <div className="form-inputGroup">
                    {(type === 'password') && <div>{message}</div>}
                    <input value={props.inputUPPassword1} onChange={(event => props.setInputUPPassword1(event.target.value))} name={'regPopup-reg-password1'} id={'regPopup-reg-password1'} placeholder={'Password'} type="password"/>
                </div>
                <label htmlFor="regPopup-reg-password2">Confirm Password</label>
                <input value={props.inputUPPassword2} onChange={(event => props.setInputUPPassword2(event.target.value))} name={'regPopup-reg-password2'} id={'regPopup-reg-password2'} placeholder={'Confirm Password'} type="password"/>
                <button type={'submit'} onClick={(event => signUp(event))} className={'Signup-btn-confirm'}>Sign Up</button>
            </form>
        </div>
        </>
    );
};

export default SignUp;