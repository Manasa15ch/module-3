(function () {
  'use strict';

  // AngularJS Module
  angular.module('NarrowItDownApp', [])

    // Controller
    .controller('NarrowItDownController', NarrowItDownController)
    // Service
    .service('MenuSearchService', MenuSearchService)
    // Directive
    .directive('foundItems', FoundItemsDirective);

  // Controller Implementation
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = '';
    ctrl.found = [];

    // Function to narrow down the menu items
    ctrl.narrowItDown = function () {
      if (ctrl.searchTerm) {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (foundItems) {
            ctrl.found = foundItems;
          });
      } else {
        ctrl.found = [];
      }
    };

    // Function to remove an item from the found list
    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  // Service Implementation
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    this.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
      }).then(function (result) {
        var foundItems = [];
        var menuItems = result.data;

        // Loop through categories and items to find matches
        for (var category in menuItems) {
          if (menuItems.hasOwnProperty(category)) {
            var items = menuItems[category].menu_items;
            for (var i = 0; i < items.length; i++) {
              if (items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                foundItems.push(items[i]);
              }
            }
          }
        }

        return foundItems;
      });
    };
  }

  // Directive Implementation
  function FoundItemsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };
  }
})();
