#!/bin/sh
set -eu
mkdir -p /app/media /tmp/utdss-video
FONT=/usr/share/fonts/ttf-dejavu/DejaVuSans-Bold.ttf
make_scene() {
  id="$1"; source="$2"; title="$3"; subtitle="$4"; color="$5"
  ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 18 -i "/app/assets/$source" -t 4.5 \
    -vf "scale=960:540:force_original_aspect_ratio=increase,crop=960:540,drawbox=x=0:y=0:w=960:h=540:color=0x071a33@0.68:t=fill,drawbox=x=68:y=155:w=7:h=225:color=0xd5ad65@1:t=fill,drawtext=fontfile=$FONT:text='UNITED SHIPPING SERVICES PTE LTD':fontcolor=0xd5ad65:fontsize=22:x=94:y=158,drawtext=fontfile=$FONT:text='$title':fontcolor=white:fontsize=42:x=94:y=230,drawtext=fontfile=$FONT:text='$subtitle':fontcolor=0xe4edf7:fontsize=21:x=94:y=312,fade=t=in:st=0:d=0.55,fade=t=out:st=3.95:d=0.55,format=yuv420p" \
    -an -c:v libx264 -preset veryfast -crf 26 -r 18 -movflags +faststart "/tmp/utdss-video/$id.mp4"
}
make_scene 01 hero-ship.webp "HARD TO FIND?" "Let UTDSS take a closer look." "#0d3559"
make_scene 02 marine.webp "SPECIALISED SOURCING" "When usual channels come up short." "#0d3559"
make_scene 03 hardware.webp "SHARE YOUR PART NUMBER" "NSN, MPN, model and specifications." "#0d3559"
make_scene 04 hero-air.webp "MULTI-SECTOR ENQUIRIES" "Marine, industrial, energy and aviation." "#0d3559"
make_scene 05 office.webp "CHALLENGE US WITH YOUR REQUIREMENT" "utdss@singnet.com.sg" "#0d3559"
printf "file '/tmp/utdss-video/01.mp4'\nfile '/tmp/utdss-video/02.mp4'\nfile '/tmp/utdss-video/03.mp4'\nfile '/tmp/utdss-video/04.mp4'\nfile '/tmp/utdss-video/05.mp4'\n" > /tmp/utdss-video/list.txt
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i /tmp/utdss-video/list.txt -c copy -movflags +faststart /app/media/utdss-why-choose-us.mp4
echo "UTDSS promotional video generated: /app/media/utdss-why-choose-us.mp4"
