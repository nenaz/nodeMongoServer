import { MongoClient } from "mongodb";
import { urlencoded, json } from "body-parser";
import { url } from "./config/db";
import express from "express";
const app = express();
const PORT = process.env.PORT || 5000
import cookieParser from 'cookie-parser'
import Routes from './app/routes'

app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next();
});
app.use(json());


MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  Routes(app, database);
  app.listen(PORT, () => {
    console.log('We are live on ' + PORT);
  });
})