#!/bin/bash
bash prepare.sh
source ./parameters.config

ionic cordova platform add android

sed -i -e "s/    apply plugin: com.google.gms.googleservices.GoogleServicesPlugin/    \/\/apply plugin: com.google.gms.googleservices.GoogleServicesPlugin/g" ./platforms/android/cordova-support-google-services/$APP_NAME-build.gradle

if ! grep -q fb_app_id "./platforms/android/app/src/main/res/values/strings.xml"; then
  sed -i -e "s/<\/resources>/<string name=\"fb_app_id\">$FACEBOOK_APP_ID<\/string>\n<string name=\"fb_app_name\">$FACEBOOK_APP_NAME<\/string>\n<\/resources>/g" ./platforms/android/app/src/main/res/values/strings.xml
fi

if ! grep -q miuniversidad "./platforms/android/app/src/main/res/values/colors.xml"; then
  sed -i -e "s/<\/resources>/<color name=\"miuniversidad\">${MAIN_COLOR}FF<\/color>\n<\/resources>/g" ./platforms/android/app/src/main/res/values/colors.xml
fi

echo "* $APP_NAME_FULL: Plataforma android Configurada!"

ionic cordova build android
