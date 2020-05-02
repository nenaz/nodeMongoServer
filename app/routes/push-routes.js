import { ObjectID } from 'mongodb';
import { pushMessage } from './push';

export const pushRoutes = (app, dataBase) => {
  app.post('/create-user', (req, res) => {
    const {
      createDate,
      endpoint,
      id,
      token,
      updateDate,
      user,
    } = req.body;
    
    // console.log(req.body);
    dataBase.collection('subscription').insert({
      createDate,
      endpoint,
      id,
      token,
      updateDate,
      user,
    }, (err, result) => {
        if (err) {
            res.resd({ 'error': err });
        } else {
            res.send(result.ops[0]);
        }
    });
  });

  app.post('/notify', (req, res) => {
    pushMessage(req, res, dataBase);
  });

  app.post('/subscription', (req, res) => {
    // pushMessage(req, res, dataBase);
    const id = { '_id': new ObjectID(req.body.userId) };
    const updateObj = {
      keys: req.body.subscription.keys,
    };
    dataBase.collection('subscription').update(id, { $set: updateObj }, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      }
      else {
        res.send(result);
      }
    });
  });
};
