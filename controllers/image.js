const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: process.env.API_KEY //Key is env variable set in heroku!
});

const handleApiCall = (req, res) => {
    //
    //'c0c0ac362b03416da06ab3fa36fb58e3'
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("Couldn't call API!"))
}


const handleImage = (req, res, db) => {
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
}

module.exports = {
    handleImage,
    handleApiCall
}