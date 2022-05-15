const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const firebase = require('./firebase/firebase.connect')
  
// app init
const app = express();


  
// app settings
app.use(bodyParser.json());

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));





// routes
// app.get("/", (req, res) => {
//     res.json(['heeloww'])
//   });
app.use('/auths',require('./routes/auths'))
app.use('/users',require('./routes/users'))
app.use('/rels',require('./routes/relationships'))



// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});