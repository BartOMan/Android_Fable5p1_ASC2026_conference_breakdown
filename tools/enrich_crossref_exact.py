#!/usr/bin/env python3
"""Exact-match pass: count IEEE TASC papers where an author record has the same family name and a compatible given name."""
import json,urllib.request,urllib.parse,time,sys,os,re,unicodedata,concurrent.futures
S=os.environ.get('ASC_SCRATCH','/tmp/claude-0/-home-user-Android-Fable5p1-ASC2026-conference-breakdown/22e803a5-16ae-5ba4-91b7-cbd9a897b501/scratchpad')
d=json.load(open(S+'/build/data.json'))
inp=S+'/build/enrich_crossref.json'; out_path=S+'/build/enrich_crossref_exact.json'
old=json.load(open(inp)) if os.path.exists(inp) else {}
out=json.load(open(out_path)) if os.path.exists(out_path) else {}
def norm(s): s=unicodedata.normalize('NFKD',s); s=''.join(c for c in s if not unicodedata.combining(c)); return re.sub(r'[^a-z]','',s.lower())
cands=[p for p in d['people'] if p['key'] in old]
cands.sort(key=lambda p:-len(p['pres']))
UA={'User-Agent':'ASC2026ConferenceApp/0.1 (mailto:bartomccoy@gmail.com)'}
def q(p):
    if p['key'] in out: return
    name=p['name']; toks=name.split(); first=norm(toks[0]); last=norm(toks[-1])
    url='https://api.crossref.org/works?'+urllib.parse.urlencode({'filter':'issn:1051-8223','query.author':name,'rows':400,'select':'title,issued,DOI,author','sort':'issued','order':'desc','mailto':'bartomccoy@gmail.com'})
    for attempt in range(5):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=120)
            j=json.loads(r.read().decode())['message']
            n=0; recent=[]
            for it in j['items']:
                ok=False
                for a in it.get('author',[]):
                    fam=norm(a.get('family','')); giv=norm(a.get('given',''))
                    if fam!=last: continue
                    if not giv or not first: ok=True; break
                    # given may be initials ("P." / "P. C.") or full
                    if giv==first or giv.startswith(first) or first.startswith(giv) or giv[0]==first[0] and len(giv)<=2: ok=True; break
                if ok:
                    n+=1
                    if len(recent)<5:
                        y=(it.get('issued',{}).get('date-parts') or [[None]])[0][0]
                        recent.append({'t':(it.get('title') or [''])[0],'y':y,'doi':it.get('DOI','')})
            out[p['key']]={'n':n,'capped':j['total-results']>400,'recent':recent}
            time.sleep(0.6); return
        except Exception as e:
            print('retry',name,e,file=sys.stderr); time.sleep(4*(attempt+1))
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
    for i,_ in enumerate(ex.map(q,cands)):
        if i%50==0: json.dump(out,open(out_path,'w')); print('progress',i,file=sys.stderr)
json.dump(out,open(out_path,'w')); print('DONE exact',len(out),file=sys.stderr)
