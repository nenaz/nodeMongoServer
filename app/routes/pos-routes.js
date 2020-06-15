
require('dotenv').config();

export const posRoutes = (app, dataBase) => {
  app.get('/get-limit', (req, res) => {
    console.log('get-limit');
    res.send({
      allSum: 315010.123,
      currentSum: 181300.00,
    })
  });
  // app.post('/get-movies', (req, res) => {
  //   dataBase.collection('films').find().sort({ fileName: 1 }).toArray().then((result) => {
  //     res.send(checkFiles(result));
  //   }, (err) => {
  //     res.send(err);
  //   });
  // });

  // app.post('/start', (req, res) => {
  //   const { fileName } = req.body;
  //   fun(`${process.env.ROOT_FILMS_FOLDER}${fileName}`);
  //   res.send('RUN');
  // });

  // app.get('/get-pic/229.jpg', (req, res) => {
  //   res.sendFile('./assets/301.webp');
  // })
};
