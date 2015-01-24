/**
 * Broadcast updates to client when the mirai model changes
 */

'use strict';

var user = require('./user.model');

exports.register = function(socket) {
  user.schema.post('save', function (doc) {
    if (doc.email === "mirai418@me.com") {
      onSave(socket, doc);
    }
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mirai:save', doc);
}
