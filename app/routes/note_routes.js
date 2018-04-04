var ObjectID = require('mongodb').ObjectID;

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../../config/db');
var dataBase = require('../../db');

// passport.use(new Strategy(
//     function (username, password, cb) {
//         dataBase.users.findByUsername(username, function (err, user) {
//             if (err) { return cb(err); }
//             if (!user) { return cb(null, false); }
//             if (user.password != password) { return cb(null, false); }
//             return cb(null, user);
//         });
//     })
// );


// passport.serializeUser(function (user, cb) {
//     console.log('user')
//     console.log(user)
//     cb(null, user.id);
// });

// passport.deserializeUser(function (id, cb) {
//     dataBase.users.findById(id, function (err, user) {
//         if (err) { return cb(err); }
//         cb(null, user);
//     });
// });
const data = {};

module.exports = function (app, db) {
    passport.use(new Strategy(
        function (username, password, cb) {
            db.collection('users').
                find({}).
                toArray().
                then((result) => {
                    dataBase.users.findByUsername(result, username, password, function (err, user) {
                        if (err) { return cb(err); }
                        if (!user) { return cb(null, false); }
                        if (user.password != password) { return cb(null, false); }
                        return cb(null, user);
                    });
                }, (err) => {
                    console.log('Error:', err);
                }
                );
        })
    );

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (user, cb) {
        dataBase.users.findById(user, '5ac35d8b734d1d4f8afa3c2f', function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

    // добавить операцию
    app.post('/addOperation', (req, res) => {
        const operations = {
            amount: req.body.amount,
            currency: req.body.currency,
            data: req.body.data,
            account: req.body.id,
            operCoord: req.body.operCoord,
            typeOperation: req.body.typeOperation,
            categoryId: req.body.categoryId,
            typeOperation: req.body.typeOperation,
        };
        db.collection('operations').insert(operations, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // получить последние 5 операций
    app.post('/getLastFive', (req, res) => {
        db.collection('operations').
            find({}).
            sort({ "_id": -1 }).
            limit(5).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            }
            );
    });

    // добавить счет
    app.post('/addAccount', (req, res) => {
        const account = {
            name: req.body.name,
            amount: req.body.amount,
            currency: req.body.currency,
            pname: req.body.pname,
            date: req.body.date,
            number: req.body.number,
            people: req.body.people,
            id: req.body._id,
        };
        console.log(req.body);
        db.collection('accounts').insert(account, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // получить список счетов
    app.post('/getAccounts', (req, res) => {
        db.collection('accounts').
            find({}).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            }
            );
    });

    // обновить сумму у счетов после создания операции
    app.post('/updateAccountAmount', (req, res) => {
        const details = { '_id': new ObjectID(req.body.id) };
        const note = {
            amount: req.body.amount,
            name: req.body.name,
            accountDate: req.body.accountDate,
            accountNumber: req.body.accountNumber,
            accountPeople: req.body.accountPeople,
        };
        db.collection('accounts').update(details, { $set: note }, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });

    // обновление названия и сумму счета(редактирование)
    app.post('/EditAccount', (req, res) => {
        const details = { '_id': new ObjectID(req.body.id) };
        const note = {
            amount: req.body.amount,
            name: req.body.name || '',
            accountDate: req.body.accountDate || '',
            accountNumber: req.body.accountNumber || '',
            accountPeople: req.body.accountPeople || '',
        };
        db.collection('accounts').update(details, note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });

    app.post('/authUser', passport.authenticate('local'),
        function (req, res) {
            const obj = {
                result: true
            }
            res.send(obj);
        });
};