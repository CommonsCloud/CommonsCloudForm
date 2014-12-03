'use strict';

/**
 * @ngdoc overview
 * @name commonsCloudFormApp
 * @description
 * # commonsCloudFormApp
 *
 * Main module of the application.
 */
angular
  .module('commonsCloudFormApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive',
    'angularFileUpload',
    'geolocation',
    'monospaced.elastic',
    'angularMoment'
  ])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    var templateUrl = '/views/main.html';

    $routeProvider
      .when('/form/:templateId', {
        templateUrl: templateUrl,
        controller: 'FormCtrl',
        resolve: {
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetPreparedFields($route.current.params.templateId);
          }
        }
      });

    $locationProvider.html5Mode(true).hashPrefix('!');
  }]);
