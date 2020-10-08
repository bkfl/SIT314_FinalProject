import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
from tkinter import *
import json
import sys

nodeId = "001"

if (len(sys.argv) > 1):
    nodeId = sys.argv[1]

state = False

window = Tk()
window.geometry("300x300")
window.title("IoT Light - NodeId = " + nodeId)
window.configure(bg = "black")

def on_message(client, userdata, message):
    data = json.loads(message.payload)
    global state
    state = data['state']
    client.publish("/217603898/" + nodeId + "/status", json.dumps({"state": state, "update": False}))
    if state:
        window.configure(bg = "white")
    else:
        window.configure(bg = "black")

client = mqtt.Client()
client.on_message=on_message
client.connect("broker.hivemq.com")
client.subscribe("/217603898/" + nodeId + "/control")
client.loop_start() 

def onClick():
    global state
    state = not state
    client.publish("/217603898/" + nodeId + "/status", json.dumps({"state": state, "update": True}))
    if state:
        window.configure(bg = "white")
    else:
        window.configure(bg = "black")

btn = Button(window, text = "On / Off", command = onClick).place(relx=0.5, rely=0.5, anchor=CENTER)



client.publish("/217603898/" + nodeId + "/status", json.dumps({"state": state, "update": False}))

window.mainloop()