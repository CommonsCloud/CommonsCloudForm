'use strict';

/**
 * @ngdoc function
 * @name commonsCloudFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commonsCloudFormApp
 */
angular.module('commonsCloudFormApp')
  .controller('FormCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$timeout', '$location', '$http', 'template', 'fields', 'Feature', 'geolocation', 'leafletData', 'Site', '$route', function ($rootScope, $scope, $routeParams, $window, $timeout, $location, $http, template, fields, Feature, geolocation, leafletData, Site, $route) {

    $scope.page = {
      template: '/views/form.html'
    };

    $scope.template = template;
    $scope.template.fields = fields;

    console.log('$scope.template', $scope.template);

    $scope.feature = new Feature();
    $scope.feature.status = 'public';
    $scope.files = {};


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

    $scope.$watch('feature.geometry', function(o, n) {
      console.log(o, n)
    });

    $scope.processFeature = function () {
      angular.forEach($scope.template.fields, function(field, index) {

        if (field.data_type === 'relationship') {
          console.log('$scope.feature[field.relationship]', $scope.feature[field.relationship]);
          $scope.feature[field.relationship] = [
            {
              id: $scope.feature[field.relationship]
            }
          ];
        }

      });
    };

    $scope.save = function() {

      //
      // Preprocess all relationships prior to save.
      //
      // $scope.feature = $scope.processFeature();

      console.log('$scope.feature to before geometry', $scope.feature);

      $scope.feature.geometry = JSON.stringify($scope.feature.geometry);

      console.log('$scope.feature to save', $scope.feature);

      $scope.feature.$save({
        storage: $scope.template.storage
      }).then(function(response) {

        console.log('here we go', response)

        var fileData = new FormData();

        angular.forEach($scope.files, function(file, index) {
          fileData.append(file.field, file.file);
        });

        Feature.postFiles({
          storage: $scope.template.storage,
          featureId: $scope.feature.id
        }, fileData).$promise.then(function(response) {
          console.log('Update fired', response);
          $scope.feature = response.response;
          $route.reload();
        }, function(error) {
          console.log('Update failed!!!!', error);
        });
      }).then(function(error) {
        console.error(error);
        $route.reload();
      });

    };

  }]);
