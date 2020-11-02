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
      knex    = require("knex");

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
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

// ROOT ROUTE
app.get("/", (req, res) => {
    res.send(database.users);
});

//SIGN IN ROUTE
app.post("/signin", (req, res) => {
      // Load hash from your password DB.
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash); //Comparing the entered pw to db hash
        if(isValid) {
            return db.select('*').from('users') //always make sure to return
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to get user"))
        } else {
            res.status(400).json("Wrong credentials!")
        }
    })
    .catch(err => res.status(400).json("Wrong credentials!"))
/*    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json("error signing in!");
        } */ 
});

//REGISTER ROUTE
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    //FIRST UPDATING THE LOGIN TABLE, THEN THE USERS TABLE
        db.transaction(trx => { //Knex function to make sure that db stays consistent (querys made on single connection)
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit) //If entering to db is successful, commit data to db permanently
            .catch(trx.rollback)
        })
        
        .catch(err => res.status(400).json('Unable to register'))
});

//PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
    const { id } = req.params; /* DESTRUCTURING!! */
    db.select('*').from('users').where({ //Select all users with their id
        id: id
    }).then(user => {
        if(user.length) { //if user object is not "[]" (empty), respond with user
            res.json(user[0])
        } else {
            res.status(404).json("No such user!")
        }
    }).catch(err => res.status(400).json("Error getting user!"))
})

//IMAGE ROUTE
app.put("/image", (req, res) => {
    const { id } = req.body; /* DESTRUCTURING!! */
    /* let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++; 
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(404).json("No such user!")
    } */
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entries"))
})

   /*  bcrypt.hash("bacon", null, null, function(err, hash) {
        // Store hash in your password DB.
    }); */

  /*   // Load hash from your password DB.
    bcrypt.compare("bacon", hash, function(err, res) {
        // res == true
    });
    bcrypt.compare("veggies", hash, function(err, res) {
        // res = false
    }); */

app.listen(port, () => {
    console.log("Server is listening!");
})

    