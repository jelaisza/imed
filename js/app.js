angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'uiGmapgoogle-maps', 'ngCordova', 'ngGPlaces'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.factory('Geolocation', function() {
  return {
    data: {}
  };
})

.factory('Types', function() {
  return [
    {type: 'Park', enabled: false},
    {type: 'Hospital', enabled: true},
    {type: 'lodging', enabled: true},
    {type: 'Museum', enabled: false}
  ];
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

   .state('landing', {
    url: '/landing',
    templateUrl: 'templates/landing.html'

    }
  )
  .state('register', {
    url: '/register',

    templateUrl: 'templates/register.html'

  })

    .state('login', {
    url: '/login',

    templateUrl: 'templates/login.html'

  })

  .state('app.location', {
   url: '/location',
   views: {
     'menuContent': {
       templateUrl: 'templates/location.html',
   controller: 'LocationController as vm'
     }
   }
 })
 .state('app.place', {
   url: '/places/:place_id',
   views: {
     'menuContent': {
       templateUrl: 'templates/place.html',
   controller: 'PlaceController as vm'
     }
   }
 })
.state('app.places', {
   url: '/places',
   views: {
     'menuContent': {
       templateUrl: 'templates/places.html',
   controller: 'PlacesController as vm'
     }
   }
 })

  .state('app.home1', {
  url: '/home1',
  views: {
    'menuContent': {
      templateUrl: 'templates/home1.html',


    }
  }
})



    .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',


      }
    }
  })

    .state('app.addreceta', {
    url: '/addreceta',
    views: {
      'menuContent': {
        templateUrl: 'templates/addreceta.html',

      }
    }
  })




    .state('app.recetalist', {
    url: '/recetalist',
    views: {
      'menuContent': {
        templateUrl: 'templates/recetalist.html',

      }
    }
  })

  .state('app.viewmeds', {
  url: '/viewmeds',
  views: {
    'menuContent': {
      templateUrl: 'templates/viewmeds.html',

    }
  }
})


.state('app.findmedicines', {
url: '/findmedicines',
views: {
  'menuContent': {
    templateUrl: 'templates/findmedicines.html',

  }
}
})



.state('app.wiki', {
url: '/wiki',
views: {
  'menuContent': {
    templateUrl: 'templates/wiki.html',

  }
}
})

.state('app.setting', {
url: '/setting',
views: {
  'menuContent': {
    templateUrl: 'templates/setting.html',

  }
}
})


  $urlRouterProvider.otherwise('/landing');
});
