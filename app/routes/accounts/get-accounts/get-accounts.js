import { authorization } from '../../auth/auth';

export const getAccounts = (req, res, db) => {
  const username = authorization(req, res)
  return new Promise((resolve, reject) => {
    db.collection('accounts').
      find({
        username
      }).
      toArray().
      then((result) => {
        resolve(result);
      }, (err) => {
        reject({ Error: err });
      });
  });
};