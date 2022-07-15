import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'
import { Card, Icon, Modal } from 'antd'
import Nav from './Nav'
import { connect } from 'react-redux'

const { Meta } = Card

function ScreenArticlesBySource(props) {
  const [articleList, setArticleList] = useState([])
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var { id } = useParams()

  useEffect(() => {
    const findArticles = async () => {
      const data = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=4b589909eebe41139b33ccf2d8862b59`
      )
      const body = await data.json()
      console.log(body)
      setArticleList(body.articles)
    }

    const userInfo = async () => {
      const data = await fetch(`/userDetail?token=${props.token}`)
      const body = await data.json()
      console.log('body', body)
      if (body.result) {
        props.addUser({
          token: body.userData.token,
          userName: body.userData.userName,
          lang: body.userData.lang,
        })
      } else {
        console.log('error')
      }
    }
    userInfo()
    findArticles()
  }, [])

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

  var saveArticle = async (article) => {
    console.log('article dans saveArticle : ', article)
    props.addToWishList(article)
    const saveReq = await fetch('/wishlist-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${article.title}&content=${article.content}&desc=${article.description}&lang=${props.selectedLang}&img=${article.urlToImage}&token=${props.token}`,
    })
  }

  return (
    <div>
      <Nav />

      <div className='Banner' />

      <div className='Card'>
        {articleList.map((article, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              style={{
                width: 300,
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              cover={<img alt='example' src={article.urlToImage} />}
              actions={[
                <Icon
                  type='read'
                  key='ellipsis2'
                  onClick={() => showModal(article.title, article.content)}
                />,
                <Icon
                  type='like'
                  key='ellipsis'
                  onClick={() => {
                    saveArticle(article)
                  }}
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
    dataUser: state.dataUser,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function (article) {
      dispatch({ type: 'addArticle', articleLiked: article })
    },
    saveArticles: function (articles) {
      dispatch({ type: 'saveArticles', articles: articles })
    },
    addUser: function (dataUser) {
      dispatch({ type: 'addUser', dataUser: dataUser })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource)
