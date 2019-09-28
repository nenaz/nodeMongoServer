import express from "express";
import { MongoClient } from "mongodb";
import { urlencoded, json } from "body-parser";
import { url } from "./config/db";
import routes from './app/routes'
import path from 'path';
import http from 'http';
import io from 'socket.io';

global.appRoot = path.resolve(__dirname);

const app = express();
const httpUse = http.createServer(app);
const ioUse = io(httpUse);
const PORT = process.env.PORT || 5000

app.use(urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin");
  next();
});
app.use(json());

ioUse.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('my other event', function(from, msg){
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('message', (from, msg) => {
    console.log(from, 'ssss', msg);
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  routes(app, database);
  app.listen(PORT, () => {
    console.log('We are live on ' + PORT);
  });
})