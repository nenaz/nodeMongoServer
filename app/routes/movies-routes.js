
import { execFile } from 'child_process';
import fs from 'fs';
require('dotenv').config();

const fun = (name) => {
  execFile('start.bat', [name], (err, data) => {  
    console.log(err)
    console.log(data.toString());                       
   });  
}

const checkFiles = (data) => {
  const files = fs.readdirSync(process.env.ROOT_FILMS_FOLDER);
  const dataMod = data.map((item) => {
    return {
      ...item,
      isAvailability: files.includes(item.fileName),
    };
  });
  return dataMod;
}; 

export const moviesRoutes = (app, dataBase) => {
  app.post('/get-movies', (req, res) => {
    dataBase.collection('films').find().toArray().then((result) => {
      res.send(checkFiles(result));
    }, (err) => {
      res.send(err);
    });
  });
  app.post('/start', (req, res) => {
    const { fileName } = req.body;
    fun(fileName);
    res.send('RUN');
  });
};
