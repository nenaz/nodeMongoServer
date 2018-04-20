// var records = [
//     { id: 1, username: 'admin', password: 'admin', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
//   , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
// ];

exports.findById = function (user, _id, cb) {
  process.nextTick(function() {
    if (user.id === _id) {
      cb(null, user);
    }
  });
}

exports.findByUsername = function(data, username, password, cb) {
  process.nextTick(function() {
    for (var i = 0, len = data.length; i < len; i++) {
      var record = data[i];
      if (record.login === username &&
        record.password === password
      ) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
