var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    
    // добавить операцию
    app.post('/addOperation', (req, res) => {
        const operations = {
            amount: req.body.amount,
            currency: req.body.currency,
            data: req.body.data,
            account: req.body.account
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
            balance: req.body.balance,
            currency: req.body.currency,
            pname: req.body.pname
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
        const details = { '_id': new ObjectID(req.body.accountId) };
        const note = { balance: req.body.amount };
        db.collection('accounts').update(details, {$set: note}, (err, result) => {
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
        const note = { balance: type + req.body.accountBalance };
        db.collection('accounts').update(details, note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });
};