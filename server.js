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
      cors    = require("cors");

app.use(bodyParser.json());
app.use(cors());

const database = {
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
}

// ROOT ROUTE
app.get("/", (req, res) => {
    res.send(database.users);
});

//SIGN IN ROUTE
app.post("/signin", (req, res) => {
      // Load hash from your password DB.
    /* bcrypt.compare("semir", "$2a$10$GYyhQD4llKuJpNERkscHHOB8GqthJzedfp9a/UzzHn4o1cPnfPUUe", function(err, res) {
        // res == true
        console.log("first guess", res);
    });
    bcrypt.compare("veggies", "$2a$10$GYyhQD4llKuJpNERkscHHOB8GqthJzedfp9a/UzzHn4o1cPnfPUUe", function(err, res) {
        // res = false
        console.log("second guess", res);
    }); */
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json("error signing in!");
        }
    //res.json("signin");
});

//REGISTER ROUTE
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    /*   bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    }); */
    database.users.push({
        id: "125",
        name: name,
        email: email,
        // password: password,
        entries: 0, //How many images has entered
        joined: new Date() //To track joining date
    })
    res.json(database.users[database.users.length-1]);
});

//PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
    const { id } = req.params; /* DESTRUCTURING!! */
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found) {
        res.status(404).json("No such user!")
    }
})

//IMAGE ROUTE
app.put("/image", (req, res) => {
    const { id } = req.body; /* DESTRUCTURING!! */
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++; 
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(404).json("No such user!")
    }
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

    