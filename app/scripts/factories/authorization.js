'use strict';

/**
 * @ngdoc service
 * @name practiceMonitoringAssessmentApp.authorizationInterceptor
 * @description
 * # authorizationInterceptor
 * Service in the practiceMonitoringAssessmentApp.
 */
angular.module('commonsCloudFormApp')
  .factory('AuthorizationInterceptor', ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {

    return {
      request: function(config) {

        // if (config.headers.Authorization === 'external') {
        //   delete config.headers.Authorization;
        //   return config || $q.when(config);
        // }

        // var session_cookie = ipCookie('COMMONS_SESSION');

        // if (config.url !== '/views/authorize.html' && (session_cookie === 'undefined' || session_cookie === undefined)) {
        //   $location.hash('');
        //   $location.path('/');
        //   return config || $q.when(config);
        // }

        config.headers = config.headers || {};
        // if (session_cookie) {
        //   config.headers.Authorization = 'Bearer ' + session_cookie;
        // }

        config.headers['Cache-Control'] = 'no-cache, max-age=0, must-revalidate';
        console.debug('AuthorizationInterceptor::Request', config || $q.when(config));
        return config || $q.when(config);
      },
      response: function(response) {
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      },
      responseError: function (response) {
        if (response && (response.status === 401 || response === 403)) {
          console.error('Couldn\'t retrieve user information from server., need to redirect and clear cookies');
        }
        if (response && response.status >= 404) {
          console.log('ResponseError', response);
        }
        if (response && response.status >= 500) {
          console.log('ResponseError', response);
        }
        return $q.reject(response);
      }
    };
  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });
