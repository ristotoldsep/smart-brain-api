const handleProfileGet = (req, res, db) => {
    const { id } = req.params; /* DESTRUCTURING!! */
    db.select('*').from('users').where({ //Select all users with their id
        id: id
    }).then(user => {
        if (user.length) { //if user object is not "[]" (empty), respond with user
            res.json(user[0])
        } else {
            res.status(404).json("No such user!")
        }
    }).catch(err => res.status(400).json("Error getting user!"))
}

module.exports = {
    handleProfileGet: handleProfileGet
}