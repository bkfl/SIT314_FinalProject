const mqtt = require('mqtt')
const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const Device = require('./models/device')

// Connect to mqtt broker
const client = mqtt.connect('mqtt://broker.hivemq.com:1883')
client.on('connect', () => {
    console.info('INFO\tControl-Server connected to mqtt broker')
})

// Connect to database
mongoose.connect('mongodb+srv://dbAdmin:dCnMODYoqRUsj1A8@sit314.g3dfm.mongodb.net/iotLighting?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.info('INFO\tControl-Server connected to database');
    })
    .catch((err) => {
        console.error(`ERROR\t${err}`);
    })

const app = express();
app.use(bodyparser.json());

app.post('/:nodeId/status', (req, res) => {
    const { nodeId } = req.params;
    const { state, update } = req.body;
    if ( (state != 0 && state != 1) ||
         (update != 0 && update != 1) ) {
        return res.sendStatus(400);
    }

    Device.findOne({ nodeId }, (error, device) => {
        if (error) {
            res.status(500);
            return res.json({ error });
        }
        
        if (!device) {
            device = new Device();
            device.nodeId = nodeId;
            device.name = "";
            device.location = "";
            device.currentState = 0;
            device.requestedState = 0;
        }

        device.currentState = state;
        if (update) {
            device.requestedState = state;
        }

        device.save( err => {
            if (error) {
                res.status(500);
                return res.json({ error })
            }
        })
        
        if (device.currentState != device.requestedState) {
            sendControlMessage(device.nodeId, device.requestedState);
        }
       
        return res.sendStatus(200);
    });
})

app.post('/:nodeId/control', (req, res) => {
    const { nodeId } = req.params;
    const { state } = req.body;
    if (state != 0 && state != 1) {
        return res.sendStatus(400);
    }

    Device.findOne( { nodeId }, (error, device) => {
        if (error) {
            res.status(500);
            return res.json({ error });
        }
        
        if (!device) {
            return res.sendStatus(404);
        }

        device.requestedState = state;
        device.save( err => {
            if (error) {
                res.status(500);
                return res.json({ error })
            }
        })
        
        if (device.currentState != device.requestedState) {
            sendControlMessage(device.nodeId, device.requestedState);
        }

        return res.sendStatus(200);
    });
})

app.listen(4001)


sendControlMessage = (id, state) => {
    const topic = `/217603898/${id}/control`;
    const message = JSON.stringify({ state });
    client.publish(topic, message);
}