import jwt from 'jwt-simple'
import config from '../../../config/db';

export const authorization = (req, res) => {
  if (!req.headers['authorization']) {
    return res.sendStatus(401);
  }
  try {
    const username = jwt.decode(req.headers['authorization'], config.secret).username;
    return req.body.username = username
  }
  catch (err) {
    return res.sendStatus(401);
  }
}
