import webpush from 'web-push';
import { response } from 'express';

const vapidKeys = webpush.generateVAPIDKeys();
webpush.setGCMAPIKey('AIzaSyBOWCi6YL01wPgvyPS8OqFqlOmc-JcO0fs');
// webpush.setVapidDetails(
//   'mailto:example@yourdomain.org',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

const getUsersToPush = (db, user) => {
  return new Promise((resolve, reject) => {
    db.collection('subscription').find({
      user,
    }).toArray().then((result) => {
      resolve(result[0]);
    }, (err) => {
      reject({ Error: err });
    });
  });
};

// push-message
export const pushMessage = (req, res, db) => {
  console.log('vapidKeys', vapidKeys);
  console.log(req.body);
  const {
    user,
    message,
  } = req.body;

  getUsersToPush(db, user).then((result) => {
    console.log('result', result);
    const {
      endpoint,
      keys,
    } = result;
    const pushSubscription = {
      endpoint,
      keys,
    };
    const payload = message;
    const options = {
      gcmAPIKey: 'AIzaSyBOWCi6YL01wPgvyPS8OqFqlOmc-JcO0fs',
      vapidDetails: {
        subject: 'mailto:example_email@example.com',
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
      },
      TTL: 60,
      headers: {
        'Authorization': 'key=AAAAbsFErtM:APA91bFkgIjelz-22rgaIMnoX6BPucufCNQmdEIAVJNyTy9k3pjugeJTkDshiJPgoqgZHVtSVZbmBAQrJmZfMjpI5eKVSiuUYnm9jTL1gfwTcbIJLUJafCYwY_63paF4cqU-GJ9nf2tL',
      },
    };
    
    webpush.sendNotification(
      pushSubscription,
      payload,
      options
    ).then((response) => {
      console.log('response', response);
      res.send(vapidKeys);
    }).catch((error) => {
      console.log('push error', error);
      res.send(error);
    });
    // webpush.sendNotification(pushSubscription, message);
    
  }).catch((error) => {
    // console.log(error);
    res.send(error);
  });
  
  

  
  // webpush.sendNotification(pushSubscription, message);
  
};
