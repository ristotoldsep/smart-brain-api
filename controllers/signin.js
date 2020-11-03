const handleSignin = (req, res, db, bcrypt) => {
    // Load hash from your password DB.
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash); //Comparing the entered pw to db hash
            if (isValid) {
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
}

module.exports = {
    handleSignin:handleSignin
}