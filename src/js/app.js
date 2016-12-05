(function () {
    var phoneBookApp = angular.module('phoneBookApp', ['LocalStorageModule']);

    phoneBookApp.config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('phoneBookApp')
            .setStorageCookie(0, '/');
    });

    /*https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=angular+wait+until+ajax+get+json+in+service*/
    phoneBookApp.service('getContactsService', ['localStorageService', '$http', function (localStorageService, $http) {

        //var allContacts = null;

        this.getAllContacts = function () {

            /*get contacts from localstorage or cookies or server*/

            if(localStorageService.get('allContacts') !== null) {

             return localStorageService.get('allContacts');

            } else {
               return $http.get('users.json').then(function (result) {
                    return result.data;
                });
            }

        };


    }]);

    phoneBookApp.controller('phoneBookCtrl', ['$scope', '$filter', 'localStorageService', 'getContactsService', function ($scope, $filter, localStorageService, getContactsService) {

        //localStorageService.cookie.clearAll()
        $scope.favContacts = [];

        /*using promise if there isn't saved contacts in localstorage or coockies*/
        getContactsService.getAllContacts().then(function (data) {

            $scope.allContacts = $filter('orderBy')(data, 'name');

            angular.forEach($scope.allContacts, function (obj) {
                if (obj.active == true) {
                    $scope.currentContact = obj;
                }
                if (obj.favorite) {
                    this.push(obj);
                }
            }, $scope.favContacts);

            /*choosing first active contact if app loads at first time*/
            if ($scope.currentContact == undefined) {
                if ($scope.favContacts.length > 0) {
                    $scope.currentContact = $scope.favContacts[0];
                } else {
                    $scope.currentContact = $scope.allContacts[0];
                }
                $scope.currentContact.active = true;
            }

            $scope.currentContactIsFav = function (currentContact) {
                if (currentContact.favorite) {
                    return ""
                } else {
                    return "-empty"
                }
            };

            $scope.showAnchor = function ($index) {

                var thisAnchor = $scope.allContacts[$index].name[0];
                var prevAnchor;

                if ($index > 0) {
                    prevAnchor = $scope.allContacts[$index - 1].name[0];
                }

                return (thisAnchor !== prevAnchor);

            };

            $scope.showFavAnchor = function ($index) {
                if ($index == 0) return true;
            };

            $scope.showContactDetails = function (contacts, contact) {

                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i].active == true) {
                        contacts[i].active = false;
                    }
                }
                $scope.currentContact = contact;
                $scope.currentContact.active = true;

                localStorageService.set('allContacts', $scope.allContacts);


            };

            $scope.toggleFavourites = function (currentContact) {

                if (currentContact.favorite) {
                    $scope.favContacts.splice($scope.favContacts.indexOf(currentContact), 1);
                    $scope.favContacts = $filter('orderBy')($scope.favContacts, 'name');
                    currentContact.favorite = false;
                    localStorageService.set('allContacts', $scope.allContacts);


                } else {
                    $scope.favContacts.push(currentContact);
                    $scope.favContacts = $filter('orderBy')($scope.favContacts, 'name');
                    currentContact.favorite = true;
                    localStorageService.set('allContacts', $scope.allContacts);

                }

            };

        });

        //console.log($scope.allContacts, 2)

        /*getting active contact and favourites contacts*/



        //$scope.currentContact = getContactsService.getCurrentContact();

        //$scope.favContacts = getContactsService.getFavContacts();







    }]);
})();
