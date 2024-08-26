'use strict';

var ACTOR_IDENTIFIER_FIELD_NAME = 'actor_key';
var _require = require('./ActorIdentifier'),
  getActorIdentifier = _require.getActorIdentifier;
function getActorIdentifierFromPayload(payload) {
  if (payload != null && typeof payload === 'object' && typeof payload[ACTOR_IDENTIFIER_FIELD_NAME] === 'string') {
    return getActorIdentifier(payload[ACTOR_IDENTIFIER_FIELD_NAME]);
  }
}
module.exports = {
  ACTOR_IDENTIFIER_FIELD_NAME: ACTOR_IDENTIFIER_FIELD_NAME,
  getActorIdentifierFromPayload: getActorIdentifierFromPayload
};