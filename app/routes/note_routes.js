import { ObjectID } from 'mongodb'
import db from '../../config/db'
import dataBase from '../../db'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'
import config from '../../config/db'
import { COLORS } from '../../config/consts'

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
        if (obj.consider !== undefined) {
            editObj.consider = obj.consider;
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
    db.collection('accounts').update(details, { $set: editObj }, (err, result) => {
        if (err) {
            return { 'error': 'An error has occurred' };
        }
        else {
            return result;
        }
    });
}

function formatingDataForChart(data) {
    const fData = []
    for (let i = 0; i < 10; i += 1) {
        let sum = 0;
        data.map(item => {
            if (item.categoryId[0] * 1 === i && item.typeOperation === "0") {
                sum += item.amount * 1
            }
        })
        if (sum) {
            fData.push({
                id: i,
                value: sum,
                color: COLORS['color' + i]
            })
        }
    }
    return fData
}

function updateOperations(data, db, username, res) {
    data.map((item) => {
        const editObj = {
            username,
        }
        const details = { '_id': new ObjectID(item._id) };
        db.collection('operations').update(details, { $set: editObj }, (err, rUpdate) => {
            if (err) {
                return { 'error': 'An error has occurred' };
            } else {
                return true
            }
        })
    })
}

export default function (app, db) {
    app.post('/addOperation', (req, res) => {
        const username = authorization(req, res)
        const operations = {
            amount: req.body.amount,
            currency: req.body.currency,
            data: req.body.data,
            date: req.body.date,
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
        const query = {
            username,
        }
        db.collection('operations').
            find(query).
            sort({ "_id": -1 }).
            limit(limit).
            toArray().
            then((result) => {
                res.send(result);
            }, (err) => {
                console.log('Error:', err);
            });
    });

    app.post('/getOperLastMonth', (req, res) => {
        const username = authorization(req, res)
        db.collection('operations').
        find({
            username,
            "date": {
                $gte: req.body.nowMonthDate
            }
        }).
        toArray().
        then((data) => {
            res.send(formatingDataForChart(data))
        }, (err) => {
            res.send(err)
        })
    })

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
        console.log('dirname', __dirname);
        // console.log('path.dirname', path.dirname);
        if (!req.body.username && !req.body.password) {
            // console.log('2')
            return res.sendStatus(400);
        }
        // console.log('3')
        const username = req.body.username;
        if (req.body.passcode) {
            const passcode = req.body.passcode
            db.collection('users').
            find({
                username
            }).
            toArray().
            then((result) => {
                if (!result.length) {
                    return res.sendStatus(401);
                }
                bcrypt.compare(passcode, result[0].passcode, (err, valid) => {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    if (!valid) {
                        return res.sendStatus(401);
                    }
                    const token = jwt.encode({ username: result[0].username }, config.secret);
                    res.send({
                        token,
                        auth: true
                    });
                })
            }, (err) => {
                return res.sendStatus(500);
            })
        } else {
            // console.log('4')
            const password = req.body.password
            db.collection('users').
            find({
                username: username,
            }).
            toArray().
            then((result) => {
                // console.log('5')
                if (!result.length) {
                    return res.sendStatus(401);
                }
                // console.log('6')
                bcrypt.compare(password, result[0].hash, (err, valid) => {
                    // console.log('7')
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
        };
        const password = req.body.password
        bcrypt.hash(password, 10, (err, hash) => {
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
                version: req.body.version,
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

    app.post('/setPass', (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400);
        }
        else {
            const username = req.body.username;
            const password = req.body.password;
            const passcode = req.body.passcode;
            db.collection('users').
            find({
                username: username,
            }).
            toArray().
            then((result) => {
                if (!result.length) {
                    return res.sendStatus(401);
                }
                bcrypt.hash(passcode, 10, (err, hash) => {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else {
                        const editObj = {
                            passcode: hash
                        }
                        const details = { '_id': new ObjectID(result[0]._id) };
                        db.collection('users').update(details, { $set: editObj }, (err, rUpdate) => {
                            if (err) {
                                return { 'error': 'An error has occurred' };
                            }
                            else {
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
                            }
                        })
                    }
                })
            }, (err) => {
                return res.sendStatus(500);
            });
        }
    })

    app.post('/setHashData', (req, res) => {
        const obj = req.body
        const data = jwt.encode(obj, config.secret)
        bcrypt.hash(data, 10, (err, hash) => {
            const encodeObj = {
                data,
                hash
            }
            db.collection('news').insert(encodeObj, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                }
                else {
                    res.send(result.ops[0]);
                }
            });
        })
    })

    app.post('/getHashData', (req, res) => {
        db.collection('news').
        find({
            hash: req.body.hash
        }).
        toArray().
        then((result) => {
            const decodeObj = jwt.decode(result[0].data, config.secret)
            res.send(decodeObj);
        })
    })

    app.post('/selectOperations', (req, res) => {
        const newusername = req.body.newusername;
        const username = req.body.username;
        db.collection('operations').
            find({
                username,
            }).
            toArray().
            then((data) => {
                res.send(updateOperations(data, db, newusername, res))
            }, (err) => {
                res.send(err)
            })
    })
}
