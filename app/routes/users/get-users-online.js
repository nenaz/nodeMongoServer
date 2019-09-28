import { authorization } from '../../auth/auth';

export const getUsersOnline = (req, res, db) => {
  const username = authorization(req, res)
  return new Promise((resolve, reject) => {
    db.collection('users').
      find({
        isOnline: true
      }).
      toArray().
      then((result) => {
        // resolve(result);
        
      }, (err) => {
        reject({ Error: err });
      });
  });
};