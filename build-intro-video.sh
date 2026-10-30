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
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i /tmp/utdss-video/list.txt -c copy /tmp/utdss-video/silent.mp4
# Original ambient soundtrack: layered sine-wave chord with gentle pulse and fades.
ffmpeg -hide_banner -loglevel error -y -i /tmp/utdss-video/silent.mp4 \
  -f lavfi -i "sine=frequency=174.61:sample_rate=44100:duration=22.5" \
  -f lavfi -i "sine=frequency=261.63:sample_rate=44100:duration=22.5" \
  -f lavfi -i "sine=frequency=349.23:sample_rate=44100:duration=22.5" \
  -filter_complex "[1:a]volume=0.12[a1];[2:a]volume=0.07[a2];[3:a]volume=0.045[a3];[a1][a2][a3]amix=inputs=3:duration=shortest:normalize=0,afade=t=in:st=0:d=1.2,afade=t=out:st=20.5:d=2[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -ar 44100 -shortest /tmp/utdss-video/music.mp4
# Spoken synthetic narration layered above the original instrumental soundtrack.
espeak-ng -v en-us+f3 -s 165 -p 44 -a 175 -w /tmp/utdss-video/narration.wav "Hard to find? Let U T D S S take a closer look. When usual sourcing channels come up short, send us your specialised requirements. Share the part number, specifications, quantity and destination. Across marine, industrial, energy and aviation enquiries, our team will review what is possible. Challenge us with your requirement today."
ffmpeg -hide_banner -loglevel error -y -i /tmp/utdss-video/music.mp4 -i /tmp/utdss-video/narration.wav \
  -filter_complex "[0:a]volume=0.34[bed];[1:a]volume=2.1,adelay=650|650,apad=pad_dur=2[voice];[bed][voice]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.92[mix]" \
  -map 0:v -map "[mix]" -c:v copy -c:a aac -b:a 160k -ar 44100 -t 22.5 -movflags +faststart /app/media/utdss-why-choose-us.mp4
echo "UTDSS promotional video generated: /app/media/utdss-why-choose-us.mp4"
