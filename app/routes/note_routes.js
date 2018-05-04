import { ObjectID } from 'mongodb'
import db from '../../config/db'
import dataBase from '../../db'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'
import config from '../../config/db'

function authorization(req, res) {
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

function editAccount(details, db, obj) {
    let editObj = {}
    console.log(obj.typeOperation)
    if (!obj.transfer) {
        if (obj.accountNameFrom) {
            editObj.accountName = obj.accountNameFrom;
        }
        if (obj.accountNameFrom) {
            editObj.accountName = obj.accountNameFrom;
        }
        if (obj.amount) {
            editObj.amount = obj.amount;
        }
        if (obj.currency) {
            editObj.currency = obj.currency;
        }
        if (obj.accountDate) {
            editObj.accountDate = obj.accountDate;
        }
        if (obj.accountNumber) {
            editObj.accountNumber = obj.accountNumber;
        }
        if (obj.accountPeople) {
            editObj.accountPeople = obj.accountPeople;
        }
        if (obj.amount) {
            if (obj.typeOperation) {
                editObj.amount = obj.typeOperation * 1
                    ? obj.accountFromAmount + obj.amount
                    : obj.accountFromAmount - obj.amount
            } else {
                editObj.amount = obj.amount
            }
        }
    } else {
        editObj.amount = obj.typeOperation
            ? obj.accountToAmount + obj.amount
            : obj.accountFromAmount - obj.amount
    }


    console.dir(editObj)

    // if (obj.transfer) {
    //     const typeOperation = obj.typeOperation
    //     const amount = typeOperation
    //         ? obj.accountToAmount + obj.amount
    //         : obj.accountFromAmount - obj.amount
    //     editObj.amount = amount
    // } else {
        // if (obj.accountNameFrom) {
        //     editObj.accountName = obj.accountNameFrom;
        // }
        // if (obj.accountNameFrom) {
        //     editObj.accountName = obj.accountNameFrom;
        // }
        // if (obj.amount) {
        //     editObj.amount = obj.amount;
        // }
        // if (obj.currency) {
        //     editObj.currency = obj.currency;
        // }
        // if (obj.accountDate) {
        //     editObj.accountDate = obj.accountDate;
        // }
        // if (obj.accountNumber) {
        //     editObj.accountNumber = obj.accountNumber;
        // }
        // if (obj.accountPeople) {
        //     editObj.accountPeople = obj.accountPeople;
        // } 
    // }
    db.collection('accounts').update(details, { $set: editObj }, (err, result) => {
        if (err) {
            return { 'error': 'An error has occurred' };
        }
        else {
            return result;
        }
    });
}

export default function (app, db) {
    app.post('/addOperation', (req, res) => {
        const username = authorization(req, res)
        const operations = {
            amount: req.body.amount,
            currency: req.body.currency,
            data: req.body.data,
            account: req.body.id,
            operCoord: req.body.operCoord,
            typeOperation: req.body.typeOperation,
            categoryId: req.body.categoryId,
            username
        };
        db.collection('operations').insert(operations, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });
    // получить последние 5 операций
    app.post('/getLastFive', (req, res) => {
        const username = authorization(req, res)
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
    // получить последние 5 операций
    app.post('/getOperations', (req, res) => {
        const username = authorization(req, res)
        const limit = req.body.limit !== undefined
            ? req.body.limit
            : 5;
        db.collection('operations').
            find({
                username
            }).
            sort({ "_id": -1 }).
            limit(limit).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            });
    });

    // добавить счет
    app.post('/addAccount', (req, res) => {
        const username = authorization(req, res)
        const account = {
            accountName: req.body.accountName,
            amount: req.body.amount,
            currency: req.body.currency,
            pname: req.body.pname,
            accountDate: req.body.accountDate,
            accountNumber: req.body.accountNumber,
            accountPeople: req.body.accountPeople,
            id: req.body._id,
            username,
        };
        db.collection('accounts').insert(account, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            }
            else {
                if (result.ops.length) {
                    res.send(result.ops[0]);
                } else {
                    res.send({})
                }
                
            }
        });
    });

    // получить список счетов
    app.post('/getAccounts', (req, res) => {
        const username = authorization(req, res)
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
        if (!req.headers['authorization']) {
            return res.sendStatus(401);
        }
        try {
            var username = jwt.decode(req.headers['authorization'], config.secret).username;
        }
        catch (err) {
            console.log(err);
            return res.sendStatus(401);
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
            }
            else {
                res.send(note);
            }
        });
    });

    // обновление названия и сумму счета(редактирование)
    app.post('/editAccount', (req, res, next) => {
        const username = authorization(req, res)
        const dFrom = { '_id': new ObjectID(req.body.idFrom) };
        editAccount(dFrom, db, req.body)
        next()
    }, (req, res) => {
        res.send(true)
    });

    app.post('/authUser', (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400);
        }
        else {
            const username = req.body.username;
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
                        if (err) {
                            return res.sendStatus(500);
                        }
                        if (!valid) {
                            return res.sendStatus(401);
                        }
                        const token = jwt.encode({ username: username }, config.secret);
                        res.send({
                            token,
                            auth: true
                        });
                    });
                }, (err) => {
                    return res.sendStatus(500);
                });
        }
    });

    app.post('/newUser', (req, res, next) => {
        const note = {
            username: req.body.username,
            password: req.body.password,
        };
        bcrypt.hash(note.password, 10, (err, hash) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                note.hash = hash;
                db.collection('users').insert(note, (err, result) => {
                    if (err) {
                        res.send({ 'error': 'An error has occurred' });
                    }
                    else {
                        res.send(result.ops[0]);
                    }
                });
            }
        });
    });

    app.post('/transfer', (req, res, next) => {
        const username = authorization(req, res)
        req.body.typeOperation = 0
        const dFrom = { '_id': new ObjectID(req.body.idFrom) };
        const res1 = editAccount(dFrom, db, req.body)
        next()
    }, (req, res, next) => {
        req.body.typeOperation = 1
        const dTo = { '_id': new ObjectID(req.body.idTo) };
        const res2 = editAccount(dTo, db, req.body)
        next()
    }, (req, res) => {
        res.send(true)
    })

    app.post('/deleteAccount', (req, res) => {
        const username = authorization(req, res)
        const dFrom = { '_id': new ObjectID(req.body.idFrom) };
        db.collection('accounts').remove(dFrom, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            }
            else {
                res.send(true);
            }
        })
    })

    app.post('/whatsnew', (req, res) => {
        const username = authorization(req, res)
        db.collection('news').
            find({
                username,
                version: "1.0.1"
            }).
            toArray().
            then((result) => {
                if (result && result.length) {
                    res.send(result[0]);
                } else {
                    res.send({})
                }
            }, (err) => {
                console.log('Error:', err);
            });
    })

    app.post('/setShowNews', (req, res) => {
        const username = authorization(req, res)
        const id = { '_id': new ObjectID(req.body.id) };
        const obj = {
            show: false
        }
        db.collection('news').update(id, { $set: obj }, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            }
            else {
                console.log(result)
                if (result) {
                    res.send(result)
                } else {
                    res.send({})
                }
            }
        })
    }) 
}