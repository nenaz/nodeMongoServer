var ObjectID = require('mongodb').ObjectID;
module.exports = function (app, db) {
    // app.get('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     db.collection('notes').findOne(details, (err, item) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(item);
    //         }
    //     });
    // });
    // app.post('/notes', (req, res) => {
    //     const note = { text: req.body.body, title: req.body.text };
    //     db.collection('notes').insert(note, (err, result) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(result.ops[0]);
    //         }
    //     });
    // });
    // app.delete('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     db.collection('notes').remove(details, (err, item) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send('Note ' + id + ' deleted!');
    //         }
    //     });
    // });
    // app.put('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     const note = { text: req.body.body, title: req.body.title };
    //     db.collection('notes').update(details, note, (err, result) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(note);
    //         }
    //     });
    // });
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

    app.post('/getLastFive', (req, res) => {
        console.log('getLastTen');
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

    app.post('/addAccount', (req, res) => {
        console.log('addAccount');
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

    app.post('/getAccounts', (req, res) => {
        console.log('getAccounts');
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

    // app.put('/updateAccount', (req, res) => {
    app.post('/updateAccount', (req, res) => {
        console.log('updateAccount');
        console.log(req.body.id);
        const type = (req.body.typeOperation === '0') ? '-' : '+';
        // const id = req.params.id;
        // const balance = req.params.accountBalance;
        // const typeOperation = req.params.typeOperation;
        const details = { '_id': new ObjectID(req.body.id) };
        const note = {balance: type + req.body.accountBalance };
        db.collection('accounts').update(details, note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });
};