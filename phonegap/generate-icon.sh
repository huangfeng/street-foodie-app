#!/bin/bash
convert -geometry 128x128 icon.png platforms/android/res/drawable/icon.png
convert -geometry 72x72 icon.png platforms/android/res/drawable-hdpi/icon.png
convert -geometry 36x36 icon.png platforms/android/res/drawable-ldpi/icon.png
convert -geometry 48x48 icon.png platforms/android/res/drawable-mdpi/icon.png
convert -geometry 96x96 icon.png platforms/android/res/drawable-xhdpi/icon.png
