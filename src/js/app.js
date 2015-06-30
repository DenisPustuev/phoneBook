var phoneBookApp = angular.module('phoneBookApp', ['LocalStorageModule']);

phoneBookApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('phoneBookApp')
        .setStorageCookie(0, '/');
});

phoneBookApp.controller('phoneBookCtrl', ['$scope', '$http', '$filter', 'localStorageService', function($scope, $http, $filter, localStorageService){

    if(localStorageService.isSupported){

        if(localStorageService.length()){
            //localStorageService.clearAll();
            var allContacts = localStorageService.get('allContacts');

            getContacts(allContacts);

        }else{
            $http.get('users.json').success(function (data) {

                getContacts(data);

            });
        }

    }


    $scope.showAnchor = function ($index){

        var thisAnchor = $scope.allContacts[$index].name[0];
        var prevAnchor;

        if($index >0){
            prevAnchor = $scope.allContacts[$index - 1].name[0];
        }

        return (thisAnchor !== prevAnchor);

    };

    $scope.showFavAnchor = function ($index) {
        if($index == 0) return true;
    };

    $scope.showContactDetails = function (contacts, contact) {

        for(var i = 0; i < contacts.length; i++){
            if(contacts[i].active == true) {
                contacts[i].active = false;
            }
        }
        $scope.currentContact = contact;
        $scope.currentContact.active = true;
        localStorageService.set('allContacts', $scope.allContacts);
    };


    $scope.toggleFavourites = function (currentContact) {

        if(currentContact.favorite){
            $scope.favContacts.splice($scope.favContacts.indexOf(currentContact), 1);
            $scope.favContacts = $filter('orderBy')($scope.favContacts, 'name');
            currentContact.favorite = false;
            localStorageService.set('allContacts', $scope.allContacts);

        }else{
            $scope.favContacts.push(currentContact);
            $scope.favContacts = $filter('orderBy')($scope.favContacts, 'name');
            currentContact.favorite = true;
            localStorageService.set('allContacts', $scope.allContacts);
        }

    };

    function getContacts(contactsObj) {
        $scope.allContacts = $filter('orderBy')(contactsObj, 'name');

        $scope.favContacts = [];

        angular.forEach($scope.allContacts, function(obj) {

            if(obj.active == true){
                $scope.currentContact = obj;
            }

            if(obj.favorite){
                this.push(obj);
            }
        }, $scope.favContacts);

        if($scope.currentContact == undefined){
            if($scope.favContacts.length > 0){

                $scope.currentContact = $scope.favContacts[0];
            }else{
                $scope.currentContact = $scope.allContacts[0];
            }

            $scope.currentContact.active = true;
        }

        $scope.currentContactIsFav = function (currentContact) {
            if(currentContact.favorite){
                return ""
            }else{
                return "-empty"
            }
        }
    }

}]);