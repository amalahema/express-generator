const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Assignment 4: 1.Define a favorite Schema 
//=============================
const favoriteSchema = new Schema({
    user: 
    {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'// 3.mongoose population support to populate the information about the user
    },

    dishes: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dish'
    } 
] //4.List of dishes 
}, 
    {
    timestamps : true,
    //usePushEach: true
    }                           
); 
    
//2.create a model name Favorites
//=================================
var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;