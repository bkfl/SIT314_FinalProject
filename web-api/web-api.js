const express = require('express')
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const axios = require('axios')

const Device = require('./models/device')
const User = require('./models/user')

const tokenKey = '0pUb#7nkr%cmH1Ct2X$c5ae707aY2c';

const authoriseRequest = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Read bearer token from authorisation header
        const token = authHeader.split(' ')[1];
        // Verify bearer token
        jwt.verify(token, tokenKey, (err, user) => {
            // Authorisation header does not contain a valid token
            if (err) {
                return res.sendStatus(403);
            }

            // Token is valid, attach user to request data
            req.user = user;
            next();
        });
    } else {
        // No authorisation header provided
        res.sendStatus(401);
    }
}

// Connect to database
mongoose.connect('mongodb+srv://dbAdmin:dCnMODYoqRUsj1A8@sit314.g3dfm.mongodb.net/iotLighting?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.info('INFO\tWeb API connected to database');
    })
    .catch((err) => {
        console.error(`ERROR\t${err}`);
    })


const app = express()

app.use(bodyparser.json())

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password }, (error, user) => {
        
        if (error) {
            res.status(500);
            return res.json({ error });
        }

        if (user) {
            const token = jwt.sign({ 'username': user.username }, tokenKey);
            return res.json({ token });
        } else {
            res.status(422);
            return res.send('Incorrect username or password.');
        }

    })
})

app.get('/devices', authoriseRequest, (req, res) => {
    Device.find({}, (error, devices) => {
        return error
            ? res.json( {error} )
            : res.json( {devices} );
    })
})

app.get('/devices/:nodeId', authoriseRequest, (req, res) => {
    Device.findOne({ nodeId }, (error, device) => {
        if (error) {
            res.status(500);
            return res.json({ error });
        }
        
        if (!device) {
            return res.sendStatus(404);
        }
        
        return res.json({ device });
    })
})

app.post('/devices/:nodeId', authoriseRequest, (req, res) => {
    const { nodeId } = req.params;
    const { state } = req.body;
    if (state != 0 && state != 1) {
        return res.sendStatus(400);
    }

    axios.post(`http://localhost:4001/${nodeId}/control`, { state })
        .then( response => {
            return res.sendStatus(200);
        })
        .catch( error => {
            return res.sendStatus(error.response.status);
        });
})

app.listen(4000, () => {
    console.info('INFO\tWeb API listening on port 4000');
})
