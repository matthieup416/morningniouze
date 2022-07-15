export default function (wishList = [], action) {
  // dans le cas où on envoie tous les articles récupérés de la BDD au chargement de ScreenMyArticles
  if (action.type === 'saveArticles') {
    var newWishList = [...action.articles]
    return newWishList
  }

  // dans le cas où on ajoute un seul article
  else if (action.type === 'addArticle') {
    // on
    var wishListCopy = [...wishList]

    var findArticle = false
    // POUR ÉVITER LES DOUBLONS ON VERIFIE SI L'ARTICLE EST DEJA EN WISHLIST
    for (let i = 0; i < wishListCopy.length; i++) {
      if (wishListCopy[i].title == action.articleLiked.title) {
        findArticle = true
      }
    }
    // ON PUSH L'ARTICLE UNIQUEMENT SI L'ARTICLE N'EXISTE PAS DÉJÀ DANS LA WISHLIST
    if (!findArticle) {
      wishListCopy.push(action.articleLiked)
    }

    return wishListCopy
  }
  //SUPPRESSION d'UN ARTICLE
  else if (action.type === 'deleteArticle') {
    var wishListCopy = [...wishList]
    var position = null

    for (let i = 0; i < wishListCopy.length; i++) {
      if (wishListCopy[i].title == action.title) {
        position = i
      }
    }
    if (position !== null) {
      wishListCopy.splice(position, 1)
    }

    return wishListCopy
  } else if (action.type === 'clearWishlist') {
    return []
  } else {
    return wishList
  }
}
