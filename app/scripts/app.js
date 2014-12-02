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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '//app.commonscloud.org/'
      })
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
      })
      .otherwise({
        redirectTo: '/'
      });
  });
