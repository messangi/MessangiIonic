angular.module('starter.services', [])

.factory('$storage', ['$q','$window', function($q, $window) {
  _messageMap = 'keyMap';
  _storage = $window.localStorage;
  return {
    get: function(key,def){
      var value = _storage.getItem(key);
      return value ? value : def;
    },
    set: function(key, value){
      _storage.setItem(key, value);
    },
    getBoolean: function(key,def){
      var value = _storage.getItem(key);
      return value ? value === 'true' : def;
    },
    setBoolean: function(key, value){
      _storage.setItem(key, value+'');
    },
    getMessages: function(){
      var messages = new Array();
      var keys = JSON.parse(_storage.getItem(_messageMap)||'[]');
      for(var i=keys.length-1;i>=0;i--){
        messages.push(this.getMessage(keys[i]));
      }
      return messages;
    },
    setMessages: function(list){
      var keyMap = JSON.parse(_storage.getItem(_messageMap)||'[]');
      for(var i=keys.length-1;i>=0;i--){
        var message = list[i];
        if(keyMap.indexOf(message.id)===-1){
          keyMap.push(message.id);
        }
        _storage.setItem(message.id, JSON.stringify(message));
      }
      _storage.setItem(_messageMap, JSON.stringify(keyMap));
    },
    getMessage: function(messageId){
      var jsonMessage = _storage.getItem(messageId);
      return JSON.parse(jsonMessage);
    },
    setMessage: function(message){
      //Key Map
      var keyMap = JSON.parse(_storage.getItem(_messageMap)||'[]');
      if(keyMap.indexOf(message.id)===-1){
        keyMap.push(message.id);
      }
      _storage.setItem(_messageMap, JSON.stringify(keyMap));

      //Data
      _storage.setItem(message.id, JSON.stringify(message));
    },
    clear: function(key){
      _storage.removeItem(key);
    }
  }
}])

.factory('$messangi', ['$q','$storage','$window', function ($q,$storage,$window) {
  _subscribed = Array();

  function getSubscribedClientsIds() {
    return this._subscribed.map(function(element){
      return element.clientId;
    });
  }  

  function findInArray(id, array) {
    for (var index = array.length-1; index >= 0; index--) {
      var element = array[index];
      if(element.id == id){
        return element;
      }
    }
    return null;
  }

  return {
    get Priority(){
        return $window.plugins && $window.plugins.Messangi && $window.plugins.Messangi.Priority
    },
    init: function(callback){
      function handlerSuccess(list){
        list.forEach(function(workspace){
          workspace.subscribed = workspace.subscribed === "YES" || workspace.subscribed === true;
        });
        this._subscribed = list;
        callback(null);
      };

      function handlerError(error){
        callback(error);
      }

      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.init(function(){
          $window.plugins.Messangi.getSubscribedWorkspaces(handlerSuccess,handlerError);  
        },handlerError);
      }else
         handlerSuccess([
          {
            name: "Workspace 1",
            clientId:'1',
            subscribed:"YES"
          },
          {
            name: "Workspace 2",
            clientId:'2',
            subscribed:"YES"
          },
          {
            name: "Workspace 3",
            clientId:'3',
            subscribed:"YES"
          },
          {
            name: "Workspace 6",
            clientId:'6',
            subscribed:"YES"
          }
        ])     
    },
    setLocationPriority: function(priority){
      if($window.plugins && $window.plugins.Messangi){
        var priorityCode;
        var valid = true;
        if(!$window.plugins.Messangi.Priority[priority]){
          valid = false;
          for (var key in $window.plugins.Messangi.Priority) {
            if ($window.plugins.Messangi.Priority.hasOwnProperty(key)) {
              valid = ($window.plugins.Messangi.Priority[key] == priority);
              if(valid){
                priorityCode = priority;
                break;
              }
            }
          }
        } else {
          priorityCode = $window.plugins.Messangi.Priority[priority];
        }

        if(priorityCode){
          $window.plugins.Messangi.setLocationPriority(priorityCode);
        }

      }
    },
    setLocationInterval: function(interval){
      if($window.plugins && $window.plugins.Messangi){
        if(interval && interval >= 0){
          $window.plugins.Messangi.setLocationInterval(interval);
        }
      }
    },
    isRegister: function(callback){
      function handlerSuccess(valid){
        callback(null, valid);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.validUser(handlerSuccess,handlerError);
      else{
        var value = $storage.get('user',null); 
        if(value){
          handlerSuccess(true);
        }else{
          handlerSuccess(false);
        }
      }
    },
    getUserID: function(callback){
      function handlerSuccess(phone){
        callback(null, phone);
      };

      function handlerError(error){
        callback(error,null);
      };
      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.getUserID(handlerSuccess,handlerError);
      else{
        var value = $storage.get('user',null); 
        if(value){
          handlerSuccess(value);
        }else{
          handlerError('No user Registered');
        }
      }
        
    },
    getCurrentLocation: function(callback){
      function handlerSuccess(coordinates){
        callback(null, coordinates);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.getCurrentLocation(handlerSuccess,handlerError);
      else
        handlerSuccess({latitude:10.4463052,longitude:-66.8627658});
    },
    watchLocationChanges: function(callback){
      function handlerSuccess(coordinates){
        callback(null, coordinates);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.onLocationUpdate(handlerSuccess,handlerError);
      else
        handlerSuccess({latitude:10.4463052,longitude:-66.8627658});
    },
    register: function(callback, token){
      function handlerSuccess(registered){
        callback(null, true);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        if(token){
          $window.plugins.Messangi.registerWithToken(handlerSuccess,handlerError,token);
        }else{
          $window.plugins.Messangi.register(handlerSuccess,handlerError);
        }
      else{
        $storage.set('user',token || 'true');
        handlerSuccess(true);
      }
        
    },
    registerPhone: function(callback,phone){
      function handlerSuccess(list){
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.registerWithPhone(handlerSuccess,handlerError,phone);
      else{
        $storage.set('user','phone');
        handlerSuccess(true);
      }
        
    },
    validatePhone: function(callback,code){
      function handlerSuccess(list){
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.activatePhoneWithCode(handlerSuccess,handlerError,[code]);
      else
        handlerSuccess(true);
    },
    joinWorkspace: function(callback,clientId){
      function handlerSuccess(){
        callback(null);
      };

      function handlerError(error){
        callback(error);
      };

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.joinWorkspace(handlerSuccess,handlerError,clientId);
      else
        handlerSuccess();
    },
    leaveWorkspace: function(callback,clientId){

      function handlerSuccess(){
        callback(null);
      };

      function handlerError(error){
        callback(error);
      }
      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.leaveWorkspace(handlerSuccess,handlerError,clientId);
      else
        handlerSuccess();
    },
    listWorkspaces: function(callback){

      function handlerSuccess(list){
        list.forEach(function(workspace){
          workspace.subscribed = workspace.subscribed === "YES" || workspace.subscribed === true;
        });
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.getAvailableWorkspaces(handlerSuccess,handlerError);
      else
        handlerSuccess([
          {
            name: "Workspace 1",
            clientId:'1',
            subscribed:"YES"
          },
          {
            name: "Workspace 2",
            clientId:'2',
            subscribed:"YES"
          },
          {
            name: "Workspace 3",
            clientId:'3',
            subscribed:"YES"
          },
          {
            name: "Workspace 4",
            clientId:'4',
            subscribed:"NO"
          },
          {
            name: "Workspace 5",
            clientId:'5',
            subscribed:"NO"
          },
          {
            name: "Workspace 6",
            clientId:'6',
            subscribed:"YES"
          }
        ])
    },
    getWorkspace: function(callback, clientId){
      function handlerSuccess(workspace){
        workspace.subscribed = workspace.subscribed === "YES" || workspace.subscribed === true;
        callback(null, workspace);
      };

      function handlerError(error){
        callback(error,null);
      };

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.getWorkspace(handlerSuccess,handlerError,clientId);
      else
        handlerSuccess({
          name: 'Workspace A',
          clientId : clientId
        });
    },
    listMessages: function(callback){
      function handlerSuccess(list){
        list.forEach(function(message){
          message.date = new Date(message.date);
        })
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      };

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.listMessages(handlerSuccess,handlerError,getSubscribedClientsIds());
      else
        handlerSuccess([
          {
            "blastId": "-4318397840567091965",
            "id": "1",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:29.379-05:00",
            "timezone": "EST5EDT",
            "clientId": "1",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "7637204657563497159",
            "id": "2",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. http://messangi.com/r/35868443-9 </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:45.586-05:00",
            "timezone": "EST5EDT",
            "clientId": "3",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "-4318397840567091965",
            "id": "3",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:29.379-05:00",
            "timezone": "EST5EDT",
            "clientId": "1",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "7637204657563497159",
            "id": "54d63898-e879-4028-92b1-37f0ad9fbe8a",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. http://messangi.com/r/35868443-9 </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:45.586-05:00",
            "timezone": "EST5EDT",
            "clientId": "6",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "-4318397840567091965",
            "id": "804c3edd-28dd-4044-966b-e71f4e2853ee",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:29.379-05:00",
            "timezone": "EST5EDT",
            "clientId": "5",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "7637204657563497159",
            "id": "54d8a898-e879-4028-92b1-37f0ad9f457a",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. http://messangi.com/r/35868443-9 </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:45.586-05:00",
            "timezone": "EST5EDT",
            "clientId": "FYn3ghBXpkIzpRdBgIjW",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "-4318397840567091965",
            "id": "804c3edd-2822-4044-976b-e71f4e2853ee",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:29.379-05:00",
            "timezone": "EST5EDT",
            "clientId": "1",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "7637204657563497159",
            "id": "5476898-e879-4028-92b1-37f0ad9fbe8a",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. http://messangi.com/r/35868443-9 </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:45.586-05:00",
            "timezone": "EST5EDT",
            "clientId": "1",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "-4318397840567091965",
            "id": "804c3edd-28dd-4044-134374-e71f4e2853ee",
            "type": "PUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:29.379-05:00",
            "timezone": "EST5EDT",
            "clientId": "6",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          },
          {
            "blastId": "7637204657563497159",
            "id": "54d8a898-e81119-4028-92b1-37f0ad9fbe8a",
            "type": "GEOPUSH",
            "from": "MessangiIonicDemo",
            "to": "C626958C-8C17-4C73-AEB4-A0D8F2AA6B95",
            "subject": "Lorem ipsum",
            "text": "<p>Lorem ipsum Dolore fugiat quis reprehenderit nisi irure nisi Duis exercitation et sed nostrud proident consequat Ut. http://messangi.com/r/35868443-9 </p>",
            "status": "DELIVERED_TO_DEVICE",
            "statusDescription": "Delivered to Device",
            "encoding": "UTF-8",
            "date": "2016-11-22T18:28:45.586-05:00",
            "timezone": "EST5EDT",
            "clientId": "6",
            "appName": "MessangiIonicDemo",
            "platform": "IOS"
          }
        ]);
    },
    getMessage:function(callback, messageId){      
      this.listMessages(function(error,list){
        if(!error){
          callback(null,findInArray(messageId,list));
        }else{
          callback(error,null);
        }
      })
    },
    sendMessage: function(callback, message, clientId){
      function handlerSuccess(status){
        callback(null, status);
      };

      function handlerError(error){
        callback(error,null);
      };

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.sendMessage(handlerSuccess,handlerError,message, clientId);
      else
        handlerSuccess(true);
    },
    onMessageReceive: function(callback){
      function handlerSuccess(message){
        callback(null, message);
      };

      function handlerError(error){
        callback(error,null);
      }

      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.onPushReceived(handlerSuccess,handlerError);
    },
    onGeofenceTriggered: function(callback){
      function handlerSuccess(geofence){
        callback(null, geofence);
      };

      function handlerError(error){
        callback(error,null);
      }
      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.onGeofenceTriggered(handlerSuccess,handlerError);

    },
    listGeofences: function(callback){
      function handlerSuccess(list){
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      };
      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.listGeofences(handlerSuccess,handlerError,getSubscribedClientsIds());
      else
        handlerSuccess([
          {
            "regionId": "2cb5a1e7-b1c0-48fa-8295-5fc36e83cfa6",
            "name": "Chacaito - Both",
            "type": "GEOFENCE",
            "eventType": "ENTER-EXIT",
            "msgTitle": "Chacaito - Both",
            "msgContent": "<p>Enter Exit</p>",
            "appName": "MessangiIonicDemo",
            "timezone": "EST5EDT",
            "update": "2016-11-22T14:34:14.060-05:00",
            "activated": "true",
            "clientId": "1",
            "geoFenceId": "2cb5a1e7-b1c0-48fa-8295-5fc36e83cfa6",
            "latitude": "10.491532",
            "longitude": "-66.867385",
            "radius": "400.0"
          },
          {
            "regionId": "35ec9a48-5643-49e1-94a8-f356a440dc85",
            "name": "Chacao - Exit",
            "type": "GEOFENCE",
            "eventType": "EXIT",
            "msgTitle": "Chacao - Exit",
            "msgContent": "<p>Chacao Exit Geofence =)</p>",
            "appName": "MessangiIonicDemo",
            "timezone": "EST5EDT",
            "update": "2016-11-22T13:02:24.779-05:00",
            "activated": "true",
            "clientId": "2",
            "geoFenceId": "35ec9a48-5643-49e1-94a8-f356a440dc85",
            "latitude": "10.493868",
            "longitude": "-66.856589",
            "radius": "500.0"
          },
          {
            "regionId": "bbe03164-7d0e-45fe-b6e3-57ac24ad350b",
            "name": "Altamira - Enter",
            "type": "GEOFENCE",
            "eventType": "ENTER",
            "msgTitle": "Altamira - Enter",
            "msgContent": "<p>Altamira</p>",
            "appName": "MessangiIonicDemo",
            "timezone": "EST5EDT",
            "update": "2016-11-22T14:33:33.813-05:00",
            "activated": "true",
            "clientId": "2",
            "geoFenceId": "bbe03164-7d0e-45fe-b6e3-57ac24ad350b",
            "latitude": "10.495734",
            "longitude": "-66.84888",
            "radius": "250.0"
          }
        ])
    },
    getGeofence: function(callback, geofenceId){
      this.listGeofences(function(error,list){
        if(!error){
          callback(null,findInArray(geofenceId,list));
        }else{
          callback(error,null);
        }
      })
    },
    listBeacons: function (callback) {
      function handlerSuccess(list){
        callback(null, list);
      };

      function handlerError(error){
        callback(error,null);
      };
      if($window.plugins && $window.plugins.Messangi)
        $window.plugins.Messangi.listBeacons(handlerSuccess,handlerError,'all',getSubscribedClientsIds());
      else
        handlerSuccess([
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "1",
            "distanceString": "FAR",
            "eventType": "ENTER-EXIT",
            "major": "0",
            "manufacturer": "WIFI_BEACON_MAC",
            "minor": "0",
            "msgContent": "<p>Beacon Mac</p>",
            "msgTitle": "Beacon by MAC",
            "name": "MAC BEACON",
            "regionId": "521d3bb6-a7da-44ff-bd13-e1badec25d99",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:12:13.166-05:00",
            "uuid": "12:12:12:12:12:12"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "2",
            "distanceString": "FAR",
            "eventType": "ENTER",
            "major": "0",
            "manufacturer": "WIFI_BEACON_IP",
            "minor": "0",
            "msgContent": "<p>There's no place like home</p>",
            "msgTitle": "Beacon By IP",
            "name": "IP BEACON",
            "regionId": "82d0ed72-3380-41df-a1c0-74c7de23974c",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:15:44.129-05:00",
            "uuid": "127.0.0.1"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "1",
            "distanceString": "FAR",
            "eventType": "ENTER",
            "major": "49971",
            "manufacturer": "IBEACON",
            "minor": "39732",
            "msgContent": "<p>Hola Beacon >_<</p>",
            "msgTitle": "Beacon Estimote",
            "name": "Beacon Oficina",
            "regionId": "7e89f284-fd6d-4f1d-84a9-3c96bb719d08",
            "timezone": "EST5EDT",
            "type": "BEACON",
            "update": "2016-11-22T14:16:19.365-05:00",
            "uuid": "b9407f30-f5f8-466e-aff9-25556b57fe6d"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "3",
            "distanceString": "FAR",
            "eventType": "EXIT",
            "major": "0",
            "manufacturer": "WIFI_BEACON_SSID",
            "minor": "0",
            "msgContent": "<p>Ogangi Css Network :)</p>",
            "msgTitle": "Beacon By SSID",
            "name": "SSID BEACON",
            "regionId": "238e9bbb-4772-40f5-a84d-fc17a5db3659",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:15:53.072-05:00",
            "uuid": "OgangiCSS"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "3",
            "distanceString": "FAR",
            "eventType": "ENTER-EXIT",
            "major": "0",
            "manufacturer": "WIFI_BEACON_MAC",
            "minor": "0",
            "msgContent": "<p>Beacon Mac</p>",
            "msgTitle": "Beacon by MAC",
            "name": "MAC BEACON",
            "regionId": "521d3bb6-a7da-44ff-bd13-e1badec25d99",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:12:13.166-05:00",
            "uuid": "12:12:12:12:12:12"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "4",
            "distanceString": "FAR",
            "eventType": "ENTER",
            "major": "0",
            "manufacturer": "WIFI_BEACON_IP",
            "minor": "0",
            "msgContent": "<p>There's no place like home</p>",
            "msgTitle": "Beacon By IP",
            "name": "IP BEACON",
            "regionId": "82d0ed72-3380-41df-a1c0-74c7de23974c",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:15:44.129-05:00",
            "uuid": "127.0.0.1"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "5",
            "distanceString": "FAR",
            "eventType": "ENTER",
            "major": "49971",
            "manufacturer": "IBEACON",
            "minor": "39732",
            "msgContent": "<p>Hola Beacon >_<</p>",
            "msgTitle": "Beacon Estimote",
            "name": "Beacon Oficina",
            "regionId": "7e89f284-fd6d-4f1d-84a9-3c96bb719d08",
            "timezone": "EST5EDT",
            "type": "BEACON",
            "update": "2016-11-22T14:16:19.365-05:00",
            "uuid": "b9407f30-f5f8-466e-aff9-25556b57fe6d"
          },
          {
            "activated": "true",
            "appName": "MessangiIonicDemo",
            "clientId": "6",
            "distanceString": "FAR",
            "eventType": "EXIT",
            "major": "0",
            "manufacturer": "WIFI_BEACON_SSID",
            "minor": "0",
            "msgContent": "<p>Ogangi Css Network :)</p>",
            "msgTitle": "Beacon By SSID",
            "name": "SSID BEACON",
            "regionId": "238e9bbb-4772-40f5-a84d-fc17a5db3659",
            "timezone": "EST5EDT",
            "type": "WIFI_BEACON",
            "update": "2016-11-22T14:15:53.072-05:00",
            "uuid": "OgangiCSS"
          }
        ])
    },
    getBeacon: function(callback, beaconId){
      this.listBeacons(function(error,list){
        if(!error){
          callback(null,findInArray(beaconId,list));
        }else{
          callback(error,null);
        }
      })
    },
    usePowerSaver: function(enable){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.usePowerSaver(!!enable);
      }
    },
    useAndroidLScanner: function(enable){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.useAndroidLScanner(!!enable);
      }
    },
    useTrackingCache: function(enable){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.useTrackingCache(!!enable);
      }
    },
    setBeaconExitPeriod: function(toExitPeriot){
      if($window.plugins && $window.plugins.Messangi){
        if(toExitPeriot && toExitPeriot >= 0){
          $window.plugins.Messangi.setBeaconExitPeriod(toExitPeriot);
        }
      }
    },
    useRegionPersistence: function(enable){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.useRegionPersistence(!!enable);
      }
    },
    autoSetScanMode: function(enable){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.autoSetScanMode(!!enable);
      }
    },
    useBackgroundScanMode: function(){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.useBackgroundScanMode();
      }
    },
    useForegroundScanMode: function(){
      if($window.plugins && $window.plugins.Messangi){
        $window.plugins.Messangi.useForegroundScanMode();
      }
    },
    setForegroundScanCycles: function(scanPeriod, sleepPeriod){
      if($window.plugins && $window.plugins.Messangi){
        if(scanPeriod && scanPeriod >= 0 && sleepPeriod && sleepPeriod >= 0){
          $window.plugins.Messangi.setForegroundScanCycles(scanPeriod, sleepPeriod);
        }
      }
    },
    setBackgroundScanCycles: function(scanPeriod, sleepPeriod){
      if($window.plugins && $window.plugins.Messangi){
        if(scanPeriod && scanPeriod >= 0 && sleepPeriod && sleepPeriod >= 0){
          $window.plugins.Messangi.setBackgroundScanCycles(scanPeriod, sleepPeriod);
        }
      }
    }
  };
}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

