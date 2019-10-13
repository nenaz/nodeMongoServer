import jwt from 'jwt-simple'
import config from '../../../config/db';

export const authorization = (req, res) => {
  // if (req.body && req.body.Authorization) {
  console.log('req.body', req.body);
  console.log('req.headers', req.headers);
  const authorization = req.headers.authorization || req.body.authorization;
  // }
  // if (!req.headers['authorization'] && !req.body[Authorization]) {
  // if (!req.headers['authorization']) {
  if (!authorization) {
    console.log('1');
    return res.sendStatus(401);
  }
  try {
    console.log('2');
    // const authorization = req.headers['authorization'];
    const username = jwt.decode(authorization, config.secret).username;
    return req.body.username = username
  }
  catch (err) {
    console.log('3');
    console.log('err', err);
    return res.sendStatus(401);
  }
}
