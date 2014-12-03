'use strict';

/**
 * @ngdoc function
 * @name commonsCloudFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commonsCloudFormApp
 */
angular.module('commonsCloudFormApp')
  .controller('FormCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$timeout', '$location', '$http', 'template', 'fields', 'Feature', 'geolocation', 'leafletData', 'Site', '$route', 'moment', function ($rootScope, $scope, $routeParams, $window, $timeout, $location, $http, template, fields, Feature, geolocation, leafletData, Site, $route, moment) {

    $scope.page = {
      template: '/views/form.html'
    };

    $scope.template = template;
    $scope.template.fields = fields;

    console.log('$scope.template', $scope.template);

    $scope.feature = new Feature();
    $scope.feature.status = 'crowd';
    $scope.files = [];


    //
    // Define a layer to add geometries to later
    //
    var featureGroup = new L.FeatureGroup();

    $scope.map = {
      defaults: {
        scrollWheelZoom: false,
        zoomControl: false,
        maxZoom: 19
      },
      layers: {
        baselayers: {
          basemap: {
            name: 'Satellite Imagery',
            url: 'https://{s}.tiles.mapbox.com/v3/' + Site.settings.services.mapbox.satellite + '/{z}/{x}/{y}.png',
            type: 'xyz',
            layerOptions: {
              attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          }
        }
      },
      center: {
        lat: ($scope.feature.geometry !== null && $scope.feature.geometry !== undefined) ? $scope.feature.geometry.geometries[0].coordinates[1] : 38.362,
        lng: ($scope.feature.geometry !== null && $scope.feature.geometry !== undefined) ? $scope.feature.geometry.geometries[0].coordinates[0] : -81.119, 
        zoom: 6
      },
      markers: {
        LandRiverSegment: {
          lat: ($scope.feature.geometry !== null && $scope.feature.geometry !== undefined) ? $scope.feature.geometry.geometries[0].coordinates[1] : 38.362,
          lng: ($scope.feature.geometry !== null && $scope.feature.geometry !== undefined) ? $scope.feature.geometry.geometries[0].coordinates[0] : -81.119, 
          focus: false,
          draggable: true,
          icon: {
            iconUrl: '//api.tiles.mapbox.com/v4/marker/pin-l+b1c11d.png?access_token=' + Site.settings.services.mapbox.access_token,
            iconRetinaUrl: '//api.tiles.mapbox.com/v4/marker/pin-l+b1c11d@2x.png?access_token=' + Site.settings.services.mapbox.access_token,
            iconSize: [38, 90],
            iconAnchor: [18, 44],
            popupAnchor: [0, 0]
          }
        }
      }
    };

    //
    // Define our map interactions via the Angular Leaflet Directive
    //
    leafletData.getMap().then(function(map) {

      //
      // Move Zoom Control position to bottom/right
      //
      new L.Control.Zoom({
        position: 'bottomright'
      }).addTo(map);

      //
      // Listen for when the user drops the pin on a new geography
      //
      $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
        
        $scope.feature.geometry = {
          type: 'GeometryCollection',
          geometries: []
        };
        $scope.feature.geometry.geometries.push({
          type: 'Point',
          coordinates: [
            args.leafletEvent.target._latlng.lng,
            args.leafletEvent.target._latlng.lat
          ]
        });


      });
    });

    $scope.data = {
      process: function() {

        //
        // 1. Create a new FormData object
        //
        var data = new FormData();

        //
        // 2. Process, field by field, all of the data from the form and add it to the FormData object
        //
        angular.forEach($scope.template.fields, function(field, $index) {
          if (field.data_type === 'relationship') {
            var key = field.relationship,
                value = ($scope.feature[field.relationship] !== undefined && $scope.feature[field.relationship] !== null) ? '[{"id":' + $scope.feature[field.relationship] + '}]' : null;

            if (value !== null) {
              console.log('relationship found', key, value)
              data.append(key, value);
            }
          } else if (field.data_type === 'date') {
            
            var clean_date = moment($scope.feature[field.name]);

            var key = field.name,
                value = clean_date.format('l');
            data.append(key, value);
          } else if (field.data_type !== 'file') {
            // Process all other fields such as text, integer, and boolean
            var key = field.name,
                value = ($scope.feature[field.name] !== undefined && $scope.feature[field.name] !== null) ? $scope.feature[field.name] : null;

            if (value !== null) {
              data.append(key, value);
            }
          }
        });

        //
        // 3. Handle the geometry separately from the rest of the fields
        //
        data.append('geometry', JSON.stringify($scope.feature.geometry));

        //
        // 4. Process the attached files
        //
        angular.forEach($scope.files, function(file, $index) {
          console.log('file.field', file.field);
          data.append(file.field, file.file);
        });

        //
        // 5. Return the finalized FormData object ready for submission
        //
        return data;
      },
      save: function() {

        var data = $scope.data.process();

        $http.post('//api.commonscloud.org/v2/' + $scope.template.storage + '.json', data, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          })
          .success(function(response){
            console.log('$scope.data.save::response', response);
            $route.reload();
          })
          .error(function(error){
            console.error('$scope.data.save::error', error);
          });

      }
    };

    $scope.onFileRemove = function(file, field_name, index) {
      $scope.files.splice(index, 1);
    };

    $scope.onFileSelect = function(files, field_name) {

      console.log('files', files)

      console.log('field_name', field_name)

      angular.forEach(files, function(file, index) {
        // Check to see if we can load previews
        if (window.FileReader && file.type.indexOf('image') > -1) {

          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (event) {
            file.preview = event.target.result;
            $scope.files.push({
              'field': field_name,
              'file': file
            });
            $scope.$apply();
          };
        } else {
          $scope.files.push({
            'field': field_name,
            'file': file
          });
          $scope.$apply();
        }
      });

    };


  }]);
