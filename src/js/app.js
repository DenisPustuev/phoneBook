var phoneBookApp = angular.module('phoneBookApp', []);

phoneBookApp.controller('phoneBookCtrl', ['$scope', '$http', function($scope, $http){

    $http.get('users.json').success(function (data) {
        $scope.contacts = data;
    });

    $scope.showAnchor = function ($index){

        var thisAnchor = $scope.contactsOrdered[$index].name[0];
        var prevAnchor = $scope.contactsOrdered[$index - 1].name[0];

        return (thisAnchor !== prevAnchor);

    }

}]);