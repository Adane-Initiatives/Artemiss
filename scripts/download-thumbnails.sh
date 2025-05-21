#!/bin/bash

# Create the camera thumbnails directory if it doesn't exist
mkdir -p public/camera-thumbnails

# Download sample camera thumbnails from Unsplash
curl -s https://source.unsplash.com/random/300x200/?traffic,highway,street -o public/camera-thumbnails/ny27.jpg
curl -s https://source.unsplash.com/random/300x200/?street,intersection -o public/camera-thumbnails/main-st.jpg
curl -s https://source.unsplash.com/random/300x200/?road,avenue -o public/camera-thumbnails/titus-ave.jpg
curl -s https://source.unsplash.com/random/300x200/?boulevard,city -o public/camera-thumbnails/mt-read.jpg
curl -s https://source.unsplash.com/random/300x200/?junction,traffic -o public/camera-thumbnails/camera1.jpg
curl -s https://source.unsplash.com/random/300x200/?crossing,urban -o public/camera-thumbnails/camera2.jpg
curl -s https://source.unsplash.com/random/300x200/?street,night -o public/camera-thumbnails/camera3.jpg
curl -s https://source.unsplash.com/random/300x200/?highway,cars -o public/camera-thumbnails/camera4.jpg

echo "Downloaded thumbnails to public/camera-thumbnails/" 