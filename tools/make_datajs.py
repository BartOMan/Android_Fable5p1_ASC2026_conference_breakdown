#!/usr/bin/env python3
"""Merge enrichment (Crossref TASC counts, Wikipedia photos) into data.json and emit app/www/data.js."""
import json,os,sys,re
S=os.environ.get('ASC_SCRATCH','/tmp/claude-0/-home-user-Android-Fable5p1-ASC2026-conference-breakdown/22e803a5-16ae-5ba4-91b7-cbd9a897b501/scratchpad')
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d=json.load(open(S+'/build/data.json'))
cx=json.load(open(S+'/build/enrich_crossref_exact.json')) if os.path.exists(S+'/build/enrich_crossref_exact.json') else {}
wk=json.load(open(S+'/build/enrich_wiki.json')) if os.path.exists(S+'/build/enrich_wiki.json') else {}
# attach to the most prolific person for each name key
best={}
for p in d['people']:
    k=p['key']
    if k not in best or len(p['pres'])>len(best[k]['pres']): best[k]=p
nt=nw=0
for k,v in cx.items():
    if k in best and v.get('n') is not None and v['n']>0:
        GK={'theta':'θ','varepsilon':'ε','epsilon':'ε','mu':'μ','alpha':'α','beta':'β','gamma':'γ','delta':'δ','lambda':'λ','sigma':'σ','omega':'ω','rho':'ρ','tau':'τ','phi':'φ','pi':'π','kappa':'κ','eta':'η','nu':'ν','chi':'χ','psi':'ψ','xi':'ξ'}
        def detex(t):
            t=re.sub(r'\\([A-Za-z]+)',lambda mm:GK.get(mm.group(1),mm.group(1)),t)
            t=re.sub(r'_\{([^}]*)\}',r'\1',t); t=re.sub(r'\^\{([^}]*)\}',r'^\1',t)
            return t.replace('$','').replace('{','').replace('}','')
        rec=[{'t':detex(r['t']),'y':r['y'],'doi':r['doi']} for r in v.get('recent',[])]
        best[k]['tasc']={'n':v['n'],'recent':rec,'capped':bool(v.get('capped'))}; nt+=1
for k,v in wk.items():
    if k in best and v.get('found') and not re.search(r'\(\d+[–-]\d+\)|statesman|ancient|century|BC\b|dynasty',(v.get('desc','')+' '+v.get('extract','')),re.I):
        p=best[k]; p['wiki']={'title':v['title'],'url':v['url'],'extract':v.get('extract','')}
        if v.get('photo') and not p.get('photo'): p['photo']=v['photo']; p['photoCredit']='Wikimedia Commons / Wikipedia'; p['photoUrl']=v['url']; nw+=1
# drop heavy fields not needed by the app
for p in d['presentations']:
    for a in p['affs']: a.pop('dept',None) if False else None
js='window.ASC_DATA='+json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('\ufffd','')+';'
open(os.path.join(root,'app/www/data.js'),'w',encoding='utf-8').write(js)
json.dump(d,open(os.path.join(root,'app/data.json'),'w'),ensure_ascii=False)
print('data.js',len(js),'bytes; tasc attached',nt,'wiki photos',nw)
