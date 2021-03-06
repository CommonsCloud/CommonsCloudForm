'use strict';

angular.module('commonsCloudFormApp')
  .provider('Attachment', function () {

    this.$get = ['$resource', function ($resource) {

      var Attachment = $resource('//api.commonscloud.org/v2/:storage/:featureId/:attachmentStorage/:attachmentId.json', {

      }, {
        delete: {
          method: 'DELETE'
        }
      });

      return Attachment;
    }];

  });
