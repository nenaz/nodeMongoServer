import { ObjectID } from 'mongodb'
import { authorization } from '../auth/auth';

export const setOnline = (req, res, db) => {
  const username = authorization(req, res);

  return new Promise((resolve, reject) => {
    console.log('setOnline');
    db.collection('users').
      find({
        username: username,
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
