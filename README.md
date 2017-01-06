## What is IONIC

Ionic is a hybrid application development framework based on Angular and Cordova, it simplifies a lot 
the development of such applications and it's important to know the usage of Cordova SDK in this Framework

## Initializing

Clone the project in your local environment
Then, it's requeried to download the main dependencies.

```shell
	$>npm install -g cordova ionic
	$>git clone https://github.com/messangi/MessangiIonic.git
	$>cd MessangiIonic
	$>npm install && bower install
```
Once the project and its dependencies are ready you can test in the **Browser** the result with demo data with the following command:

```shell
	$>ionic serve
```

Now you have to add the plaforms Android and iOS

```shell
	$>ionic platform add ios android
```

and add the messangi plugin, for more information go to the [documentation](https://www.npmjs.com/package/cordova-plugin-messangi)

```shell
	$>ionic plugin add cordova-plugin-messangi --variable APP_NAME=<Messangi Application Name> --variable PUBLIC_KEY=<Messangi Public Key or Client ID> --variable PRIVATE_KEY=<Messangi Private Key> --variable GCM_API_KEY=<Gcm Api Key> --variable GCM_PROJECT_NUMBER=<GCM Project Number>
```

## Certificates

### iOS

In iOS to be able to get push notifications you have to follow a long and strict steps list, explained in the following link: [Certificados IOS](https://www.messangi.com/documentation/doku.php?id=sdk:ios_certs).

The certificates are **mandatory** to enable the Push Notifications feature in iOS, so you have to be careful to generate them properly.

### Android

In order to get the credentials in Google Cloud Messaging (GCM), you must follow our guide in this link: [GCM - Credentials](https://www.messangi.com/documentation/doku.php?id=sdk:android_keys)

The credentials in GCM are mandatory to enable the Push Notifications feature in Android, so you have to be careful to generate them properly.

## Getting started with the plugin

After having base project set and working properly, go to the base project directory and include the plugin adding the neccesary variables for Messangi.


```shell
	$>cd <path al proyecto>
	$>ionic plugin add cordova-plugin-messangi --variable APP_NAME=<Messangi Application Name> --variable PUBLIC_KEY=<Messangi Public Key or Client ID> --variable PRIVATE_KEY=<Messangi Private Key> --variable GCM_API_KEY=<Gcm Api Key> --variable GCM_PROJECT_NUMBER=<GCM Project Number>
```

|Variables|Description|Required|Platform|
|---------|-----------|--------|--------|
|APP_NAME |This variable is sent to you from the Ogangi Team|YES|ANDROID - iOS|
|PUBLIC_KEY|This variable is sent to you from the Ogangi Team|YES|ANDROID - iOS|
|PRIVATE_KEY|This variable is sent to you from the Ogangi Team|YES|ANDROID - iOS|
|GCM_API_KEY|This variable is found with GCM* and you have to request your registration through emailing to support@ogangi.com|YES|ANDROID|
|GCM_PROJECT_NUMBER|This variable is found with GCM* and you have to request your registration through emailing to support@ogangi.com|YES|ANDROID|
|MMC_URL|This variable is sent to you from the Ogangi Team|NO|ANDROID - iOS|
|MMC_INSTANCE_ID|This variable is sent to you from the Ogangi Team|NO|ANDROID - iOS|


* Variables found in **Certificates** section, **Android** subsection.

----------
## Using Offcial IDE's 

In our experience Ionic is not self-sufficient, it means there's yet things to do by hand, such as adding settings, so it's necessary to open with Xcode the generated project after **ionic build**.

### iOS
In Xcode click on **Open another project** and then look for the previously generated project, then go to the **platforms > ios** directory and open the one with **.xcworkspace** extension. 

Once opened the project in Xcode, select the project root (project name in the left panel), in the right section, it's chosen the tab **General**, in that tab is located the **Bundle Identifier**, this is the same referenced from the **config.xml** file, it's suggestable not to modify that in Xcode but in the file itself and then run again the command **ionic build ios**. In that tab is also the information for signing and deployment.

In the **Capabilities** tab must be checked at least the following:

- Push Notifications
- Background Modes
	- Location updates
	- Uses Bluetooth LE accessories
	- Background fetch
	- Remote notifications
- Associated Domains 	

**Note:** Any error shown in this point could be caused by any error in certificate generation.

### Android

Android case is much more stable, it doesn't require special configurations, but if you really want to open the project in **Android Studio** you can do it without trouble by only selecting **File > Open...** in the menus and look for the **Platforms** folder, select **Android** and click in **OK**.

## Configurating plugin

In this point you should have the plugin installed and ready to use, there's nothing more to do. 

### Using Service Factory

We also provide an Angular Service to use the Cordova plugin, it can be checked in the following gist : [MessangiService.js](https://gist.github.com/messangi/90f3ec0cb0beae915120a88cfca1a94b)

After adding this **Factory**, it's just necessary to add **$messangi** in the controller where you are wanting to use some Messangi functionalities, followed by the function you want to use.

```js
	$messangi.init()
	$messangi.register()
```
You can access to an API with all functions available in the Service Factory in the following link TODO::[$messangi api]() 
