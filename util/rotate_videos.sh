#!/bin/bash
for file in *.mp4
do
  ffmpeg -i "$file" -vf "transpose=1" "../videos_portriat/${file}"
done