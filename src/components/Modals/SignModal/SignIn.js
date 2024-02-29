import React from 'react';
const SignIn = ({inputInUsername,setInputInUsername,inputInPassword,setInputInPassword, loginFunc, errorInput}) => {

    const SignIn = async (e) => {
        e.preventDefault()
            loginFunc()
    }
    const {type, message} = errorInput
    return (
        <div className={'regPopup-signIn'}>
            <form>
                <label htmlFor="regPopup-login-username">Email</label>
                <div className="form-inputGroup">
                    {(type === 'email') && <div>{message}</div>}
                    <input value={inputInUsername} onChange={(event => setInputInUsername(event.target.value))} name={'login-username'} id={'regPopup-login-username'} type="email"/>
                </div>
                <label htmlFor="regPopup-login-password">Password</label>
                <div className="form-inputGroup">
                    {(type === 'password') && <div>{message}</div>}
                    <input value={inputInPassword} onChange={(event => setInputInPassword(event.target.value))} name={'login-password'} id={'regPopup-login-password'} type="password"/>
                </div>
                <div className="Signin-btns">
                    <button onClick={(event => SignIn(event))}  className={'Signin-btn'}>Sign In</button>
                </div>
            </form>
        </div>
    );
};

export default SignIn;