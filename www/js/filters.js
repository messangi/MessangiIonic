angular.module('starter.filters', [])

.filter('beaconType', function() {
  return function(input) {
    var output = input.split('_');
    return output.pop();
  }
});