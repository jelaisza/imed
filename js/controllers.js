angular.module('starter.controllers',['ionic','ngCordova','ngCordova.plugins.camera','ngCordova.plugins.localNotification','ngCordova.plugins'])
.run(function($ionicPlatform, $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    window.plugin.notification.local.onadd = function (id, state, json) {
       var notification = {
           id: id,
           state: state,
           json: json
       };
       $timeout(function() {
           $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
       });
   };

  });
})
.factory('$cordovaCamera', ['$q', function ($q) {

    return {
      getPicture: function (options) {
        var q = $q.defer();

        if (!navigator.camera) {
          q.resolve(null);
          return q.promise;
        }

        navigator.camera.getPicture(function (imageData) {
          q.resolve(imageData);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      cleanup: function () {
        var q = $q.defer();

        navigator.camera.cleanup(function () {
          q.resolve();
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      }
    };
  }])


  .controller("ExampleController", function($scope, $cordovaLocalNotification) {


    $scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
        alert("Added a notification");
    });

      $scope.add = function() {
          var alarmTime = new Date();
          alarmTime.setMinutes(alarmTime.getMinutes() + 1);
          $cordovaLocalNotification.add({
              id: "1234",
              date: alarmTime,
              message: "You need to take a medicine",
              title: "Reminder",
              autoCancel: true,
              led: "fffff0",
              sound: "file://bell.mp3",

          }).then(function () {
              console.log("The notification has been set");
          });
      }

      $scope.isScheduled = function() {
          $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
              alert("Reminder has been scheduled: " + isScheduled);
          });
      }

  })

.controller('Search', function($scope) {
  $scope.items = ['Baypointe Hospital & Medical Center',
  'Our Lady of Lourdes International Medical Center','Ridon St. Jude Medical Center',
  'ZMMG COOP Women and Children Hospital','Divine Spirit General Hospital','Mother And Child General Hospital'];
})

.controller('MapCtrl', function($scope, $cordovaGeolocation, uiGmapGoogleMapApi, uiGmapIsReady, ngGPlacesAPI) {

	var posOptions = {timeout: 10000, enableHighAccuracy: false};

  	// get user location with ngCordova geolocation plugin
  	$cordovaGeolocation
	    .getCurrentPosition(posOptions)
	    .then(function (position) {
	      $scope.lat  = position.coords.latitude;
	      $scope.long = position.coords.longitude;

	      // get nearby places once we have user loc in lat & long
	      ngGPlacesAPI.nearbySearch({
	          latitude: $scope.lat,
	          longitude: $scope.long
	      }).then(
	          function(data){
	              console.log('returned with places data', data);
	              $scope.places = data;
	              return data;
	          });

	      // create new map with your location
	      uiGmapGoogleMapApi.then(function(maps){

	        $scope.control = {};

	      	$scope.myMap = {
	      		center: {
	      			latitude: $scope.lat,
	      			longitude: $scope.long
	      		},
	      		zoom : 14
	      	};
	      	$scope.myMarker = {
	      		id: 1,
	      		coords: {
	      			latitude: $scope.lat,
	      			longitude: $scope.long
	      		},
	      		options: {draggable:false}
	      	};

	      });

	    }, function(err) {
	      // error
	    });

    $scope.getMap = function() {
        var map1 = $scope.control.getGMap();
        console.log('map is:', map1);
        console.log('with places:', $scope.places);
    };

    uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
        var map = inst.map;
        var uuid = map.uiGmap_id;
        var mapInstanceNumber = inst.instance; // Starts at 1.
        console.log('from map is ready:', map, uuid, mapInstanceNumber);
        });
    });
})
.controller('LocationController', function($ionicLoading, $http, $state, Geolocation, $cordovaGeolocation, $ionicPopup) {
  var vm = this;

vm.useGeolocation = function() {
  $ionicLoading.show();

  $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false}).then(function (position) {
    var lat  = position.coords.latitude;
    var lng = position.coords.longitude;

    var url = 'https://civinfo-apis.herokuapp.com/civic/geolocation?latlng=' + lat + ',' + lng;
    $http.get(url).then(function(response) {
      $ionicLoading.hide();
      if (response.data.results.length) {
        Geolocation.data = response.data.results[0];
        $state.go('app.places');
      } else {
        $ionicPopup.alert({
          title: 'Unknown location',
          template: 'Please try again or move to another location.'
        });
      }
    })
    .catch(function(error) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Unable to get location',
        template: 'Please try again or move to another location.'
      });
    });
  });
};

})
.controller('PlaceController', function($scope, $ionicLoading, $ionicActionSheet, $http, $stateParams) {
  var vm = this;

  $ionicLoading.show();

  var url = 'https://civinfo-apis.herokuapp.com/civic/place?place_id=' + $stateParams.place_id;
  $http.get(url).then(function(response) {
    vm.place = response.data.result;
    $ionicLoading.hide();
  });

  vm.openSheet = function() {
    var sheet = $ionicActionSheet.show({
      titleText: 'Share this place',
      buttons: [
        { text: 'Share via Twitter' },
        { text: 'Share via Facebook' },
        { text: 'Share via Email'}
      ],
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if (index === 0) {
          window.open('https://twitter.com/intent/tweet?text=' +
            encodeURIComponent('I found this great place! ' + vm.place.url));
        } else if (index === 1) {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + vm.place.url);
        } else if (index === 2) {
          window.open('mailto:?subject=' + encodeURIComponent('I found this great place!') + '&body=' + vm.place.url);
        }
        sheet();
      }
    });
  };

})
.controller('PlacesController', function($http, $scope, $ionicLoading, $ionicHistory, $state, Geolocation, Types) {
  var vm = this;


  if (!Geolocation.data.geometry || !Geolocation.data.geometry.location) {
    $state.go('app.location');
    return;
  }

  var base = 'https://civinfo-apis.herokuapp.com/civic/places?location=' + Geolocation.data.geometry.location.lat + ',' + Geolocation.data.geometry.location.lng;
  var token = '';
  vm.canLoad = true;
  vm.places = [];

  vm.load = function load() {
    $ionicLoading.show();
    var url = base;
    var query = [];
    angular.forEach(Types, function(type) {
      if (type.enabled === true) {
        query.push(type.type.toLowerCase());
      }
    });
    url += '&query=' + query.join('|');

    if (token) {
      url += '&token=' + token;
    }

    $http.get(url).then(function handleResponse(response) {
      vm.places = vm.places.concat(response.data.results);
      token = response.data.next_page_token;

      if (!response.data.next_page_token) {
        vm.canLoad = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
    });
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    var previous = $ionicHistory.forwardView();
    if (!previous || previous.stateName != 'app.place') {
      token = '';
      vm.canLoad = false;
      vm.places = [];
      vm.load();
    }
  });
})


.controller('PreferencesController', function(Types) {
  var vm = this;

  vm.types = Types;
})



.controller('MyCtrl', function($scope, $ionicSlideBoxDelegate) {
   $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
   }
})



.controller('Vibration',function($scope,$http){
	var url = "http://localhost/ion2/php/vibReading.php";
	$http.get(url).success(function(response){
		console.log(response);
		$scope.items =response;
	});

})

.controller("DbController",function($scope,$http,$cordovaCamera,$cordovaLocalNotification){


getInfo();
function getInfo(){

$http.post('http://www.floodwatcher.esy.es/recetaDetails.php').success(function(data){

$scope.details = data;
});
}

$scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
    alert("Added a notification");
});

  $scope.add = function() {
      var alarmTime = new Date();
      
      alarmTime.setMinutes(alarmTime.getMinutes() + 1);
      $cordovaLocalNotification.add({
          id: "1234",
          date: alarmTime,
          message: "You need to take a medicine",
          title: "Reminder",
          autoCancel: true,
          led: "fffff0",
          sound: "file://bell.mp3",

      }).then(function () {
          console.log("The notification has been set");
      });
  }

  $scope.isScheduled = function() {
      $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
          alert("Reminder has been scheduled ");
      });
  }


  $scope.insertInfo = function(info){

    $scope.takePicture = function () {
          console.log('Camera');
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA
          };

          // udpate camera image directive
          $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.cameraimage = "data:image/jpeg;base64," + imageData;
          }, function (err) {
            console.log('Failed because: ');
            console.log(err);
          });
        };


  $http.post('http://www.floodwatcher.esy.es/insertReceta.php',{
    "r_drugname":info.r_drugname,
    "r_food":info.r_food,
    "r_dosage":info.r_dosage,
    "r_dosageform":info.r_dosageform,
    "r_time":info.r_time,
    "r_schedule":info.r_schedule,
    "r_perhour":info.r_perhour,
    "r_day":info.r_day,
    "r_name":info.r_name,
    "r_doctorname":info.r_doctorname,
    "r_licenced":info.r_licenced,
    "r_contact":info.r_contact,
    "r_image":$scope.cameraimage
  }).success(function(data){

  if (data == true) {
  getInfo();
  $('#recetaForm')

  }
  });
  }

$scope.deleteInfo = function(info){
$http.post('http://www.floodwatcher.esy.es/deleteMedicine.php',{
  "r_ID":info.r_ID
}).success(function(data){
if (data == true) {
getInfo();
}
});
}


$scope.currentUser = {};
$scope.editInfo = function(info){
$scope.currentUser = info;
}
$scope.UpdateInfo = function(info){
$http.post('http://www.floodwatcher.esy.es/updateDetails.php',{

  "r_drugname":info.r_drugname,
  "r_dosage":info.r_dosage,
  "r_dosageform":info.r_dosageform,
  "r_schedule":info.r_schedule,
  "r_perhour":info.r_perhour,
  "r_name":info.r_name,
  "r_doctorname":info.r_doctorname,
  "r_licenced":info.r_licenced
}).success(function(data){
$scope.show_form = true;
if (data == true) {
getInfo();
}
});
}
$scope.updateMsg = function(emp_id){
$('#editForm').css('display', 'none');
}




$scope.displayMedicine = function(){
  $http.get("https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=341248")
    .success(function(data){
      $scope.medicine = data;
      console.log(data.interactionTypeGroup[0].sourceDisclaimer);
      console.log(data.interactionTypeGroup[0].sourceName);
    });




};



})

.controller('Controller', ['$scope', '$http', function($scope, $http) {
  $scope.showData=false;
  $scope.showError=false;
  $scope.placeholder = "your search here";
  $scope.keyWord = "";
  $scope.text = '';
  $scope.submit = function() {
    if ($scope.text) {
      $scope.keyWord = this.text;
      var tt = $scope.keyWord.replace(/\s/g, "+");
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + tt,
        jsonp: "callback",
        dataType: "jsonp",
        success: function(response) {
          console.log(response);
          $scope.$apply(function() {
            $scope.data = response;
            $scope.titles = $scope.data[1];
            $scope.des = $scope.data[2];
            $scope.links = $scope.data[3];
            if($scope.des.length===0){
               $scope.error ="No such item found";
              $scope.showError=true;
              $scope.showData = false;// show error message here
            }else{
            $scope.showData = true;}
          });
        }
      });
      $scope.text = '';
    }
  };

}]);
