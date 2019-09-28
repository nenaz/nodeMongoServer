import { get } from 'lodash';
import { authorization } from '../../auth/auth';
import uuidv4 from 'uuid/v4';


export const addAccount = (req, res, db) => {
  const username = authorization(req, res);
  const account = {
    ...req.body,
    username,
    id: uuidv4(),
  };
  console.log('account1', account)
  return new Promise((resolve, reject) => {
    db.collection('accounts')
      .insert(account, (err, result) => {
        if (err) {
          console.log('error', err);
          resolve ({ error: 'An error has occurred' });
          return;
        }
        console.log('result_ops', get(result, 'ops'));
        console.log('result', result);
        if (get(result, 'ops.length')) {
          resolve(result.ops[0]);
          return ;
        }
        resolve ({});
      })
  });
};
