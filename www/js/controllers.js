angular.module('starter.controllers', [])
  .controller('LoginCtrl', function($scope, $timeout, $ionicPlatform, $state, $messangi){
    $scope.data = {};
    $ionicPlatform.ready(function(){

      $scope.doLogin = function(signupForm){

        if(signupForm.$valid){
          $messangi.register(function(error, registered){
            if(!error && registered){
              //Go to Tabs
              $state.go('tab.inbox');
            }else{
              //Show error
              $scope.message = error || 'Email Required';
            }
          }, $scope.data.email);
        }else{
          $scope.message = 'Email Required';
        }
      }

      $messangi.isRegister(function(error, registered){
        if(!error && registered){
          //Go to Tabs
          $state.go('tab.inbox');
        }else{
          //Show error
        }
      });
    });
  })
  .controller('BaseCtrl', function($scope, $timeout, $ionicPlatform, $state, $messangi){
    $scope.userID = null;
    $ionicPlatform.ready(function(){

      $messangi.init(function(error){
        if(error){
          console.log(error);
        }
          $scope.$broadcast('MessangiReady',true);
      });

      $messangi.isRegister(function(error, registered){
        if(error){
          console.log(error);
          return;
        }

        if(registered){
          $messangi.getUserID(function(error, id){
            if(!error){
              console.log(id);
              $timeout(function(){
                $scope.userID = id;
              });
            }else{
              console.log(error);
            }
          });
        }else{
          $state.go('login');
        }
      });

      $messangi.watchLocationChanges(function(error,coordinates){
        if(!error){
          $scope.$broadcast('locationChange', coordinates);
        }
      })
    });
  })
  .controller('InboxCtrl', function($scope, $timeout, $ionicPlatform, $ionicLoading, $messangi, $storage) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.messages = $storage.getMessages();
    $scope.messageRead = $scope.messageRead || {};

    function onLoad(callback){
      $messangi.listMessages(function(error, list){
        console.log('List Message Listo' +new Date().getTime());
        if(!error){
          callback(list);
        }else{
          console.log(error);
          callback(list || []);
        }
        $ionicLoading.hide();
      });
    }
    
    function extendWorkspace(list) {
      list.forEach(function(message) {
        $messangi.getWorkspace(function(error,workspace){
          message.workspace = workspace;
        },message.clientId);
      });
    }

    function getWorkspaceInfo(message) {
      $messangi.getWorkspace(function(error,workspace){
        message.workspace = workspace;
      },message.clientId);
    }

    function updateMessageList(list){
      for(var i=list.length-1;i>=0;i--){
        var searchElement = list[i].id;
        var find = false;
        for(var j=$scope.messages.length-1;j>=0 && !find;j--){
          if(searchElement === $scope.messages[j].id){
            find = true;
          }
        }
        if(!find){
          var message = list[i];
          getWorkspaceInfo(message);
          $storage.setMessage(message);
          $scope.messages.push(message);
        }
      }
      //sort
      $scope.messages.sort(function(msgA,msgB){
        return new Date(msgB.date).getTime() - new Date(msgA.date).getTime();
      });
    }

    $ionicPlatform.ready(function(){
      onLoad(function(list){
        $timeout(function(){
          updateMessageList(list);
        });
      });

      $scope.$on('MessangiReady',function(){
        onLoad(function(list){
          $timeout(function(){
            updateMessageList(list);
          });
        });
      })


      $scope.doRefresh = function() {
        onLoad(function(list){
          $timeout(function(){
            updateMessageList(list);
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        });
      };

      $messangi.onMessageReceive(function(error, message){
        getWorkspaceInfo(message);
        $timeout(function(){
          $storage.setMessage(message);
          $scope.messages.push(message);
        });
      })
    });

    $scope.getClass = function(message){
      if(message.read){
        if(message.type==="PUSH"){
          return 'ion-email';
        }else{
          return 'ion-ios-world-outline';
        }
      }else{
        if(message.type==="PUSH"){
          return 'ion-email-unread';
        }else{
          return 'ion-ios-world';
        }
      }
    };

  })
  .controller('MessageCtrl', function($scope, $stateParams, $timeout, $ionicPlatform, $ionicPopup, $messangi, $storage) {
    $ionicPlatform.ready(function(){
      $messangi.getMessage(function(error,message){
        if(!error){
          message.read = true;
          $storage.setMessage(message);
          $timeout(function(){
            $scope.message = message;
          });
        }
      },$stateParams.messageId);

      $scope.openDialog = function(clientId){
        $ionicPopup.prompt({
          title: 'Respond',
          template: 'Enter your response here',
          inputType: 'text',
          inputPlaceholder: 'Your Response HERE'
        }).then(function(res) {
          console.log('Your response:', res);
          //Send Response to Workspace with clientId
          $messangi.sendMessage(function(status){
            console.log(status);
          },res,clientId);
        });
      }
    });
  })
  .controller('GeofencesCtrl', function($scope, $timeout, $ionicPlatform, $ionicLoading, $messangi) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.geofences = new Array();
    _myLocation = null;

    function onLoad(callback){
      $messangi.listGeofences(function(error, list){
        if(!error){
          $messangi.getCurrentLocation(function(error,coordinates){
            if(!error && coordinates){
              _myLocation = coordinates
            };
            updateDistances(list);
            extendWorkspace(list);
            callback(list);
          });
        }else{
          console.log(error);
          callback(list || []);
        }
        $ionicLoading.hide();
      });
    }


    var rad = function(x) {
      return x * Math.PI / 180;
    };

    function calculateDistance (lat1, long1, lat2, long2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(lat2 - lat1);
      var dLong = rad(long2 - long1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    function updateDistances(list){
      list.forEach(function(geofence) {
        geofence.distance = calculateDistance( 
                                geofence.latitude, 
                                geofence.longitude, 
                                _myLocation.latitude, 
                                _myLocation.longitude
                              );
      });

      //sort
      list.sort(function(geoA,geoB){
        return geoA.distance - geoB.distance;
      });
    }

    function extendWorkspace(list) {
      list.forEach(function(geofence) {
        if(geofence.clientId){
          $messangi.getWorkspace(function(error,workspace){
            if(!error){
              geofence.workspace = workspace;
            }else{
              console.log(error);
            }
          },geofence.clientId);
        }
      });
    }

    $scope.$on('locationChange', function(event, data) {
      if(data){
        _myLocation = data;
      }
      updateDistances($scope.geofences);
    });

    $scope.doRefresh = function() {
      $scope.$broadcast('scroll.refreshComplete');
    };

    $ionicPlatform.ready(function(){
      onLoad(function(list){
        $timeout(function(){
          $scope.geofences = list.slice(0);
        })
      });

      $scope.doRefresh = function() {
        onLoad(function(list){
          $timeout(function(){
            $scope.geofences = list.slice(0);
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        });
      };
    });

    $scope.getStatus = function(geofence){
      if(geofence.distance){
        return geofence.distance < geofence.radius ? 'Inside' : 'Outside'; 
      }
      return 'Undefined';
    }

    $scope.getClass = function(geofence){
      if(geofence.eventType === 'ENTER'){
        return 'ion-log-in';
      }else if(geofence.eventType === 'EXIT'){
        return 'ion-log-out';
      }else{
        return 'ion-ios-loop-strong';
      }
    }

  })
  .controller('BeaconsCtrl', function($scope, $timeout, $ionicPlatform, $ionicLoading, $messangi) {
    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.beacons = new Array();

    function onLoad(callback){
      $messangi.listBeacons(function(error, list){
        if(!error){
          extendWorkspace(list);
        }else{
          console.log(error);
        }
        callback(list || []);
        $ionicLoading.hide();
      });
    }

    function extendWorkspace(list) {
      list.forEach(function(beacon) {
        if(beacon.clientId){
          $messangi.getWorkspace(function(error,workspace){
            if(!error){
              beacon.workspace = workspace;
            }else{
              console.log(error);
            }
          },beacon.clientId);
        }
      });
    }

    $ionicPlatform.ready(function(){

      onLoad(function(list){
        $timeout(function(){
          $scope.beacons = list.slice(0);
          $ionicLoading.hide();
        })
      })

      $scope.doRefresh = function() {
        onLoad(function(list){
          $timeout(function(){
            $scope.beacons = list.slice(0);
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        });
      };
    });
  })
  .controller('WorkspacesCtrl', function($scope, $timeout, $ionicPlatform, $ionicLoading, $messangi) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.workspaces = new Array();

    function onLoad(callback){
      $messangi.listWorkspaces(function(error, list){
        if(error){
          console.log(error);
        }
        callback(list || []);
        $ionicLoading.hide();
      });
    }

    $ionicPlatform.ready(function(){
      onLoad(function(list){
        $timeout(function(){
          $scope.workspaces = list.slice(0);
        });
      })

      $scope.doRefresh = function() {
        onLoad(function(list){
          $timeout(function(){
            $scope.workspaces = list.slice(0);
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        });
      };
    });



    $scope.toggleWorkspace = function(workspace){
      function handlerCallback(error) {
        if(error){
          workspace.subscribed = !workspace.subscribed;
        }
        $ionicLoading.hide();
      }

      $ionicLoading.show({
        template: workspace.subscribed ? 'Joining...' : 'Leaving...'
      });

      if(workspace.subscribed){
        $messangi.joinWorkspace(handlerCallback,workspace.clientId);
      }else{
        $messangi.leaveWorkspace(handlerCallback,workspace.clientId);
      }
    }
  });
