'use strict';

/**
 * @ngdoc service
 * @name practiceMonitoringAssessmentApp.Site
 * @description
 *    Provides site/application specific variables to the entire application
 * Service in the practiceMonitoringAssessmentApp.
 */
angular.module('commonsCloudFormApp')
  .service('Site', function Site() {

    return {
      settings: {
        services: {
          mapbox: {
            access_token: 'pk.eyJ1IjoiZGV2ZWxvcGVkc2ltcGxlIiwiYSI6IlZGVXhnM3MifQ.Q4wmA49ggy9i1rLr8-Mc-w',
            satellite: 'developedsimple.k105bd34',
            terrain: 'developedsimple.k1054a50',
            street: 'developedsimple.k1057ndn',
          }
        },
        links: [
          {
            rel: 'canonical',
            href: 'http://www.nfwf-ma.org/'
          }
        ],
        meta: [
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0'
          },
          {
            name: 'og:locale',
            content: 'en_US'
          },
          {
            name: 'og:type',
            content: 'website'
          },
          {
            name: 'og:site_name',
            content: 'NFWF Monitoring and Assessment'
          },
          {
            name: 'keywords',
            content: ''
          }
        ],
        partners: []
      }
    };

  });
