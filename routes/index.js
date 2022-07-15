var express = require('express')
var router = express.Router()

var uid2 = require('uid2')
var bcrypt = require('bcrypt')

var userModel = require('../models/users')
var articleModel = require('../models/articles')
//MODULE FAKER POUR GENERER UN AVATAR ALEATOIRE
const { faker } = require('@faker-js/faker')

// RECUPERER TOUS LES ARTICLES DE LA WISHLIST
router.get('/wishlist-article', async function (req, res, next) {
  console.log('req.query : ', req.query)
  var articles = []
  var result = false
  const user = await userModel
    .findOne({
      token: req.query.token,
    })
    .populate('userArticles')
    .exec()

  console.log('user ', user)

  if (user !== null) {
    // SI on recoit une langue du frontend, on filtre par langue, sinon on envoie toutes les langues
    result = true
    if (req.query.lang) {
      console.log('langue selectionnee : ', req.query.lang)
      for (var i = 0; i < user.userArticles.length; i++) {
        var article = await articleModel.findOne({
          _id: user.userArticles[i]._id,
          lang: req.query.lang,
        })
        if (article) {
          articles.push(article)
        }
      }
    } else if (!req.query.lang || req.query.lang === '') {
      console.log('pas de langue selectionnee')
      for (var i = 0; i < user.userArticles.length; i++) {
        var article = await articleModel.findOne({
          _id: user.userArticles[i]._id,
        })

        if (article) {
          articles.push(article)
        }
      }
    } else {
      articles = []
    }
  }

  res.json({ articles })
})

//AJOUT D'UN ARTICLE EN BDD
router.post('/wishlist-article', async function (req, res, next) {
  console.log('req.body : ', req.body)
  var error = []
  var result = false
  var token = null
  var findArticle = false

  const user = await userModel
    .findOne({
      token: req.body.token,
    })
    .populate('userArticles')
    .exec()

  console.log('user: ', user)
  // SI L'UTILISATEUR EST RECONNU ON CONTINUE
  // On vérifie si l'article n'existe pas déjà en BDD pour éviter les doublons
  if (user) {
    for (let i = 0; i < user.userArticles.length; i++) {
      if (user.userArticles[i].title == req.body.name) {
        console.log('article existe deja')
        findArticle = true
      }
    }
  }
  // Si l'article n'existe pas en BDD, on peut l'ajouter.
  if (!findArticle) {
    console.log('l104')
    //Ajout de l'article dans la collection articles
    var newArticle = new articleModel({
      title: req.body.name,
      description: req.body.desc,
      content: req.body.content,
      image: req.body.img,
      lang: req.body.lang,
    })

    await newArticle.save()

    //Puis on fait l'Ajout de l'id de l'article dans les clés etrangères du user
    var updatedUser = await userModel.updateOne(
      { token: req.body.token },
      { $push: { userArticles: newArticle._id } }
    )
    // Si la BDD nous renvoie bien que 1 user a été modifié, on passe result à true.
    if (updatedUser.nModified == 1) {
      result = true
      token = updatedUser.token
    } else {
      result = false
      error.push('erreur ')
    }
  }

  res.json({ result, user, error, token })
})

// SUPPRESSION
router.delete('/wishlist-article', async function (req, res, next) {
  console.log('req.body : ', req.body)
  var error = []
  var result = false
  var token = null

  const user = await userModel
    .findOne({
      token: req.body.token,
    })
    .populate('userArticles')
    .exec()

  if (user != null) {
    console.log('user.userArticles : ', user.userArticles)
    user.userArticles.pull({ _id: req.body.articleId })

    var userSaved = await user.save()
    result = true
    token = userSaved.token

    var article = await articleModel.findOne({ _id: req.body.articleId })
  }

  res.json({ result, userSaved, error, token, article })
})

router.post('/sign-up', async function (req, res, next) {
  var error = []
  var result = false
  var saveUser = null
  var token = null
  //génération de l'avatar aléatoire
  const myAvatar = faker.image.avatar()

  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  })

  if (data != null) {
    error.push('utilisateur déjà présent')
  }

  if (
    req.body.usernameFromFront == '' ||
    req.body.emailFromFront == '' ||
    req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }

  if (error.length == 0) {
    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10)
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      lang: 'fr',
      avatar: myAvatar,
    })

    saveUser = await newUser.save()

    if (saveUser) {
      result = true
      token = saveUser.token
    }
  }

  res.json({ result, saveUser, error, token })
})

router.post('/sign-in', async function (req, res, next) {
  var result = false
  var user = null
  var error = []
  var token = null

  if (req.body.emailFromFront == '' || req.body.passwordFromFront == '') {
    error.push('champs vides')
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })

    if (user) {
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
    } else {
      error.push('email incorrect')
    }
  }

  res.json({ result, user, error, token })
})

// Recuperer LANGUE DU USER
router.get('/user-lang', async function (req, res, next) {
  var lang = null
  var result = false
  const user = await userModel.findOne({
    token: req.query.token,
  })
  if (user != null) {
    result = true
    lang = user.lang
  }

  res.json({ result, lang })
})

// Changer LANGUE DU USER
router.post('/user-lang', async function (req, res, next) {
  console.log('req.body sur /user-lang : ', req.body)
  var lang = null
  var token = req.body.token
  var result = false
  var error = []

  const updatedUser = await userModel.updateOne(
    {
      token: req.body.token,
    },
    { lang: req.body.langue }
  )

  if (updatedUser.nModified == 1) {
    result = true
    token = updatedUser.token
  } else {
    result = false
    error.push('erreur ')
  }

  res.json({ result, lang: updatedUser.lang, error, token })
})

// Récupération des données de l'utilisateur via son token.
router.get('/userDetail', async (req, res) => {
  console.log('req.query dans userDetail', req.query)
  var result = false
  var userData = {}
  var user = await userModel.findOne({
    token: req.query.token,
  })
  if (user) {
    result = true
    userData = {
      userName: user.username,
      lang: user.lang,
      token: user.token,
      count: user.userArticles.length,
      avatar: user.avatar,
    }
  }
  res.json({ result, userData })
})
module.exports = router
