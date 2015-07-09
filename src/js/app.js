var phoneBookApp = angular.module('phoneBookApp', ['LocalStorageModule']);

phoneBookApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('phoneBookApp')
        .setStorageCookie(0, '/');
});

phoneBookApp.service('getContactsService', ['localStorageService', '$http', function (localStorageService, $http) {

    var allContacts;
    var currentContact;
    var favContacts = [];

    /*local storage logic*/
    /*if (localStorageService.length()) {

        allContacts = localStorageService.get('allContacts');

    } else */if(localStorageService.cookie.get('allContacts') !== null){

        allContacts = localStorageService.cookie.get('allContacts');

    }else {
        $http.get('users.json').success(function (data) {
            allContacts = data;
            //console.log(allContacts, 3)
        });
    }

    console.log(allContacts, 1);
    /*getting active contact and favourites contacts*/

    if(allContacts !== undefined){
        angular.forEach(allContacts, function(obj) {

            if(obj.active == true){
                currentContact = obj;
            }

            if(obj.favorite){
                this.push(obj);
            }
        }, favContacts);

        /*choosing first active contact if app loads at first time*/
        if(currentContact == undefined){
            if(favContacts.length > 0){

                currentContact = favContacts[0];
            }else{
                currentContact = allContacts[0];
            }

            currentContact.active = true;
        }

        this.getAllContacts = function () {
            return allContacts;
        };

        this.getCurrentContact = function () {
            return currentContact;
        };

        this.getFavContacts = function () {
            return favContacts;
        }
    }

}]);

phoneBookApp.controller('phoneBookCtrl', ['$scope', '$filter', 'localStorageService', 'getContactsService', function($scope, $filter, localStorageService, getContactsService){

    $scope.allContacts = $filter('orderBy')(getContactsService.getAllContacts(), 'name');
    console.log($scope.allContacts, 2)

    $scope.currentContact = getContactsService.getCurrentContact();

    $scope.favContacts = getContactsService.getFavContacts();



    $scope.currentContactIsFav = function (currentContact) {
        if(currentContact.favorite){
            return ""
        }else{
            return "-empty"
        }
    };

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

        /*if(localStorageService.isSupported){
            localStorageService.set('allContacts', $scope.allContacts);
        }else{*/
            localStorageService.cookie.set('allContacts', $scope.allContacts);
        //}

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

}]);

