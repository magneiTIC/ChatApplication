const port=3000
const express = require('express');
const cors = require('cors');
const app = express();
var Pusher = require("pusher");

var pusher = new Pusher({
  appId: "APP_ID",
  key: "APP_KEY",
  secret: "APP_SECRET",
  cluster: "APP_CLUSTER",
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,content-type,content");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
})
app.use(cors(),function(req, res, next) {
    res.header("Access-Control-Allow-Origin,Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,content-type,content",
    "http://localhost:4200"
  );
  });

app.listen(port, ()=>{console.log(`Serveur lancé sur localhost:${port}`)});

// app.post(path:'/api/messages',handlers:async (req:Request <P,ResBody,ReqBody, ReqQuery, Locals>, res:Response<ResBody,Locals>) => {
//      await pusher.trigger("my-channel", "chat", {
//     username: req.body.username,
//.    message: req.body.message. });
//  return  res.json(body:[]);

// })
