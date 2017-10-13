var app;

app = angular.module('fdvis', ['ngRoute']);

app.constant('fdVisualizations',
    [
        {
          group: 'Case Data by Topic',
          name: 'Topics By Product',
          route: '/product',
          href: '/vis/totalByProduct.html'
        },
        {
            group: 'Case Data by Topic',
            name: 'Topics By Component',
            route: '/component',
            href: '/vis/totalByComponent.html'
        },
        {
            group: 'Case Data by Topic',
            name: 'Topics By Sub-Component',
            route: '/subcomponent',
            href: '/vis/totalBySubComponent.html'
        },
        {
            group: 'Case Data by Topic',
            name: 'Topics By Symptom',
            route: '/symptom',
            href: '/vis/totalBySymptom.html'
        },
        {
            group: 'Case Data by Topic',
            name: 'Topics By Cause',
            route: '/cause',
            href: '/vis/totalByCause.html'
        }
    ]
);

app.service('fdVisualizationData', function ($http, $q) {
  var
    products,
    productsPromise,
    components,
    componentsPromise,
    subcomponents,
    subComponentsPromise,
    symptoms,
    symptomsPromise,
    cause,
    causePromise,
    promise,
    service;

    productsPromise = $http.get('/data/product_topics.json').success(function (data) { products = data; return data; });
    componentsPromise = $http.get('/data/component_topics.json').success(function (data) { components = data; return data; });
    subComponentsPromise = $http.get('/data/subcomponent_topics.json').success(function (data) { subcomponents = data; return data; });
    symptomsPromise = $http.get('/data/symptom_topics.json').success(function (data) { symptoms = data; return data; });
    causePromise = $http.get('/data/cause_topics.json').success(function (data) { cause = data; return data; });

    promise = $q.all({ products: productsPromise, components: componentsPromise, subcomponents: subComponentsPromise, symptoms: symptomsPromise, cause: causePromise });
    service = {};

    Object.defineProperties(service, {
        promise : {
            value: promise,
            writable: false
        },
        products: {
            get: function () { return products; }
        },
        components: {
            get: function () { return components; }
        },
        subcomponents: {
            get: function () { return subcomponents; }
        },
        symptoms: {
            get: function () { return symptoms; }
        },
        cause: {
            get: function () { return cause; }
        }
    });

  return service;
});

app.controller('fdNavBar', function fdNavBar($scope, fdVisualizations) {
  $scope.navs = _.groupBy(fdVisualizations, 'group');
});

app.config(function ($routeProvider, fdVisualizations) {
    console.log(fdVisualizations);
  _.each(fdVisualizations, function (vis) {
      console.log(vis);
    $routeProvider.when(vis.route, {
      resolve: {
        VisData: function (fdVisualizationData) { return fdVisualizationData.promise; }
      },
      templateUrl: vis.href
    });
  });

  $routeProvider.otherwise({redirectTo: '/'});
});
