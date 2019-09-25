# Fixed bug for ios platform "[cordova] Cannot read property 'toLowerCase' of undefined" 
# More info: https://github.com/apache/cordova-ios/issues/427#issuecomment-503522317
ionic cordova run ios -l -c -s -- --buildFlag="-UseModernBuildSystem=0"
