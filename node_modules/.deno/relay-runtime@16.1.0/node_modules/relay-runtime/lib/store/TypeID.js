'use strict';

var PREFIX = 'client:__type:';
var TYPE_SCHEMA_TYPE = '__TypeSchema';
function generateTypeID(typeName) {
  return PREFIX + typeName;
}
function isTypeID(id) {
  return id.indexOf(PREFIX) === 0;
}
module.exports = {
  generateTypeID: generateTypeID,
  isTypeID: isTypeID,
  TYPE_SCHEMA_TYPE: TYPE_SCHEMA_TYPE
};