import sys, glob
from PIL import Image, ImageDraw
d=sys.argv[1]; out=sys.argv[2]
fs=sorted(glob.glob(d+'/*.jpg'))
ims=[Image.open(f).resize((640,360)) for f in fs]
rows=(len(ims)+1)//2
S=Image.new('RGB',(1280,360*rows))
for i,im in enumerate(ims):
    S.paste(im,((i%2)*640,(i//2)*360)); ImageDraw.Draw(S).text(((i%2)*640+8,(i//2)*360+20),fs[i].split('/')[-1],fill='white')
S.save(out)
