var mongoose = require('mongoose')

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

mongoose.connect(
  'mongodb+srv://test:PASSWORD@cluster0.orqbr.mongodb.net/morning?retryWrites=true&w=majority',
  options,
  function (error) {
    if (error == null) {
      console.log('=>Connexion à la base de donnée morning réussie')
    } else {
      console.log(error)
    }
  }
)

module.exports = mongoose
