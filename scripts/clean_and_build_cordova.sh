#!/usr/bin/env bash
#create a new cordova project and copy over files needed to play  
if [ -d "../cordova" ]; then
    rm -rf ../cordova
fi

cd ..
npm run build
mkdir cordova
cordova create cordova
cd cordova 

rm -rf www
rm -f config.xml
mkdir www 
mkdir resources

cp -r ../assets www
cp -r ../build www 
cp ../index.html www
cp ../config.xml ./
cp ../res/icon.png ./
cp ../res/splash.png ./



cordova platform add android@7.1.0

 cordova-icon
 cordova-splash

cordova run android 