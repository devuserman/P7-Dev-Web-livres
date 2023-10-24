const mongoose = require('mongoose');
// Importation du plugin uniqueValidator pour s'assurer que
//  les emails soient uniques dans la base de données
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour un utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // doit être unique et est requis
  password: { type: String, required: true } // requis
});

// Application du plugin uniqueValidator au schéma userSchema
//  ajoutera une validation pour s'assurer que les emails sont uniques dans la base de données
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

