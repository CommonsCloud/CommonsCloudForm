'use strict';

/**
 * @ngdoc function
 * @name commonsCloudFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commonsCloudFormApp
 */
angular.module('commonsCloudFormApp')
  .controller('FormCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$timeout', '$location', '$http', 'template', 'fields', 'Feature', 'geolocation', 'leafletData', function ($rootScope, $scope, $routeParams, $window, $timeout, $location, $http, template, fields, Feature, geolocation, leafletData) {

    $scope.template = template;
    $scope.template.fields = fields;

    console.log('$scope.template', $scope.template);

  }]);
