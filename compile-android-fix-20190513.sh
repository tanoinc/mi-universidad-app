#!/bin/bash

# Problema: https://github.com/arnesson/cordova-plugin-firebase/issues/1057
# Solucion temporal: https://stackoverflow.com/questions/56014935/problem-with-play-services-measurement-base-on-ionic

sed -i \
-e "s/com.google.android.gms:play-services-tagmanager:+/com.google.android.gms:play-services-tagmanager:16.0.8/g" \
-e "s/com.google.firebase:firebase-core:+/com.google.firebase:firebase-core:16.0.8/g" \
-e "s/com.google.firebase:firebase-messaging:+/com.google.firebase:firebase-messaging:17.6.0/g" \
-e "s/com.google.firebase:firebase-config:+/com.google.firebase:firebase-config:16.4.1/g" \
-e "s/com.google.firebase:firebase-perf:+/com.google.firebase:firebase-perf:16.2.4/g" \
./platforms/android/project.properties

