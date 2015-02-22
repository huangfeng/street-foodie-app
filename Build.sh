# Build commands for Jenkins / CI
# The release `.apk` will end up at `platforms/android/ant-build/StreetFoodie-release.apk`
#
# Example usage for Jenkins:
#
# # Used by phonegap
# export PATH=$PATH:/opt/android-sdk/platform-tools/:/opt/android-sdk/tools/
# export ANDROID_HOME=/opt/android-sdk/
# export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/
# # Used by grunt replace:*. BUILD_NUMBER comes from Jenkins
# export BUILD_BRANCH=dev
# # Running build file:
# sh ./Build.sh
# # Rename the resulting file
# mv phonegap/platforms/android/ant-build/StreetFoodie-release.apk phonegap/platforms/android/ant-build/# StreetFoodie-release-dev-$BUILD_NUMBER.apk
#
npm install
grunt build
grunt replace:androidversion --buildnum=$BUILD_NUMBER --branch=$BUILD_BRANCH
grunt replace:appversion --buildnum=$BUILD_NUMBER --branch=$BUILD_BRANCH
cd phonegap
phonegap build android
grunt replace:androidmanifest --buildnum=$BUILD_NUMBER --branch=$BUILD_BRANCH
./generate-icon.sh
./generate-splash.sh
phonegap local plugin add https://github.com/Telerik-Verified-Plugins/Toast
phonegap local plugin add org.apache.cordova.camera
phonegap local plugin add org.apache.cordova.splashscreen
phonegap local plugin add org.apache.cordova.file
phonegap local plugin add org.apache.cordova.inappbrowser
phonegap local plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
phonegap local plugin add https://github.com/appfeel/admob-google-cordova.git
cp $SF_KEYSTORE platforms/android/streetfoodie.keystore
cp $SF_ANTPROPS platforms/android/ant.properties
platforms/android/cordova/build --release
cd ..
