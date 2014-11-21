// Inclusion de Mongoose
var mongoose = require('mongoose');
 
// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});
 
// Création du schéma pour l enregistrement
var registerSchema = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  date : { type : Date, default : Date.now },
  motPass : { type : Number}
});
 
// Création du Model pour l enregistrement
var registerModel = mongoose.model('compte', registerSchema);
 
// On crée une instance du Model
var register = new registerModel({ pseudo : 'abi' });
register.motPass = 1745;

register.remove({ pseudo : 'abi' }, function (err) {
  if (err) { throw err; }
  console.log('Commentaires avec pseudo abi supprimés !');
});
 
// On le sauvegarde dans MongoDB !
register.save(function (err) {
  if (err) { throw err; }
  console.log('enregistré avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});