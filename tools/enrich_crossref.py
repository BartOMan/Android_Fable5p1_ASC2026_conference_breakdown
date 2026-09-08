#!/usr/bin/env python3
"""Count IEEE Transactions on Applied Superconductivity (ISSN 1051-8223) papers per author name via Crossref."""
import json,urllib.request,urllib.parse,time,sys,os,concurrent.futures
S=os.environ.get('ASC_SCRATCH','/tmp/claude-0/-home-user-Android-Fable5p1-ASC2026-conference-breakdown/22e803a5-16ae-5ba4-91b7-cbd9a897b501/scratchpad')
d=json.load(open(S+'/build/data.json'))
out_path=S+'/build/enrich_crossref.json'
out=json.load(open(out_path)) if os.path.exists(out_path) else {}
cands=[p for p in d['people'] if len(p['pres'])>=3 or p.get('chairs') or p['invited'] or p.get('plenary')]
cands.sort(key=lambda p:-len(p['pres']))
print('candidates',len(cands),file=sys.stderr)
def q(p):
    if p['key'] in out: return
    name=p['name']
    url='https://api.crossref.org/works?'+urllib.parse.urlencode({'filter':'issn:1051-8223','query.author':name,'rows':5,'select':'title,issued,DOI,author','sort':'issued','order':'desc','mailto':'bartomccoy@gmail.com'})
    for attempt in range(4):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'ASC2026ConferenceApp/0.1 (mailto:bartomccoy@gmail.com)'}),timeout=60)
            j=json.loads(r.read().decode())['message']
            last=p['key'].split()[-1]; first=p['key'].split()[0]
            items=[]
            for it in j['items']:
                # keep only items where an author family name matches
                ok=any(a.get('family','').lower().replace('-','').replace(' ','')==last for a in it.get('author',[]))
                if not ok: continue
                y=(it.get('issued',{}).get('date-parts') or [[None]])[0][0]
                items.append({'t':(it.get('title') or [''])[0],'y':y,'doi':it.get('DOI','')})
            # a tighter count: query with quoted full name
            url2='https://api.crossref.org/works?'+urllib.parse.urlencode({'filter':'issn:1051-8223','query.author':'"%s"'%name,'rows':0,'mailto':'bartomccoy@gmail.com'})
            r2=urllib.request.urlopen(urllib.request.Request(url2,headers={'User-Agent':'ASC2026ConferenceApp/0.1 (mailto:bartomccoy@gmail.com)'}),timeout=60)
            n2=json.loads(r2.read().decode())['message']['total-results']; time.sleep(0.5)
            out[p['key']]={'n':n2,'loose':j['total-results'],'recent':items[:5]}
            return
        except Exception as e:
            print('retry',name,e,file=sys.stderr); time.sleep(3*(attempt+1))
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
    for i,_ in enumerate(ex.map(q,cands)):
        if i%50==0:
            json.dump(out,open(out_path,'w')); print('progress',i,file=sys.stderr)
json.dump(out,open(out_path,'w')); print('DONE crossref',len(out),file=sys.stderr)
