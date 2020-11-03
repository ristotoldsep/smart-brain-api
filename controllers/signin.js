const handleSignin = (req, res, db, bcrypt) => {
    //Destructuring
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Incorrect form submission"); //returning will stop further execution of the function!
    }
    // Load hash from your password DB.
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash); //Comparing the entered pw to db hash
            if (isValid) {
                return db.select('*').from('users') //always make sure to return
                    .where('email', '=', email)
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
}

module.exports = {
    handleSignin:handleSignin
}