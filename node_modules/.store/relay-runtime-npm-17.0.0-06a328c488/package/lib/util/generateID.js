'use strict';

var id = 100000;
function generateID() {
  return id++;
}
module.exports = generateID;