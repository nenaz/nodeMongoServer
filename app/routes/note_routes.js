import { ObjectID } from "mongodb";
import db from "../../config/db";

function testFunc(next) {
    console.log('testFunc')
    next()
}


function authenticate(req, res, next) {
    const obj = {
        result: true,
        id: req.body.id,
    }
    // res.send(obj);
    console.log('authenticate')
    return obj;
}

const editAccount = () => {
    console.log('editAccount')
}

const addAccount = () => {
    console.log('addAccount')
}

const addOperation = () => {
    console.log('addOperation')
}

const deleteAccount = () => {
    console.log('deleteAccount')
}



export default function (app, db) {
    app.use((req, res, next) => {
        const obj = authenticate(req)
        console.dir(obj)
        next(obj);
    });
    // passport.use(new Strategy(
    //     function (username, password, cb) {
    //         db.collection('users').
    //             find({}).
    //             toArray().
    //             then((result) => {
    //                 dataBase.users.findByUsername(result, username, password, function (err, user) {
    //                     if (err) { return cb(err); }
    //                     if (!user) { return cb(null, false); }
    //                     if (user.password != password) { return cb(null, false); }
    //                     return cb(null, user);
    //                 });
    //             }, (err) => {
    //                 console.log('Error:', err);
    //             }
    //             );
    //     })
    // );
    // passport.serializeUser(function (user, cb) {
    //     cb(null, user);
    // });
    // passport.deserializeUser(function (user, cb) {
    //     dataBase.users.findById(user, '5ac35d8b734d1d4f8afa3c2f', function (err, user) {
    //         if (err) { return cb(err); }
    //         cb(null, user);
    //     });
    // });
    app.post('/editAccount', (req, res, next) => {
        // testFunc(next);
        // console.log(req.boby.id);
        next('route');
    }, (req, res, next) => {
        console.log('test2');
        next();
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
            }
            else {
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
            });
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
            }
            else {
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
            });
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
            }
            else {
                res.send(note);
            }
        });
    });
    // обновление названия и сумму счета(редактирование)
    app.post('/editAccount', (req, res, next) => {
        console.log('test3');
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
            }
            else {
                res.send(note);
            }
        });
    });
    app.post('/authUser', function (req, res) {
        const obj = {
            result: true
        };
        res.send(obj);
    });
    app.post('/newUser', (req, res) => {
        const addObj = {
            username: 't1',
            password: 't1'
        };
        db.collection('users').insert(addObj, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });
}