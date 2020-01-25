import { ObjectID } from 'mongodb'
import { authorization } from '../auth/auth';

export const setIsWatching = (req, res, db) => {
  return new Promise((resolve, reject) => {
    console.log('isWatching', req.body.isWatching);
    db.collection('users').
      find({
        // _id: req.body._id,
        _id: new ObjectID(req.body._id)
      }).
      toArray().
      then((data) => {
        console.log('data', data);
        data.map((item) => {
          const details = { '_id': new ObjectID(item._id) };
          db.collection('users').update(details, { $set: { isWatching: req.body.isWatching }}, (err, rUpdate) => {
            if (err) {
              reject({ Error: err });
            }
            resolve(rUpdate);
          });
        });
      })
  })
};

export const setOnline = (req, res, db) => {
  // const username = authorization(req, res);

  return new Promise((resolve, reject) => {
    console.log('setOnline', req.body.isOnline);
    db.collection('users').
      find({
        // username: username,
        username: 'nenaz',
      }).
      toArray().
      then((data) => {
        // console.log('data', data);
        data.map((item) => {
          const details = { '_id': new ObjectID(item._id) };
          db.collection('users').update(details, { $set: { isOnline: req.body.isOnline }}, (err, rUpdate) => {
            // console.log('rUpdate', rUpdate);
            if (err) {
              reject({ Error: err });
            }
            resolve(rUpdate);
          })
        })
      })
    // db.collection('accounts').update(details, { $set: note }, (err, result) => {
    //   if (err) {
    //     reject({ Error: err})
    //   }
    //   else {
    //     resolve(result);
    //   }
    // });
  });
};
