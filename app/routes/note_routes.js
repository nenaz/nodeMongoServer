var ObjectID = require('mongodb').ObjectID;

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../../config/db');
var dataBase = require('../../db');

const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')

var config = require('../../config/db')



module.exports = function (app, db) {
    // добавить операцию
    app.post('/addOperation', (req, res) => {
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
        const operations = {
            amount: req.body.amount,
            currency: req.body.currency,
            data: req.body.data,
            account: req.body.id,
            operCoord: req.body.operCoord,
            typeOperation: req.body.typeOperation,
            categoryId: req.body.categoryId,
            typeOperation: req.body.typeOperation,
            username
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
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
        db.collection('operations').
            find({
                username
            }).
            sort({ "_id": -1 }).
            limit(5).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            });
    });

    // добавить счет
    app.post('/addAccount', (req, res) => {
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
        const account = {
            name: req.body.name,
            amount: req.body.amount,
            currency: req.body.currency,
            pname: req.body.pname,
            date: req.body.date,
            number: req.body.number,
            people: req.body.people,
            id: req.body._id,
            username,
        };
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
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
        db.collection('accounts').
            find({
                username
            }).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            });
    });

    // обновить сумму у счетов после создания операции
    app.post('/updateAccountAmount', (req, res) => {
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
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
        if (!req.headers['authorization']) { return res.sendStatus(401) }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username
        } catch (err) {
            console.log(err)
            return res.sendStatus(401)
        }
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

    app.post('/authUser', (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400) 
        } else {
            const username = req.body.username
            const password = req.body.password;
            db.collection('users').
                find({
                    username: username,
                    password: password,
                }).
                toArray().
                then((result) => {
                    if (!result.length) {
                        return res.sendStatus(401);
                    }
                    bcrypt.compare(password, result[0].hash, (err, valid) => {
                        console.log('valid = '+valid)
                        if (err) {
                            return res.sendStatus(500)
                        }
                        if (!valid) { return res.sendStatus(401) }
                        const token = jwt.encode({ username: username }, config.secret)
                        res.send({
                            token,
                            auth: true
                        })
                    })
                }, (err) => {
                    return res.sendStatus(500)
                });
        }
    });
    
    app.post('/newUser', (req, res, next) => {
        const note = {
            username: req.body.username,
            password: req.body.password,
        }
        bcrypt.hash(note.password, 10, (err, hash) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                note.hash = hash;
                db.collection('users').insert(note, (err, result) => {
                    if (err) {
                        res.send({ 'error': 'An error has occurred' });
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            }
        })
    });
};