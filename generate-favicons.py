#!/usr/bin/env python3
"""Generate UTDSS favicon PNG and ICO using only Python standard library."""
import struct,zlib,math,pathlib
ROOT=pathlib.Path('/app')
def png(size):
    # 4x supersampling improves small tab-icon edges.
    m=4; n=size*m
    raw=bytearray()
    def shade(x,y):
        X=(x+.5)/m;Y=(y+.5)/m
        if X<2 or X>size-2 or Y<2 or Y>size-2: return (0,0,0,0)
        navy=(8,31,57,255)
        # Rectangular gold U with rounded bottom, readable in a tiny tab.
        sx=X/size;sy=Y/size
        left=abs(sx-.245)<.072 and .23<sy<.65
        right=abs(sx-.755)<.072 and .23<sy<.65
        bottom=((sx-.5)/.255)**2+((sy-.645)/.205)**2<1 and sy>.60 and abs(((sx-.5)/.255)**2+((sy-.645)/.205)**2-.48) < .60
        # U bottom shaped by ring on ellipse, with open top.
        outer=((sx-.5)/.328)**2+((sy-.625)/.29)**2 <= 1
        inner=((sx-.5)/.185)**2+((sy-.625)/.145)**2 < 1
        u = left or right or (outer and not inner and sy>.59)
        return ((219,182,108,255) if u else navy)
    pixels=[]
    for y in range(size):
        row=[]
        for x in range(size):
            colours=[shade(x*m+dx,y*m+dy) for dy in range(m) for dx in range(m)]
            row+= [tuple(round(sum(c[k] for c in colours)/(m*m)) for k in range(4))]
        pixels.append(row)
    for row in pixels:
        raw.append(0)
        for px in row:raw.extend(px)
    def chunk(tag,data):return struct.pack('!I',len(data))+tag+data+struct.pack('!I',zlib.crc32(tag+data)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',size,size,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')
p32=png(32);p64=png(64)
(ROOT/'favicon.png').write_bytes(p64)
# ICO embeds two resolution PNG images, a standard browser compatible format.
header=struct.pack('<HHH',0,1,2);offset=6+16*2;entries=[]
for size,blob in [(32,p32),(64,p64)]:
    entries.append(struct.pack('<BBBBHHII',size,size,0,0,1,32,len(blob),offset))
    offset+=len(blob)
(ROOT/'favicon.ico').write_bytes(header+b''.join(entries)+p32+p64)
print('UTDSS PNG and ICO generated',len(p64),len(p32))
