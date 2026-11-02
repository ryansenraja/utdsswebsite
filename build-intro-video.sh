#!/bin/sh
set -eu
mkdir -p /app/media /tmp/utdss-video
FONT=/usr/share/fonts/ttf-dejavu/DejaVuSans-Bold.ttf
# Quiet, cinematic design: high-definition images, generous negative space and minimal copy.
# One restrained headline per scene, with piano instrumental only.
FONT_REG=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf
make_scene() {
  id="$1"; source="$2"; title="$3"; subtitle="$4"
  ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 24 -i "/app/assets/$source" -t 4.5 \
    -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=contrast=1.04:saturation=0.91,drawbox=x=0:y=0:w=1280:h=720:color=0x07192b@0.20:t=fill,drawbox=x=0:y=440:w=1280:h=280:color=0x07192b@0.56:t=fill,drawbox=x=92:y=548:w=52:h=4:color=0xd5b779@0.98:t=fill,drawtext=fontfile=$FONT:text='$title':fontcolor=white:fontsize=49:x=92:y=579,drawtext=fontfile=$FONT_REG:text='$subtitle':fontcolor=0xe7edf5:fontsize=22:x=94:y=652,fade=t=in:st=0:d=0.7,fade=t=out:st=3.85:d=0.65,format=yuv420p" \
    -an -c:v libx264 -preset medium -crf 20 -r 24 -pix_fmt yuv420p -movflags +faststart "/tmp/utdss-video/$id.mp4"
}
make_scene 01 hero-ship.webp "SPECIALISED SOURCING" "United Shipping Services Pte Ltd"
make_scene 02 marine.webp "BEYOND STANDARD CATALOGUES" "Every requirement deserves a closer look"
make_scene 03 hardware.webp "THE DETAILS MAKE A DIFFERENCE" "Part numbers. Specifications. Precision."
make_scene 04 hero-air.webp "ACROSS INDUSTRIES" "Marine  /  Energy  /  Industrial  /  Aviation"
make_scene 05 office.webp "YOUR REQUIREMENT. OUR FOCUS." "Utdss@singnet.com"
printf "file '/tmp/utdss-video/01.mp4'\nfile '/tmp/utdss-video/02.mp4'\nfile '/tmp/utdss-video/03.mp4'\nfile '/tmp/utdss-video/04.mp4'\nfile '/tmp/utdss-video/05.mp4'\n" > /tmp/utdss-video/list.txt
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i /tmp/utdss-video/list.txt -c copy /tmp/utdss-video/silent.mp4
# Original piano-style instrumental. Each note has a struck-key attack and decaying harmonics.
# Generate a short melodic progression using layered harmonics with no voice or third-party music.
cat > /tmp/utdss-video/piano.py <<'PY'
import math, wave, array, random
sr=22050
duration=22.5
samples=array.array('h',[0])*int(sr*duration)
random.seed(8)
notes=[(0,261.63),(0,329.63),(0,392.00),(2.7,329.63),(3.4,392.00),
(4.5,293.66),(4.5,349.23),(4.5,440.00),(6.4,349.23),(7.2,440.00),
(9,246.94),(9,293.66),(9,392.00),(10.7,293.66),(11.5,392.00),
(13.5,261.63),(13.5,329.63),(13.5,392.00),(15.1,523.25),
(16.4,440.00),(17.3,392.00),(18.2,329.63),(19.1,293.66),(20.0,261.63)]
# soft synthesized piano timbre: harmonics, fast percussive onset, exponential decay
audio=[0.0]*len(samples)
for start,f in notes:
  count=int(min(2.8,duration-start)*sr)
  for i in range(count):
    t=i/sr
    envelope=(1-math.exp(-t*100))*math.exp(-t*1.45)
    note=(math.sin(2*math.pi*f*t)+0.35*math.sin(2*math.pi*2*f*t)*math.exp(-t*3)+0.14*math.sin(2*math.pi*3*f*t)*math.exp(-t*6))
    audio[int(start*sr)+i]+=0.17*envelope*note
for i,v in enumerate(audio):
  fade=min(1,i/(sr*0.8),(len(audio)-i)/(sr*1.7))
  samples[i]=int(max(-1,min(1,v*max(0,fade)))*27000)
with wave.open('/tmp/utdss-video/piano.wav','wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(samples.tobytes())
PY
python3 /tmp/utdss-video/piano.py
ffmpeg -hide_banner -loglevel error -y -i /tmp/utdss-video/silent.mp4 -i /tmp/utdss-video/piano.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart /app/media/utdss-why-choose-us.mp4
echo "UTDSS promotional video generated: /app/media/utdss-why-choose-us.mp4"
