#!/bin/bash

convert -geometry 400x800 screen-port.png platforms/android/res/drawable-port-hdpi/screen.png
convert -geometry 200x320 screen-port.png platforms/android/res/drawable-port-ldpi/screen.png
convert -geometry 320x480 screen-port.png platforms/android/res/drawable-port-mdpi/screen.png
convert -geometry 720x1280 screen-port.png platforms/android/res/drawable-port-xhdpi/screen.png

convert -geometry 400x800 screen-land.png platforms/android/res/drawable-land-hdpi/screen.png
convert -geometry 200x320 screen-land.png platforms/android/res/drawable-land-ldpi/screen.png
convert -geometry 320x480 screen-land.png platforms/android/res/drawable-land-mdpi/screen.png
convert -geometry 720x1280 screen-land.png platforms/android/res/drawable-land-xhdpi/screen.png
