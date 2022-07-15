import React, { useState, useEffect } from 'react'
import './App.css'
import { Input, Button, message, Space } from 'antd'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

function ScreenHome(props) {
  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [listErrorsSignin, setErrorsSignin] = useState([])
  const [listErrorsSignup, setErrorsSignup] = useState([])

  useEffect(() => {
    console.log('accueil')
    // On vérifie s'il y a un token dans le local storage;
    var findToken = localStorage.getItem('token')
    if (findToken) {
      console.log('token trouvé dans le store : ', findToken)
      // On set userExists à true, ce qui provoquera un Redirect vers /screenhome
      setUserExists(true)
      props.addToken(findToken)
    } else {
      console.log('Pas de token dans le store')
    }
  }, [])
  // Messages antd
  const successSignIn = (nom) => {
    message.success(`👋 Bienvenue sur votre espace MorningNews, ${nom}.`, 2)
  }

  const successSignUp = () => {
    message.success(
      `🎉 Félicitations ${signUpUsername}, votre compte a bien été créé`,
      2
    )
  }

  var handleSubmitSignup = async () => {
    const data = await fetch('/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`,
    })

    const body = await data.json()

    if (body.result === true) {
      props.addToken(body.token)
      //ajout du token dans le local storage
      localStorage.setItem('token', body.token)
      props.updateLang('fr')
      successSignUp()
      setUserExists(true)
    } else {
      setErrorsSignup(body.error)
    }
  }

  var handleSubmitSignin = async () => {
    const data = await fetch('/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    })

    const body = await data.json()

    if (body.result === true) {
      props.addToken(body.token)
      //ajout du token dans le local storage

      localStorage.setItem('token', body.token)

      setUserExists(true)
      successSignIn(body.user.username)
    } else {
      setErrorsSignin(body.error)
    }
  }

  if (userExists) {
    return <Redirect to='/screensource' />
  }

  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return <p>{error}</p>
  })

  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return <p>{error}</p>
  })

  return (
    <div className='Login-page'>
      {/* SIGN-IN */}

      <div className='Sign'>
        <Input
          onChange={(e) => setSignInEmail(e.target.value)}
          className='Login-input'
          placeholder='email'
        />

        <Input.Password
          onChange={(e) => setSignInPassword(e.target.value)}
          className='Login-input'
          placeholder='password'
        />

        {tabErrorsSignin}

        <Button
          onClick={() => handleSubmitSignin()}
          style={{ width: '80px' }}
          type='primary'
        >
          Sign-in
        </Button>
      </div>

      {/* SIGN-UP */}

      <div className='Sign'>
        <Input
          onChange={(e) => setSignUpUsername(e.target.value)}
          className='Login-input'
          placeholder='username'
        />

        <Input
          onChange={(e) => setSignUpEmail(e.target.value)}
          className='Login-input'
          placeholder='email'
        />

        <Input.Password
          onChange={(e) => setSignUpPassword(e.target.value)}
          className='Login-input'
          placeholder='password'
        />

        {tabErrorsSignup}

        <Button
          onClick={() => handleSubmitSignup()}
          style={{ width: '80px' }}
          type='primary'
        >
          Sign-up
        </Button>
      </div>
    </div>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: 'addToken', token: token })
    },
    updateLang: function (newlang) {
      dispatch({ type: 'changeLang', selectedLang: newlang })
    },
  }
}

export default connect(null, mapDispatchToProps)(ScreenHome)
