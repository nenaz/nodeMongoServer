import { authorization } from '../../auth/auth';

export const getUsers = (req, res, db) => {
  // const username = authorization(req, res)
  return new Promise((resolve, reject) => {
    db.collection('users').
      find({}).
      toArray().
      then((result) => {
        resolve(result);
      }, (err) => {
        reject({ Error: err });
      });
  });
};