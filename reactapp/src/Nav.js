import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './App.css'
import {
  Menu,
  Icon,
  Popconfirm,
  message,
  Avatar,
  Badge,
  Affix,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
const { Title } = Typography

function Nav(props) {
  const [userData, setUserData] = useState(props.dataUser)
  const [count, setCount] = useState(0)

  // Au chargement du composant, on obtient toutes les données de l'utilisateur.
  useEffect(() => {
    const userInfo = async () => {
      const data = await fetch(`/userDetail?token=${props.token}`)
      const body = await data.json()
      console.log('body', body)
      if (body.result) {
        setUserData(body.userData)
        props.addUser(body.userData)
      } else {
        console.log('error')
      }
    }

    const findArticlesWishList = async () => {
      const dataWishlist = await fetch(`/wishlist-article?token=${props.token}`)
      const body = await dataWishlist.json()
      console.log('body : ', body)

      setCount(body.articles.length)
    }

    findArticlesWishList()
    userInfo()
  }, [])

  useEffect(() => {
    setCount(props.myArticles.length)
  }, [props.myArticles])

  const handleLogout = () => {
    console.log('Déconnecté!')
    message.info('Vous êtes déconnecté.')
    setCount(0)
    // Suppression du token dans le local storage
    localStorage.clear()
    props.userLogout()
    props.removeToken()
  }

  if (props.token) {
    return (
      <Affix>
        <nav>
          <Menu mode='horizontal' theme='dark'>
            <Menu.Item key='mail' style={{ float: 'center' }}>
              <Link to='/screensource'>
                <Icon type='home' />
                Sources
              </Link>
            </Menu.Item>

            <Menu.Item
              key='app'
              style={{
                float: 'right',
                backgroundColor: '#075293',
                marginLeft: -20,
                marginRight: -10,
              }}
            >
              <Popconfirm
                placement='bottomLeft'
                title='Êtes-vous sûr de vouloir vous déconnecter ?'
                onConfirm={handleLogout}
                okText='Oui'
                cancelText='Annuler'
              >
                <Icon type='logout' />
              </Popconfirm>
            </Menu.Item>
            <Menu.Item
              key='username'
              style={{
                float: 'right',
                backgroundColor: '#075293',
                cursor: 'default',
              }}
            >
              <div className='pseudo'>
                <Avatar
                  size={27}
                  src={userData.avatar}
                  style={{ marginRight: 4, marginTop: -4, marginLeft: -3 }}
                />
                {userData.userName}
              </div>
            </Menu.Item>
            <Menu.Item
              key='test'
              style={{ float: 'right', backgroundColor: '#075293' }}
            >
              <Link to='/screenmyarticles'>
                <Badge size='small' count={count} offset={[-42, 7]}>
                  <Icon type='read' style={{ marginLeft: 20 }} />
                </Badge>
                My Articles
              </Link>
            </Menu.Item>
          </Menu>
        </nav>
      </Affix>
    )
  } else {
    return <Redirect to='/' />
  }
}

function mapStateToProps(state) {
  return {
    myArticles: state.wishList,
    token: state.token,
    selectedLang: state.selectedLang,
    dataUser: state.dataUser,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: function (dataUser) {
      dispatch({ type: 'addUser', dataUser: dataUser })
    },
    userLogout: function () {
      dispatch({ type: 'clearUser' }, { type: 'clearWishList' })
    },
    removeToken: function () {
      dispatch({ type: 'clearToken' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
