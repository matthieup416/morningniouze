import React, { useState, useEffect } from 'react'
import './App.css'
import { Card, Icon, Modal } from 'antd'
import Nav from './Nav'

import { connect } from 'react-redux'

const { Meta } = Card

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [langFiltre, setLangFiltre] = useState('')

  useEffect(() => {
    const findArticlesWishList = async () => {
      const dataWishlist = await fetch(
        `/wishlist-article?lang=${langFiltre}&token=${props.token}`
      )
      const body = await dataWishlist.json()
      console.log('body.articles : ', body.articles)

      props.saveArticles(body.articles)
    }

    findArticlesWishList()
  }, [langFiltre])

  var deleteArticle = async (articleId) => {
    const deleteReq = await fetch('/wishlist-article', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `articleId=${articleId}&token=${props.token}`,
    })

    const body = await deleteReq.json()

    props.deleteToWishList(body.article.title)
  }

  //Nouvelle fonction qui change la langue dans le composant, et déclenchera un nouveau fetch sur la BDD avec la langue choisie.
  const filtreLang = (lang) => {
    if (langFiltre === '') {
      setLangFiltre(lang)
    } else {
      setLangFiltre('')
    }
  }

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)
  }

  var handleOk = (e) => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = (e) => {
    console.log(e)
    setVisible(false)
  }

  // Gestion du style des drapeaux

  var flagDisplayFr
  if (langFiltre === '') {
    flagDisplayFr = {
      opacity: 1,
      width: 45,
      margin: '10px',
      cursor: 'pointer',
    }
  } else if (langFiltre === 'fr') {
    flagDisplayFr = {
      opacity: 1,
      width: 45,
      margin: '10px',
      cursor: 'pointer',
    }
  } else {
    flagDisplayFr = {
      opacity: 0.7,
      width: 40,
      margin: '10px',
      cursor: 'pointer',
    }
  }
  var flagDisplayEn
  if (langFiltre === '') {
    flagDisplayEn = {
      opacity: 1,
      width: 45,
      margin: '10px',
      cursor: 'pointer',
    }
  } else if (langFiltre === 'en') {
    flagDisplayEn = {
      opacity: 1,
      width: 45,
      margin: '10px',
      cursor: 'pointer',
    }
  } else {
    flagDisplayEn = {
      opacity: 0.7,
      width: 40,
      margin: '10px',
      cursor: 'pointer',
    }
  }

  var noArticles
  if (props.myArticles.length == 0) {
    noArticles = <div style={{ marginTop: '30px' }}>No Articles</div>
  }
  return (
    <div>
      <Nav />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className='Banner'
      >
        <img
          style={flagDisplayFr}
          src='/images/fr.png'
          onClick={() => filtreLang('fr')}
        />
        <img
          style={flagDisplayEn}
          src='/images/uk.png'
          onClick={() => filtreLang('en')}
        />
      </div>

      {noArticles}

      <div className='Card'>
        {props.myArticles.map((article, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              style={{
                width: 300,
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              cover={<img alt='example' src={article.image} />}
              actions={[
                <Icon
                  type='read'
                  key='ellipsis2'
                  onClick={() => showModal(article.title, article.content)}
                />,
                <Icon
                  type='delete'
                  key='ellipsis'
                  onClick={() => deleteArticle(article._id)}
                />,
              ]}
            >
              <Meta title={article.title} description={article.description} />
            </Card>
            <Modal
              title={title}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{content}</p>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    myArticles: state.wishList,
    token: state.token,
    selectedLang: state.selectedLang,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteToWishList: function (articleTitle) {
      dispatch({ type: 'deleteArticle', title: articleTitle })
    },
    saveArticles: function (articles) {
      dispatch({ type: 'saveArticles', articles: articles })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles)
