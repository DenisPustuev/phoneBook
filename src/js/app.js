var phoneBookApp = angular.module('phoneBookApp', []);

phoneBookApp.controller('phoneBookCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){

    $http.get('users.json').success(function (data) {
        $scope.contacts = $filter('orderBy')(data, 'name');
        $scope.currentContact = $scope.contacts[0];
    });

    $scope.showAnchor = function ($index){

        var thisAnchor = $scope.contacts[$index].name[0];
        var prevAnchor;

        if($index >0){
            prevAnchor = $scope.contacts[$index - 1].name[0];
        }

        return (thisAnchor !== prevAnchor);

    };

    $scope.showContactDetails = function (contact) {
        $scope.currentContact = contact;
    }
}]);