'use strict';

/**
 * @ngdoc function
 * @name commonsCloudFormApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the commonsCloudFormApp
 */
angular.module('commonsCloudFormApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
