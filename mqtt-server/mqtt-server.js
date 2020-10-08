const mqtt = require('mqtt')
const axios = require('axios')

// Connect to mqtt broker
const client = mqtt.connect('mqtt://broker.hivemq.com:1883')
client.on('connect', () => {
    console.info('INFO\tMQTT-Server connected to mqtt broker')
    client.subscribe('/217603898/+/status')
})

client.on('message', (topic, message) => {
    // Extract id of device from topic
    const id = topic.split('/')[2];
    const { state, update } = JSON.parse(message);

    // Send request to control-server
    sendStatus(id, state || 0, update || 0);
})

// Helper function to send request via control-server API
sendStatus = async (id, state, update) => {
    axios.post(`http://localhost:4001/${id}/status`, {
        'state': state,
        'update': update
    })
}