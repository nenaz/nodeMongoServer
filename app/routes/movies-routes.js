
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
    const result = {
      ...item,
      isAvailability: files.includes(item.fileName),
    }
    try {
      const imageData = fs.readFileSync(`${process.env.ROOT_IMAGE_FOLDER}${item.filmId}.webp`);
      result.imageBase64 = 'data:image/webp;base64,' + imageData.toString('base64');

    } catch(err) {
      console.log('no such file or directory', item.filmId);
    }
    return result;
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
    fun(`${process.env.ROOT_FILMS_FOLDER}${fileName}`);
    res.send('RUN');
  });
};
