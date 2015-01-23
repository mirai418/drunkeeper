/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var user = require('./user.model');

exports.register = function(socket) {
  user.schema.post('save', function (doc) {
    console.log('schema save!');
    if (doc.email === "mirai418@me.com") {
      onSave(socket, doc);
    }
  });
}

function onSave(socket, doc, cb) {
  console.log('onSave');
  socket.emit('mirai:save', doc);
}
