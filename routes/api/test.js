// Twilio Credentials
const accountSid = "AC6ceb2d7542c032eaa279d41eb9e03568";
const authToken = "bd8f7a4470bb1ebc47cf4e80ed75cbcc";
// require the Twilio module and create a REST client
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    to: "+33638503252",
    from: "GearHunter",
    body: "Un nouvel item à été trouvé sur le bot ! ",
    mediaUrl: "https://gearhunter.herokuapp.com/dashboard/items"
  })
  .then(message => console.log(message.sid));
console.log("ok");
