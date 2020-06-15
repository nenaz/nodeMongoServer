
import { execFile } from 'child_process';
import { get } from 'lodash';
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
    dataBase.collection('films').find().sort({ fileName: 1 }).toArray().then((result) => {
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

  app.get('/get-pic/229.jpg', (req, res) => {
    res.sendFile('./assets/301.webp');
  });

  app.get('/', (req, res) => {
    res.send('./assets/301.webp');
  });

  app.post('/auth-job', (req, res) => {
    const { phoneNumber } = req.body;
    console.log('auth-job');
    console.log('phoneNumber', phoneNumber);
    let result = {};
    if (phoneNumber === '79999999999') {
      result.token = 'no offer';
    } else {
      result.token = 'bla-bla';
    }
    setTimeout(() => {
      res.send(result);
    }, 2000);
  });

  app.post('/sign-session', (req, res) => {
    // const { phoneNumber } = req.body;
    console.log('sign-session');
    setTimeout(() => {
      res.send({
        session: 'sign-session',
      });
    }, 2000);
  });

  app.post('/sign-anything', (req, res) => {
    const { code } = req.body;
    console.log('sign-virt-card', code);
    setTimeout(() => {
      res.send({
        signResultObj: 'success',
      });
    }, 2000);
  });

  app.post('/sign-credit', (req, res) => {
    const { code } = req.body;
    console.log('sign-credit', code);
    setTimeout(() => {
      res.send({
        signResultObj: 'success',
      });
    }, 2000);
  });

  app.post('/job-get-balance', (req, res) => {
    const authToken = get(req, 'headers.authorization', '');
    const total = 225000.00;
    const credit = 0.00;
    const balance = total - credit;
    console.log('job-get-balance', total);
    if (authToken) {
      setTimeout(() => {
        res.send({
          baseLimit: total,
          currentCredit: credit,
          currentBalance: balance,
        });
      }, 2000);
    } else {
      res.sendStatus(401);
    }
  });
  
  app.post('/get-documents', (req, res) => {
    console.log('get-documents');
    const { type } = req.body;
    console.log('type', type);
    // const authToken = get(req, 'headers.authorization', '');
    if (type === 'credit') {
      res.send({
        documents: [
          {
            name: 'Уведомление о полной стоимости кредита',
            link: 'https://docs.google.com/gview?embedded=true&url=https://supereyes.ru/img/instructions/JDS6600%20_manual.pdf',
          },
          {
            name: 'Кредитный договор',
            link: 'https://docs.google.com/gview?embedded=true&url=https://master.kratonshop.ru/instrukciya.pdf',
          },
          {
            name: 'График платежей',
            link: 'https://docs.google.com/gview?embedded=true&url=https://yadi.sk/i/J4nSJtTlkLLP4',
          },
          {
            name: 'Договор страхования',
            link: 'https://docs.google.com/gview?embedded=true&url=https://www.oc-praktikum.de/nop/ru/articles/pdf/OperatingInstructions_ru.pdf',
          },
        ],
      });
    } else if (type === 'vcard') {
      res.send({
        documents: [
          {
            name: 'Документ по виртуальной карте',
            link: 'https://docs.google.com/gview?embedded=true&url=https://supereyes.ru/img/instructions/JDS6600%20_manual.pdf',
          },
        ],
      });
    } else {
      res.sendStatus(401);
    }
  });

  app.post('/offer-get', (req, res) => {
    console.log(req.headers.authorization);
    const authToken = get(req, 'headers.authorization', '');
    if (authToken === 'no offer') {
      res.send({
        type: 'error',
        text: 'sorry you no offer',
      });
    } else {
      res.send({
        type: 'success',
        text: 'Вам предоставлен кредит на покупки',
        amount: 225000,
      })
    }
  });
};
