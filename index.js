import express from "express";
import { MongoClient } from "mongodb";
import { urlencoded, json } from "body-parser";
import { url } from "./config/db";
import cookieParser from 'cookie-parser'
import routes from './app/routes'

const app = express();
const PORT = process.env.PORT || 5000

app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin");
  next();
});
app.use(json());

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  routes(app, database);
  app.listen(PORT, () => {
    console.log('We are live on ' + PORT);
  });
})