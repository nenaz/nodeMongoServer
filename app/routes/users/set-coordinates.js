import { ObjectID } from 'mongodb'
import { authorization } from '../auth/auth';

export const setOnlineCoordinates = (req, res, db, username) => {
  // const username = authorization(req, res);

  return new Promise((resolve, reject) => {
    console.log('setOnlineCoordinates');
    db.collection('users').
      find({
        username: username,
      }).
      toArray().
      then((data) => {
        // console.log('data', data);
        data.map((item) => {
          const details = { '_id': new ObjectID(item._id) };
          const newCoord = {
            coordinates: {
              lat: req.body.latitude,
              lon: req.body.longitude,
            }
          };
          db.collection('users').update(details, { $set: newCoord }, (err, rUpdate) => {
            // console.log('rUpdate', rUpdate);
            if (err) {
              reject({ Error: err });
            }
            resolve(rUpdate);
          })
        })
      });
  });
};
