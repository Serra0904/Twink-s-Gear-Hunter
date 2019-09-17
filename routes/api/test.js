const Nexmo = require("nexmo");

const nexmo = new Nexmo({
  apiKey: "68216ee7",
  apiSecret: "rUiSBsUTKxRDJ49t"
});

const from = "gearhunter";
const to = "33677480293";
const text = "test";

nexmo.message.sendSms(from, to, text);
