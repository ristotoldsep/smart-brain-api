/* ENDPOINTS
========================
/ --> res = this is working
/signin --> POST = success/fail (post -> sending passwords more securely)
/register --> POST(we want to add data to db) = return user 
/profile/:userId --> GET = return user
/images --> PUT --> user (counting image inputs)
*/

const express = require("express"),
      app     = express(),
      port    = process.env.PORT || 3000,
   bodyParser = require("body-parser"),
      bcrypt  = require("bcrypt-nodejs"),
      cors    = require("cors"),
      knex    = require("knex"),
    register  = require("./controllers/register"),
      signin  = require("./controllers/signin"),
      profile = require("./controllers/profile"),
      image   = require("./controllers/image");

const db = knex({
  client: 'pg',
  connection: {
      host: 'postgresql-flat-11561',
    user : 'postgres',
    password : 'terekest',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => { //USING PROMISES TO GET DATA!!!
    console.log("Connected to DB");
});

app.use(bodyParser.json());
app.use(cors());

/* const database = {
    users: [
        {
            id: "123",
            name: "Risto",
            email: "ristotoldsep@gmail.com",
            password: "risto",
            entries: 0, //How many images has entered
            joined: new Date() //To track joining date
        },
        {
            id: "1234",
            name: "Rene",
            email: "renetoldsep@gmail.com",
            password: "rene",
            entries: 0, //How many images has entered
            joined: new Date() //To track joining date
        }
    ],
    login: [
        {
            id: '69',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
} */

//ENDPOINTS
// ROOT ROUTE
app.get("/", (req, res) => {
    res.send("Success!");
});

//SIGN IN ROUTE
app.post("/signin", (req, res) => {
    signin.handleSignin(req, res, db, bcrypt) //function in controllers/signin.js
});

//REGISTER ROUTE
app.post("/register", (req, res) => {
    register.handleRegister(req, res, db, bcrypt) //function in controllers/register.js
});

//PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
    profile.handleProfileGet(req, res, db) //function in controllers/profile.js
});

//IMAGE ROUTE
app.put("/image", (req, res) => {
    image.handleImage(req, res, db) //function in controllers/image.js
});

//Api call ROUTE
app.post("/imageurl", (req, res) => {
    image.handleApiCall(req, res) //function in controllers/image.js
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
})

    