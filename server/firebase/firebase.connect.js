const firebase = require("firebase/app")
const firebaseConfig = require('./firebase.config')


// initialize the connection to the database
const app = firebase.initializeApp(firebaseConfig);

module.exports = app

