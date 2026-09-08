#!/usr/bin/env python3
"""Find publicly available portrait photos (Wikipedia/Wikimedia Commons) for prominent authors. Conservative matching."""
import json,urllib.request,urllib.parse,time,sys,os,re,base64,io
S=os.environ.get('ASC_SCRATCH','/tmp/claude-0/-home-user-Android-Fable5p1-ASC2026-conference-breakdown/22e803a5-16ae-5ba4-91b7-cbd9a897b501/scratchpad')
d=json.load(open(S+'/build/data.json'))
cx=json.load(open(S+'/build/enrich_crossref.json')) if os.path.exists(S+'/build/enrich_crossref.json') else {}
out_path=S+'/build/enrich_wiki.json'
out=json.load(open(out_path)) if os.path.exists(out_path) else {}
def score(p): return cx.get(p['key'],{}).get('n',0)*2+len(p['pres'])+(50 if p.get('plenary') else 0)+(5 if p.get('chairs') else 0)
cands=sorted([p for p in d['people'] if not p.get('photo')],key=lambda p:-score(p))[:260]
UA={'User-Agent':'ASC2026ConferenceApp/0.1 (https://github.com/BartOMan; mailto:bartomccoy@gmail.com)'}
def get(url):
    for attempt in range(4):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60); return r.read()
        except urllib.error.HTTPError as e:
            if e.code==404: return None
            print('http',e.code,url[:80],file=sys.stderr); time.sleep(5*(attempt+1))
        except Exception as e:
            print('err',e,file=sys.stderr); time.sleep(5*(attempt+1))
    return None
KEY=re.compile(r'superconduct|physicist|engineer|cryogen|magnet|quantum|accelerator|fusion|materials scientist|electrical|Josephson|SQUID|detector',re.I)
for i,p in enumerate(cands):
    if p['key'] in out: continue
    name=p['name']; last=p['key'].split()[-1]
    res={'found':False}
    try:
        sr=get('https://en.wikipedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','list':'search','srsearch':'"%s"'%name,'format':'json','srlimit':3}))
        time.sleep(1.0)
        hits=json.loads(sr)['query']['search'] if sr else []
        for h in hits:
            title=h['title']
            if last not in re.sub(r'[^a-z]','',title.lower()) : continue
            sm=get('https://en.wikipedia.org/api/rest_v1/page/summary/'+urllib.parse.quote(title.replace(' ','_')))
            time.sleep(1.0)
            if not sm: continue
            j=json.loads(sm)
            if j.get('type')!='standard': continue
            ext=j.get('extract','')
            tl=re.sub(r'[^a-z]','',j.get('title','').lower())
            # the page title must contain the last name and the first name (or initial)
            first=p['key'].split()[0]
            if last not in tl or first[:3] not in tl: continue
            if not KEY.search(ext+' '+j.get('description','')): continue
            th=j.get('thumbnail',{}).get('source')
            res={'found':True,'title':j['title'],'url':j.get('content_urls',{}).get('desktop',{}).get('page',''),'desc':j.get('description',''),'extract':ext[:600]}
            if th:
                img=get(th); time.sleep(0.5)
                if img:
                    try:
                        from PIL import Image
                        im=Image.open(io.BytesIO(img)).convert('RGB'); w,hh=im.size
                        tw,thh=160,213; r=max(tw/w,thh/hh); im=im.resize((max(1,int(w*r)),max(1,int(hh*r))))
                        w2,h2=im.size; left=(w2-tw)//2; top=max(0,(h2-thh)//3); im=im.crop((left,top,left+tw,top+thh))
                        b=io.BytesIO(); im.save(b,'JPEG',quality=70,optimize=True)
                        res['photo']='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
                    except Exception as e: print('img',e,file=sys.stderr)
            break
    except Exception as e:
        print('fail',name,e,file=sys.stderr)
    out[p['key']]=res
    if i%10==0: json.dump(out,open(out_path,'w')); print('progress',i,sum(1 for v in out.values() if v.get('photo')),file=sys.stderr)
json.dump(out,open(out_path,'w')); print('DONE wiki',len(out),sum(1 for v in out.values() if v.get('photo')),file=sys.stderr)
