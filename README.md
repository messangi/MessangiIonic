
## Que es IONIC
ionic es un framework para desarrollo de aplicaciones Híbridas basadas en Angular y Cordova, simplifica mucho 
el desarrollo de estas aplicaciones y veo conveniente tener como un caso especial como utilizar el plugin de Cordova del SDK en este Framework.

## Antes de comenzar

El proyecto inicial de Ionic en iOS al menos esta roto (nada que incluya el proyecto sino el de demo base que trae) 

Segun la documentacion estos son los pasos para tener corriendo un proyecto cordova

```shell
	$>npm install -g cordova ionic
	$>ionic start myApp tabs
	$>cd myApp
	$>ionic platform add ios
	$>ionic platform add android
	$>ionic build ios
	$>ionic emulate ios
```

Sin embargo siguiendo esos pasos esto da error, es necesario hacer estos también (dentro del directorio myApp)

```shell
	$>ionic resources --icon
	$>ionic state reset
```

Esto genera todos los iconos y recursos nuevamente y reinstala toda la plataforma y plugins desde 0

Todos son necesarios para poder correr los proyectos de demo.

```shell
	$>npm install -g cordova ionic
	$>ionic start myApp tabs
	$>cd myApp

	$>ionic platform rm ios
	$>ionic platform add ios
	$>ionic platform add android
	$>ionic resources --icon
	$>ionic state reset

	$>ionic prepare
	$>ionic build

	$>ionic emulate ios
```

Si desea ver el proyecto correr en el **Browser** en lugar de un emulador puede hacerlo con el comando
```shell
	$>ionic serve
```


### Opcional

También puede ser una buena idea modificar el archivo **config.xml** ya modificar el *ID*, recordar que este *ID* es que se debe utilizar en la sección de **CERTIFICADOS** siguiente y es muy importante pues es el que identifica el APP en la plataforma de iOS.

## Certificados
### iOS
En iOS para poder recibir notificaciones push es necesario hacer una gran cantidad de cosas para generar los certificados correspondientes, este proceso es largo y se explica en el siguiente link [Certificados IOS](https://www.messangi.com/documentation/doku.php?id=sdk:ios_certs) esto es **necesario** para poder continuar ya que la idea del Plugin es la recepción de notificaciones push.

### Android
El proceso para Conseguir las credenciales de Google Cloud Messaging (GCM), se debe seguir la guia que proporcionamos para ello en el siguiente link [GCM - Credentials](https://www.messangi.com/documentation/doku.php?id=sdk:android_keys) esto es **necesario** para poder continuar ya que la idea del Plugin es la recepción de notificaciones push.

## Comenzando con el plugin

Primero es necesario clonar el plugin en algún lugar que se desee

```shell
	$>git clone <usuario>@git.ogangi.com:/usr/local/gitroot/MessangiCordovaSDK.git
```

Luego de tener el proyecto base funcionando correctamente, ir al directorio base del proyecto e incluir el plugin agregando las variables necesarias de Messangi

```shell
	$>cd <path al proyecto>
	$>ionic plugin add <path a Messangi plugin> --variable APP_NAME=<Messangi Application Name> --variable PUBLIC_KEY=<Messangi Public Key or Client ID> --variable PRIVATE_KEY=<Messangi Private Key> --variable GCM_API_KEY=<Gcm Api Key> --variable GCM_PROJECT_NUMBER=<GCM Project Number>
```

|Variables|Description|Required|Platform|
|---------|-----------|--------|--------|
|APP_NAME |Esta variable es enviada a usted por el equipo de Ogangi|SI|ANDROID - iOS|
|PUBLIC_KEY|Esta variable es enviada a usted por el equipo de Ogangi|SI|ANDROID - iOS|
|PRIVATE_KEY|Esta variable es enviada a usted por el equipo de Ogangi|SI|ANDROID - iOS|
|GCM_API_KEY|Esta variable debe conseguirla mediante GCM* y solicitar su registro mediante un email a Support@ogangi.com|SI|ANDROID|
|GCM_PROJECT_NUMBER|Esta variable debe conseguirla mediante GCM* y solicitar su registro mediante un email a Support@ogangi.com|SI|ANDROID|
|MMC_URL|Esta variable es enviada a usted por el equipo de Ogangi|NO|ANDROID - iOS|
|MMC_INSTANCE_ID|Esta variable es enviada a usted por el equipo de Ogangi|NO|ANDROID - iOS|

* Variables conseguidas en la sección **Certificados** subsección **android**


----------
## Utilizando los IDE's Oficiales 

En nuestra experiencia ionic aún no es autosuficiente, esto quiere decir aún hay cosas que hacer a mano como agregar configuraciones, por lo que es necesario abrir con xCode el proyecto generado luego del **ionic build**.

### IOS
En xCode hacer click sobre **open another project** y luego buscar el proyecto generado anteriormente, luego ir al directorio **platforms > ios** y abrir el que tenga la extensión **.xcworkspace**

Una vez abierto el proyecto en xCode, seleccionar la base del proyecto ( El nombre del proyecto en el panel izquierdo ), en la sección derecha, está seleccionada la pestaña **General**, en esta pestaña se encuentra el **Bundle Identifier**, este es el mismo referenciado desde el archivo **config.xml** es recomendable no modificar esto en xCode sino en el **config.xml** y luego hacer nuevamente el comando **ionic build ios**. En esta pestaña también está la información de signin y deploy.

En la pestaña **Capabilities** deben encenderse por lo menos las siguientes: 

- Push Notifications
- Background Modes
	- Location updates
	- Uses Bluetooth LE accessories
	- Background fetch
	- Remote notifications
- Associated Domains 	

**Nota:** Cualquier error que aparezca en este punto puede ser responsable de algún error cuando se genero el certificado.

### Android
El caso de android es mucho mas estable, no se requiere configuraciones especiales, pero si igualmente desea abrir el proyecto en **Android Studio** puede hacerlo sin problema solo seleccione **file > Open...** en Android Studio busque la carpeta **platforms** seleccione **android** y de clic en **aceptar**.

## Configurando el Plugin
Ya en este punto se debe tener el plugin instalado y listo para su uso, no hay nada más que hacer

### Utilizando el Service Factory 
En Ogangi proveemos un Angular Service para utilizar el Plugin de Cordova puedes verlo en el siguiente gist : [MessangiService.js](https://gist.github.com/jmtt89/4294b059c90bb0e32ec8cba25362cf7a)

Luego de agregar este **Factory** solo es necesario agregar **$messangi** en el controller que se desee utilizar alguna de las funciones de Messangi, seguido de la función que se desee utilizar. Para el funcionamiento básico solo es necesario hacer:

```js
	$messangi.init()
	$messangi.register()
```

Puede acceder a un API con todas las funciones disponibles en el Service Factory en el siguiente link TODO::[$messangi api]() 

Puede ver el proyecto de Ejemplo que hace uso de este Service Factory en el siguiente link TODO::[Ionic Demo]()

## Credenciales utilizadas para esta aplicacione 
