'use strict';

var invariant = require('invariant');
var INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE = 'INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE';
function assertInternalActorIdentifier(actorIdentifier) {
  !(actorIdentifier === INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected to use only internal version of the `actorIdentifier`. "%s" was provided.', actorIdentifier) : invariant(false) : void 0;
}
module.exports = {
  assertInternalActorIdentifier: assertInternalActorIdentifier,
  getActorIdentifier: function getActorIdentifier(actorID) {
    return actorID;
  },
  getDefaultActorIdentifier: function getDefaultActorIdentifier() {
    throw new Error('Not Implemented');
  },
  INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE: INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE
};