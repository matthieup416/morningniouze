import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { List, Avatar } from 'antd'
import Nav from './Nav'
import { connect } from 'react-redux'

function ScreenSource(props) {
  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)

  useEffect(() => {
    // On récupère la langue en BDD à l'arrivée du user
    const findLang = async () => {
      const reqFind = await fetch(`/user-lang?token=${props.token}`)
      const result = await reqFind.json()
      console.log('result : ', result)

      setSelectedLang(result.lang)
    }

    findLang()
  }, [])

  useEffect(() => {
    const APIResultsLoading = async () => {
      var langue = 'fr'
      var country = 'fr'

      if (selectedLang == 'en') {
        var langue = 'en'
        var country = 'us'
      }
      // Update de la langue dans le store

      props.updateLang(langue)
      const data = await fetch(
        `https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=b32c8b844d1243b1a7998d8228910f50`
      )
      const body = await data.json()
      setSourceList(body.sources)
    }
    console.log('props.selectedLang : ', props.selectedLang)
    APIResultsLoading()
  }, [selectedLang])

  // Dernière partie sur la gestion des langues, afin que la langue soit enregistrée en BDD.
  var changeLang = async (lang) => {
    // Update de la langue en BDD
    const reqLang = await fetch('/user-lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `langue=${lang}&token=${props.token}`,
    })
    // Update de la langue dans le composant
    setSelectedLang(lang)
  }

  // Gestion du style des drapeaux
  var flagDisplayFr = {
    opacity: 0.7,
    width: 40,
    margin: '10px',
    cursor: 'pointer',
  }
  if (selectedLang === 'fr') {
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
  var flagDisplayEn = {
    opacity: 0.7,
    width: 45,
    margin: '10px',
    cursor: 'pointer',
  }
  if (selectedLang === 'en') {
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
          onClick={() => changeLang('fr')}
        />
        <img
          style={flagDisplayEn}
          src='/images/uk.png'
          onClick={() => changeLang('en')}
        />
      </div>

      <div className='HomeThemes'>
        <List
          itemLayout='horizontal'
          dataSource={sourceList}
          renderItem={(source) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${source.category}.png`} />}
                title={
                  <Link to={`/screenarticlesbysource/${source.id}`}>
                    {source.name}
                  </Link>
                }
                description={source.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return { selectedLang: state.selectedLang, token: state.token }
}

function mapDispatchToProps(dispatch) {
  return {
    updateLang: function (newlang) {
      dispatch({ type: 'changeLang', selectedLang: newlang })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSource)
