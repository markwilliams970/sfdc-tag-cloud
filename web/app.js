var app;

app = angular.module('fdvis', ['ngRoute']);

app.constant('fdVisualizations', [{
  group: 'Case Data by Topic',
  name: 'Total by Topic',
  route: '/totalByTopic',
  href: '/vis/totalByTopic.html'
}]);

app.service('fdVisualizationData', function ($http, $q) {
  var
    messages,
    topicsPromise,
    users,
    usersPromise,
    promise,
    service;

    topicsPromise = $http.get('/data/topics.json').success(function (data) { topics = data; return data; });
  promise = $q.all({ topics: topicsPromise});
  service = {};

  Object.defineProperties(service, {
    promise : {
      value: promise,
      writable: false
    },
      topics: {
      get: function () { return topics; }
    }
  });

  return service;
});

app.controller('fdNavBar', function fdNavBar($scope, fdVisualizations) {
  $scope.navs = _.groupBy(fdVisualizations, 'group');
});

app.config(function ($routeProvider, fdVisualizations) {
  _.each(fdVisualizations, function (vis) {
    $routeProvider.when(vis.route, {
      resolve: {
        VisData: function (fdVisualizationData) { return fdVisualizationData.promise; }
      },
      templateUrl: vis.href
    });
  });

  $routeProvider.otherwise({redirectTo: '/'});
});
