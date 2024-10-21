'use strict';

function getComponentName(component) {
  return component.displayName || component.name || 'Component';
}
function getContainerName(Component) {
  return 'Relay(' + getComponentName(Component) + ')';
}
module.exports = {
  getComponentName: getComponentName,
  getContainerName: getContainerName
};