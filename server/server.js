const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const firebase = require('./firebase/firebase.connect')
  
// app init
const app = express();


  
// app settings
app.use(bodyParser.json());

// allow urls
const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://localhost:4200',
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
};

// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));




// routes
app.get("/", (req, res) => {
    res.redirect(301,'/tweezes')
  });
app.use('/auths',cors(corsOptions),require('./routes/auths'))
app.use('/users',cors(corsOptions),require('./routes/users'))
app.use('/rels',cors(corsOptions),require('./routes/relationships'))
app.use('/tweezes',cors(corsOptions), require('./routes/tweezes'))



// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});