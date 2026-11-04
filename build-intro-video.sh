#!/bin/sh
set -eu
# UTDSS premium corporate film: six scenes, 1080p/24fps, original piano, no narration.
# Source clips: Pexels License. Locations/operations shown are illustrative, not UTDSS assets.
mkdir -p /app/media /tmp/utdss-video
FONT=/usr/share/fonts/ttf-dejavu/DejaVuSans-Bold.ttf
REGULAR=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf
D=/tmp/utdss-video
FPS=24
OUT_W=1920
OUT_H=1080
# Stock footage remaining: licensed Pexels industrial/maritime scene sources 5846709, 6285685, 35069289, 31751330.
# Fallback URL is the same free-license clip at native file resolution.
clip() {
  id="$1"; url="$2"; line1="$3"; line2="$4"
  echo "Preparing cinematic scene $id from licensed video"
  # Full HD decode from genuine video, never enlarge thumbnail imagery.
  if ! ffmpeg -nostdin -hide_banner -loglevel error -y -rw_timeout 35000000 -i "$url" -t 5.85 \
    -vf "fps=24,scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,eq=contrast=1.055:saturation=0.87,drawbox=x=0:y=0:w=1920:h=1080:color=0x051a30@0.14:t=fill,drawbox=x=0:y=760:w=1920:h=320:color=0x061a32@0.50:t=fill,drawbox=x=122:y=851:w=65:h=4:color=0xdac289:t=fill,drawtext=fontfile=$FONT:text='$line1':fontcolor=white:fontsize=58:x=123:y=885,drawtext=fontfile=$REGULAR:text='$line2':fontcolor=0xe5ebf3:fontsize=27:x=127:y=986,fade=t=in:st=0:d=0.8,fade=t=out:st=5.1:d=0.7,format=yuv420p" \
    -an -r 24 -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p -t 5.85 "$D/scene$id.mp4"; then
    echo "ERROR: Scene $id footage download/encode failed; aborting rather than publishing low-resolution stills" >&2
    exit 1
  fi
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$D/scene$id.mp4" | grep -q '1920,1080' || { echo "Video scene $id failed Full HD dimension validation"; exit 1; }
}
# Opening title is generated from original UTDSS branding instead of a named stock vessel.
# This deliberately removes the identifiable third-party ship rather than smearing its name.
ffmpeg -nostdin -hide_banner -loglevel error -y -f lavfi -i "color=c=0x071c36:s=1920x1080:r=24:d=5.85" \
  -vf "drawbox=x=605:y=367:w=710:h=3:color=0xdac289:t=fill,drawtext=fontfile=$FONT:text='UNITED SHIPPING SERVICES':fontcolor=white:fontsize=65:x=(w-text_w)/2:y=425,drawtext=fontfile=$REGULAR:text='SPECIALISED SUPPLY AND SOURCING':fontcolor=0xdac289:fontsize=29:x=(w-text_w)/2:y=550,drawtext=fontfile=$REGULAR:text='Singapore':fontcolor=0xc9d9e7:fontsize=24:x=(w-text_w)/2:y=635,fade=t=in:st=0:d=0.95,fade=t=out:st=5.12:d=0.73,format=yuv420p" \
  -an -r 24 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -t 5.85 "$D/scene01.mp4"
ffmpeg -nostdin -hide_banner -loglevel error -y -ss 2 -i "$D/scene01.mp4" -frames:v 1 -q:v 2 /app/media/utdss-film-poster.jpg
clip 02 "https://videos.pexels.com/video-files/5846709/5846709-hd_1920_1080_25fps.mp4" "NOT EVERY REQUIREMENT IS SIMPLE" "Technical needs deserve a closer look"
clip 03 "https://videos.pexels.com/video-files/6285685/6285685-uhd_3840_2160_30fps.mp4" "PRECISION BEGINS WITH DETAILS" "NSN   /   MPN   /   Specifications"
clip 04 "https://videos.pexels.com/video-files/31751330/13528046_3840_2160_25fps.mp4" "ACROSS INDUSTRIES" "Maritime  /  Industrial  /  Energy  /  Aviation"
clip 05 "https://videos.pexels.com/video-files/35069289/14855219_3840_2160_30fps.mp4" "YOUR REQUIREMENTS MATTER" "Considered sourcing support"
# Distinct sixth scene: elegant brand card, not low-resolution footage.
ffmpeg -nostdin -hide_banner -loglevel error -y -f lavfi -i "color=c=0x071d36:s=1920x1080:r=24:d=6" \
  -vf "drawbox=x=683:y=358:w=554:h=3:color=0xdac289:t=fill,drawtext=fontfile=$FONT:text='UNITED SHIPPING SERVICES':fontcolor=white:fontsize=62:x=(w-text_w)/2:y=420,drawtext=fontfile=$REGULAR:text='SPECIALISED SUPPLY AND SOURCING':fontcolor=0xdac289:fontsize=28:x=(w-text_w)/2:y=525,drawtext=fontfile=$REGULAR:text='Utdss@singnet.com':fontcolor=0xecf2f8:fontsize=30:x=(w-text_w)/2:y=625,fade=t=in:st=0:d=1.1,fade=t=out:st=5.1:d=0.9,format=yuv420p" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -t 6 -an "$D/scene06.mp4"
printf "file '$D/scene01.mp4'\nfile '$D/scene02.mp4'\nfile '$D/scene03.mp4'\nfile '$D/scene04.mp4'\nfile '$D/scene05.mp4'\nfile '$D/scene06.mp4'\n" > "$D/list.txt"
ffmpeg -nostdin -hide_banner -loglevel error -y -f concat -safe 0 -i "$D/list.txt" -c copy "$D/silent.mp4"
# Musical score: original, restrained piano-style instrument with natural decays and soft ending.
cat > "$D/piano.py" <<'PY'
import math, wave, array
sr=32000
duration=35.25
notes=[
(0,261.63),(0,329.63),(0,392.00),(2.7,329.63),(3.8,392.00),
(5.85,220),(5.85,293.66),(5.85,349.23),(8,293.66),(9.4,349.23),
(11.7,246.94),(11.7,329.63),(11.7,392),(14.4,493.88),(15.3,392),
(17.55,196),(17.55,261.63),(17.55,329.63),(20.1,392),(21.6,329.63),
(23.4,220),(23.4,293.66),(23.4,349.23),(25.8,440),(27.0,349.23),
(29.25,261.63),(29.25,329.63),(29.25,392),(31.6,523.25),(32.6,392),(33.4,261.63)]
samples=[0.0]*int(sr*duration)
for start,f in notes:
  for j in range(int(min(3.25,duration-start)*sr)):
    t=j/sr
    env=(1-math.exp(-t*110))*math.exp(-t*1.24)
    wavelet=(math.sin(2*math.pi*f*t)+0.28*math.sin(2*math.pi*2*f*t)*math.exp(-t*3)+0.11*math.sin(2*math.pi*3*f*t)*math.exp(-t*7))
    samples[int(start*sr)+j]+=0.15*env*wavelet
arr=array.array('h')
for i,v in enumerate(samples):
  fade=min(1,i/(sr*1.5),(len(samples)-i)/(sr*3.3))
  arr.append(int(max(-1,min(1,v*max(0,fade)))*27000))
with wave.open('/tmp/utdss-video/piano.wav','wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(arr.tobytes())
PY
python3 "$D/piano.py"
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$D/silent.mp4" -i "$D/piano.wav" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "/app/media/utdss-corporate-film-v2.mp4"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 "/app/media/utdss-corporate-film-v2.mp4"
echo "UTDSS CINEMATIC FILM GENERATED IN FULL HD: ORIGINAL BRAND OPENING, LICENSED STOCK CLIPS, NO NAMED OPENING VESSEL AND NO VOICEOVER"
