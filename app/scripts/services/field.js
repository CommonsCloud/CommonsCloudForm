'use strict';

angular.module('commonsCloudFormApp')
  .provider('Field', function () {

    this.$get = ['$resource', 'Feature', function ($resource, Feature) {

      var Field = $resource('//api.commonscloud.org/v2/templates/:templateId/fields/:fieldId.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json',
          transformResponse: function (data, headersGetter) {

            var fields = angular.fromJson(data);

            return fields.response.fields;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json'
        },
        update: {
          method: 'PATCH'
        },
        delete: {
          method: 'DELETE',
          url: '//api.commonscloud.org/v2/templates/:templateId/fields/:fieldId.json'
        }

      });

      Field.PrepareFields = function(fields) {

        var processed_fields = [];

        angular.forEach(fields, function(field, index) {

          if (field.data_type === 'list') {
            field.options = field.options.split(',');
          } else if (field.data_type === 'relationship') {
            console.log('Found relationship for field', field);
            Feature.GetFeatures({
              storage: field.relationship,
              results_per_page: 100
            }).then(function(response) {
              field.options = response.response.features;
            });
          }

          processed_fields.push(field);
        });

        return processed_fields;
      }

      Field.GetPreparedFields = function(templateId) {

        var promise = Field.query({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return Field.PrepareFields(response);
          });

        return promise
      };


      Field.GetFields = function(templateId) {

        var promise = Field.query({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response;
          });

        return promise
      };

      Field.GetField = function(templateId, fieldId) {

        var promise = Field.get({
            templateId: templateId,
            fieldId: fieldId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response.response;
          });

        return promise
      };

      return Field;
    }];

  });
