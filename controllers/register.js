const handleRegister = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleRegister:handleRegister
}