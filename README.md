# Mi Universidad: Aplicación móvil
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Proyecto "Mi Universidad": Aplicación móvil (cliente)

## Instalación

Requiere tener instalado npm

1. Renombrar config.xml.template a config.xml

2. Renombrar package.json.template a package.json

3. Reemplazar en config.xml y package.json los valores encerrados con %: %APP_VENDOR%, %APP_NAME%, %APP_NAME_FULL%, %APP_NAME_DESCRIPTION%, %FACEBOOK_APP_ID%, %FACEBOOK_APP_NAME%, %API_KEY_FOR_ANDROID%, %API_KEY_FOR_IOS%

4. Copiar src/config/config.example.ts a src/config/config.dev.ts o src/config/config.prod.ts y configurar parámetros.

5. Obtener desde Google Firebase "google-services.json" y guardarlo a la raiz del proyecto 

6. npm install

## Previo a compilar (Android)

1. Comentar línea 16 de ./platforms/android/cordova-support-google-services/<APP_NAME>-build.gradle: https://github.com/arnesson/cordova-plugin-firebase/issues/742#issuecomment-398794131 y https://github.com/arnesson/cordova-plugin-firebase/issues/988#issuecomment-455198728

2. Agregar en `platforms/android/app/src/main/res/values/strings.xml`
```
        <string name="fb_app_id">%FACEBOOK_APP_ID%</string>
        <string name="fb_app_name">%FACEBOOK_APP_NAME%</string>
```

## TO DO

* Agregar información de los permisos al agregar servicios que no requieren autenticación.
