var phoneBookApp = angular.module('phoneBookApp', []);

phoneBookApp.controller('phoneBookCtrl', ['$scope', '$http', function($scope, $http){
   /* var req = {
        method: 'GET',
        dataType: 'jsonp'
    }*/
    $http.get('http://demo.sibers.com/users').success(function (data) {
        $scope.contacts = data;
    })
}]);