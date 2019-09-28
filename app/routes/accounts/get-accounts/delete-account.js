import { ObjectID } from 'mongodb'
import { authorization } from '../../auth/auth';

export const deleteAccount = (req, res, db) => {
  const username = authorization(req, res)
  const dFrom = { '_id': new ObjectID(req.body.idFrom) };

  return new Promise((resolve, reject) => {
    db.collection('accounts').remove(dFrom, (err, result) => {
      if (err) {
        reject({ 'error': 'An error has occurred' });
        return;
      }
      resolve(true);
    })
  });
};
