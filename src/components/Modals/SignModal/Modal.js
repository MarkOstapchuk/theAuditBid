import React, {useState} from 'react';
import axios from "axios";
import {useHistory} from 'react-router-dom'
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {SERVER_URL, USER_ROUTE, userId} from "../../../consts";
import './modal.css'

const Modal = ({setActive, setIsPopupActive}) => {
    const [chosen, setChosen] = useState('signIn')
    const [inputInUsername, setInputInUsername] = useState('')
    const [inputInPassword, setInputInPassword] = useState('')
    const [inputUpName, setInputUPName] = useState('')
    const [inputUPUsername, setInputUPUsername] = useState('')
    const [inputUPEmail, setInputUPEmail] = useState('')
    const [inputUPPassword1, setInputUPPassword1] = useState('')
    const [inputUPPassword2, setInputUPPassword2] = useState('')

    const history = useHistory()
    //errors

    const [errorInput, setErrorInput] = useState({})
    const [errorInputUp, setErrorInputUp] = useState({})

    async function loginFunc() {
        try {
            await axios.post(`${SERVER_URL}/api/login`, {
                    email: inputInUsername,
                    password: inputInPassword,
                }
            ).then(data => {
                        localStorage.setItem(userId, data.data.userId)
                        localStorage.setItem('token', data.data.auth)
                        history.push(`${USER_ROUTE}/${data.data.userId}`)
                        setIsPopupActive(prev => !prev)
            }).catch((e) => {
                const data = e.response.data
                const first = data.split(' ')[0]
                if (first === '"email"') {
                    setErrorInput({type: 'email', message: data})
                    setTimeout(()=>{
                        setErrorInput({})
                    }, 4000)
                    return
                }
                if (first === '"password"') {
                    setErrorInput({type: 'password', message: data})
                    setTimeout(()=>{
                        setErrorInput({})
                    }, 4000)
                    return
                }
                    setErrorInput({type: 'incorrect', message: data})
            });
        } catch (e) {

        }
    }
    async function RegFunc() {
        if (inputUPPassword1 === inputUPPassword2) {
            try {
                await axios.post(`${SERVER_URL}/api/register`, {
                    "email": inputUPEmail,
                    "password": inputUPPassword1,
                    "name": inputUpName,
                    "userName": inputUPUsername
                }).then(data=> {
                    setChosen('confirm')
                })
                    .catch(e=>{
                        const error = e.response.data.message

                        const type = error.split(' ')[0]
                        if (type === '"name"') {
                            setErrorInputUp({type: 'name', message: error})
                            setTimeout(()=>{setErrorInputUp({})},4000)
                            return
                        }
                        if (type === '"userName"') {
                            setErrorInputUp({type: 'userName', message: error})
                            setTimeout(()=>{setErrorInputUp({})},4000)
                            return
                        }
                        if (type === '"email"') {
                            setErrorInputUp({type: 'email', message: error})
                            setTimeout(()=>{setErrorInputUp({})},4000)
                            return
                        }
                        if (type === 'Password') {
                            setErrorInputUp({type: 'password', message: error})
                            setTimeout(()=>{setErrorInputUp({})},4000)
                            return
                        }
                    })
            } catch (e) {
            }
            return
        }
        setErrorInputUp({type: 'incorrect', message: 'Passwords do not match'})
    }

    return (
        <div className={'regPopup-inner'} >
            <div className={(chosen === 'signIn') ? "regPopup-window" : (chosen ==="signUp") ? "regPopup-window signUp" : "regPopup-window signUpConfirm"} onClick={(e) => {
                e.stopPropagation()
            }}>
                {(chosen !== 'confirm') && <><button onClick={()=>{setChosen('signIn')}}
                        className={(chosen === 'signIn') ? 'regPopup-signInBtn active' : 'regPopup-signInBtn'}>Sign In</button>
                <button onClick={()=>{setChosen('signUp')}}
                        className={(chosen === 'signUp') ? 'regPopup-signUpBtn active' : 'regPopup-signUpBtn'}>Sign Up</button></>}
                <button onClick={()=>{
                    setInputInUsername('')
                    setInputInPassword('')
                    setActive(false)
                }} className={'regPopup-closeBtn'}>&#215;</button>
                <div>
                    {(chosen === 'signIn') ? <SignIn setIsPopupActive={setIsPopupActive} loginFunc={loginFunc}
                        inputInUsername={inputInUsername}
                        setInputInUsername={setInputInUsername}
                        inputInPassword={inputInPassword}
                        setInputInPassword={setInputInPassword} errorInput={errorInput}/> : (chosen === 'signUp') ?
                        <SignUp regFunc={RegFunc}
                                errorInputUp={errorInputUp}
                            inputUpName={inputUpName}
                                setInputUPName={setInputUPName}
                                inputUPUsername={inputUPUsername}
                                setInputUPUsername={setInputUPUsername}
                                inputUPEmail={inputUPEmail}
                                setInputUPEmail={setInputUPEmail}
                                inputUPPassword1={inputUPPassword1}
                                setInputUPPassword1={setInputUPPassword1}
                                inputUPPassword2={inputUPPassword2}
                                setInputUPPassword2={setInputUPPassword2}/> :
                        <div className={'popUp-confirmReg'}>
                            <h1>Please check your email and confirm your registration.</h1>
                            <button onClick={()=>{setChosen('signIn')}}>Done</button>
                        </div>}
                </div>
            </div>
            {(errorInput.type === 'incorrect') &&<div onClick={(e) => {
                e.stopPropagation()
            }} className={'incorrectError'}>
                <button onClick={()=>{
                    setErrorInput({})
                }} className={'incorrectError-closeBtn'}>&#215;</button>
                <h1>{errorInput.message}</h1>
            </div>}
            {(errorInputUp.type === 'incorrect') &&<div onClick={(e) => {
                e.stopPropagation()
            }} className={'incorrectError'}>
                <button onClick={()=>{
                    setErrorInputUp({})
                }} className={'incorrectError-closeBtn'}>&#215;</button>
                <h1>{errorInputUp.message}</h1>
            </div>}
        </div>
    );
};

export default Modal;