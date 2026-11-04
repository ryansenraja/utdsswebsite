#!/bin/sh
set -eu
# UTDSS 2026 sector-specialisation corporate film.
# Industry imagery is illustrative. No footage of people, meetings or named ships is intentionally used.
# A technical navy motion-graphics fallback is provided if a source photo is unavailable.
mkdir -p /app/media /tmp/utdss-specialisation-film
D=/tmp/utdss-specialisation-film
FONT=/usr/share/fonts/ttf-dejavu/DejaVuSans-Bold.ttf
REGULAR=/usr/share/fonts/ttf-dejavu/DejaVuSans.ttf
FPS=24
SECONDS=8
FILE="/app/media/utdss-specialisation-film.mp4"

scene() {
  n="$1"; title="$2"; subtitle="$3"; url="$4"
  still="$D/photo-$n.jpg"
  # The landscape photo shows the technical sector; no human-portrait or office sources are selected.
  if [ -n "$url" ]; then
    wget -q -T 28 -O "$still" "$url" || true
  fi
  if [ -s "$still" ] && ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$still" | grep -Eq '^[1-9][0-9]{2,}$'; then
    echo "Building specialised sector scene $n"
    ffmpeg -nostdin -hide_banner -loglevel error -y -loop 1 -framerate 24 -i "$still" -t "$SECONDS" \
      -vf "scale=2080:1170:force_original_aspect_ratio=increase:flags=lanczos,crop=2080:1170,zoompan=z='min(zoom+0.00022,1.065)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=24,eq=contrast=1.08:saturation=0.70,drawbox=x=0:y=0:w=1920:h=1080:color=0x061729@0.43:t=fill,drawbox=x=0:y=660:w=1920:h=420:color=0x061729@0.69:t=fill,drawbox=x=135:y=788:w=74:h=3:color=0xd8b77c:t=fill,drawtext=fontfile=$FONT:text='$title':fontcolor=white:fontsize=56:x=135:y=834,drawtext=fontfile=$REGULAR:text='$subtitle':fontcolor=0xe5eaf0:fontsize=27:x=138:y=933,fade=t=in:st=0:d=0.65,fade=t=out:st=7.25:d=0.75,format=yuv420p" \
      -an -r 24 -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p "$D/scene$n.mp4"
  else
    echo "Source image missing for $n — using technical motion graphic" >&2
    ffmpeg -nostdin -hide_banner -loglevel error -y -f lavfi -i "color=c=0x0a263c:s=1920x1080:r=24:d=8" \
      -vf "drawgrid=w=130:h=130:t=1:c=0xa9c0cf@0.13,drawbox=x=145:y=670:w=1600:h=2:color=0xd8b77c@0.6:t=fill,drawbox=x=145:y=742:w=70:h=3:color=0xd8b77c:t=fill,drawtext=fontfile=$FONT:text='$title':fontcolor=white:fontsize=57:x=145:y=809,drawtext=fontfile=$REGULAR:text='$subtitle':fontcolor=0xe5eaf0:fontsize=27:x=150:y=911,fade=t=in:st=0:d=0.7,fade=t=out:st=7.25:d=0.75,format=yuv420p" \
      -an -c:v libx264 -preset veryfast -crf 21 "$D/scene$n.mp4"
  fi
  test -s "$D/scene$n.mp4" || { echo "Failed to create scene $n" >&2; exit 1; }
}
brand_scene() {
 n="$1"; line="$2"; second="$3"; third="$4"
 ffmpeg -nostdin -hide_banner -loglevel error -y -f lavfi -i "color=c=0x061b31:s=1920x1080:r=24:d=8" \
  -vf "drawgrid=w=160:h=160:t=1:c=0xb7cddd@0.08,drawbox=x=650:y=320:w=620:h=3:color=0xd8b77c:t=fill,drawtext=fontfile=$FONT:text='$line':fontcolor=white:fontsize=58:x=(w-text_w)/2:y=396,drawtext=fontfile=$REGULAR:text='$second':fontcolor=0xd8b77c:fontsize=28:x=(w-text_w)/2:y=515,drawtext=fontfile=$REGULAR:text='$third':fontcolor=0xdce7ef:fontsize=26:x=(w-text_w)/2:y=625,fade=t=in:st=0:d=1.05,fade=t=out:st=7.1:d=0.9,format=yuv420p" \
  -an -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p "$D/scene$n.mp4"
}
# Original studio title and sector-specific imagery. Photos sourced from the
# same Pexels collection already used on the UTDSS website.
brand_scene 01 "UNITED SHIPPING SERVICES" "SPECIALISED SUPPLY SOLUTIONS" "Complex requirements. Clearer sourcing."
ffmpeg -nostdin -hide_banner -loglevel error -y -ss 3 -i "$D/scene01.mp4" -frames:v 1 -q:v 2 /app/media/utdss-specialisation-poster.jpg
scene 02 "MARITIME AND MARINE SUPPLY" "Vessel equipment. Technical parts. Marine requirements." "https://images.pexels.com/photos/13433785/pexels-photo-13433785.jpeg?auto=compress&cs=tinysrgb&w=2400"
scene 03 "ENERGY AND OFFSHORE" "Technical equipment and complex operating environments." "https://images.pexels.com/photos/12367513/pexels-photo-12367513.jpeg?auto=compress&cs=tinysrgb&w=2400"
scene 04 "INDUSTRIAL COMPONENTS" "Parts identification. Equipment and specifications." "https://images.pexels.com/photos/3735930/pexels-photo-3735930.jpeg?auto=compress&cs=tinysrgb&w=2400"
scene 05 "INSTITUTIONAL PROCUREMENT" "Structured specifications and technical supply enquiries." "https://images.pexels.com/photos/3735930/pexels-photo-3735930.jpeg?auto=compress&cs=tinysrgb&w=2400"
scene 06 "AVIATION SUPPORT" "Specialised ground-support equipment enquiries." "https://images.pexels.com/photos/32128674/pexels-photo-32128674.jpeg?auto=compress&cs=tinysrgb&w=2400"
brand_scene 07 "IDENTIFY. SPECIFY. SOURCE." "FROM REQUIREMENT TO ENQUIRY" "NSN  /  MPN  /  Technical specifications"
brand_scene 08 "HARD TO FIND?" "LET UTDSS TAKE A LOOK." "www.utdss.com"
: > "$D/playlist.txt"
for n in 01 02 03 04 05 06 07 08; do
 printf "file '%s/scene%s.mp4'\n" "$D" "$n" >> "$D/playlist.txt"
done
ffmpeg -nostdin -hide_banner -loglevel error -y -f concat -safe 0 -i "$D/playlist.txt" -c copy "$D/silent.mp4"
# Original piano-like score, intentionally gentle and free from voice-over.
cat > "$D/score.py" <<'PY'
import math, wave, array
sr=32000
duration=64
samples=array.array('f',[0])*int(sr*duration)
chords=[
 (0,[261.63,329.63,392]),(8,[220,293.66,349.23]),
 (16,[246.94,329.63,392]),(24,[196,261.63,329.63]),
 (32,[220,293.66,349.23]),(40,[246.94,329.63,392]),
 (48,[196,261.63,329.63]),(56,[261.63,329.63,392])]
for start,tones in chords:
 for offset,f in enumerate(tones):
  at=int((start+offset*0.19)*sr)
  for j in range(min(int(4.8*sr),len(samples)-at)):
   t=j/sr;env=(1-math.exp(-t*90))*math.exp(-t*0.94)
   samples[at+j]+=0.11*env*(math.sin(2*math.pi*f*t)+0.20*math.sin(2*math.pi*f*2*t)*math.exp(-t*2.8))
 for i,f in enumerate(tones):
  at=int((start+4.2+i*0.5)*sr)
  for j in range(min(int(2.0*sr),len(samples)-at)):
   t=j/sr
   samples[at+j]+=0.063*math.exp(-t*1.7)*math.sin(2*math.pi*f*2*t)
out=array.array('h')
for i,v in enumerate(samples):
 fade=max(0,min(1,i/(sr*1.7),(len(samples)-i)/(sr*4.4)))
 out.append(int(max(-1,min(1,v*fade))*23000))
with wave.open('/tmp/utdss-specialisation-film/score.wav','wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(out.tobytes())
PY
python3 "$D/score.py"
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$D/silent.mp4" -i "$D/score.wav" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 160k -ar 48000 -shortest \
  -movflags +faststart "$FILE"
test -s "$FILE" || { echo "Corporate film missing" >&2; exit 1; }
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$FILE"
echo "UTDSS SPECIALISATION FILM: 64 SECONDS, 1080P, INSTRUMENTAL, SECTOR FOCUS, NO GENERIC PEOPLE FOOTAGE"
