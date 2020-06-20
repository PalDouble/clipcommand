// Standalone Twitch Clip Command

let twitchUsername: string = "" 
let twitchPassword: string = ""
let targetChannel: string = ""
let targetID: string = ""
let userID: string = ""
let userOAuth: string = ""

//----------
// Twitch Connection

declare function require(name: string)
const tmi = require("tmi.js");
const request = require("request")

var config = {
  options: {
      debug: false
  },
  connection: {
      cluster: "aws",
      reconnect: true
  },
  identity: {
      username: twitchUsername,
      password: twitchPassword
  },
  channels: [targetChannel]
}

//----------


const twitch = new tmi.client(config)
twitch.connect()

twitch.on("connected", (address, port) => {
  console.log("Connected to Twitch on " + address + ":" + port)
})

//----------
// Command and Clip Creation

twitch.on("message", (channel, user, message, self) => {
  if (message === "!clip" && user.mod) {
    createClip(channel)
  }
})

function createClip(channel) {
  console.log("Creating Clip")
  let options = {
    url: "https://api.twitch.tv/helix/clips?broadcaster_id=" + targetID,
    method: "POST",
    headers: {
      "Client-ID": userID,
      "Authorization": "Bearer " + userOAuth
    }
  }
  request(options, function (err, res, body) {
    if (err) {
      twitch.say(channel, "An API error occured while attempting to create a clip.")
    }
    let parsedData = JSON.parse(body)
    twitch.say(channel,"https://clips.twitch.tv/" + parsedData.data[0].id)
  });
}
