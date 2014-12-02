'use strict';

/**
 * @ngdoc function
 * @name commonsCloudFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commonsCloudFormApp
 */
angular.module('commonsCloudFormApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
