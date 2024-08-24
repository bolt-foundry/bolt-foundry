'use strict';

function commitLocalUpdate(environment, updater) {
  environment.commitUpdate(updater);
}
module.exports = commitLocalUpdate;